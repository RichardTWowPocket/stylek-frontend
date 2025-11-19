import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import { cookies } from 'next/headers';

// Backend uses global prefix 'api', so we need to include it
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export const authOptions: NextAuthOptions = {
  providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          authorization: {
            params: {
              prompt: 'consent',
              access_type: 'offline',
              response_type: 'code',
            },
          },
          // Allow passing custom state/params
          checks: ['state'],
        }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const { accessToken, user, hasProfile } = response.data;

          if (accessToken && user) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
              brandId: user.brandId,
              creatorId: user.creatorId,
              accessToken,
              hasProfile: hasProfile ?? 0,
            };
          }

          return null;
        } catch (error: any) {
          const message =
            error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === 'google') {
        try {
          // Get intendedRole from cookie (set before OAuth in register pages)
          let intendedRole: 'BRAND' | 'CREATOR' | undefined;
          
          const cookieStore = await cookies();
          const intendedRoleCookie = cookieStore.get('nextauth_intended_role');
          if (intendedRoleCookie?.value === 'BRAND' || intendedRoleCookie?.value === 'CREATOR') {
            intendedRole = intendedRoleCookie.value as 'BRAND' | 'CREATOR';
          }
          
          console.log('Google OAuth: Using intendedRole:', intendedRole);
          
          // Call backend with intendedRole
          const response = await axios.post(
            `${API_BASE_URL}/auth/google`,
            {
              accessToken: account.access_token,
              idToken: account.id_token,
              email: user.email,
              name: user.name,
              image: user.image,
              intendedRole, // Pass intendedRole to backend
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const { accessToken, user: backendUser, hasProfile } = response.data;

          if (accessToken && backendUser) {
            console.log('Google OAuth: User created with role:', backendUser.role);
            // Update user object with backend data
            user.id = backendUser.id;
            user.role = backendUser.role;
            user.brandId = backendUser.brandId;
            user.creatorId = backendUser.creatorId;
            user.accessToken = accessToken;
            user.hasProfile = hasProfile ?? 0;
            
            // Clear the intendedRole cookie after successful auth
            try {
              const cookieStore = await cookies();
              cookieStore.delete('nextauth_intended_role');
            } catch (e) {
              // Ignore cookie deletion errors
            }
            
            return true;
          }

          console.error('Google OAuth: Missing accessToken or user data');
          return false;
        } catch (error: any) {
          console.error('Google OAuth error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          // Return false to prevent sign in
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.brandId = user.brandId;
        token.creatorId = user.creatorId;
        token.accessToken = user.accessToken;
        token.hasProfile = user.hasProfile ?? 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.brandId = token.brandId;
        session.user.creatorId = token.creatorId;
      }
      session.accessToken = token.accessToken;
      session.hasProfile = token.hasProfile ?? 0;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // For onboarding pages, redirect directly (session is already established)
      // The middleware will ensure user is authenticated before accessing onboarding
      if (url?.includes('/brand/onboarding')) {
        return `${baseUrl}/brand/onboarding`;
      }
      if (url?.includes('/creator/onboarding')) {
        return `${baseUrl}/creator/onboarding`;
      }
      // If redirecting to login page, let login page handle the redirect via useEffect
      if (url === `${baseUrl}/login` || url === `${baseUrl}/login?callbackUrl=${baseUrl}/login`) {
        return `${baseUrl}/login`;
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

