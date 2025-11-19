import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role: 'BRAND' | 'CREATOR' | 'ADMIN';
    brandId?: string;
    creatorId?: string;
    accessToken?: string;
    hasProfile?: 0 | 1;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      role: 'BRAND' | 'CREATOR' | 'ADMIN';
      brandId?: string;
      creatorId?: string;
    };
    accessToken?: string;
    hasProfile?: 0 | 1;
  }
}

    declare module 'next-auth/jwt' {
      interface JWT {
        id: string;
        email: string;
        role: 'BRAND' | 'CREATOR' | 'ADMIN';
        brandId?: string;
        creatorId?: string;
        accessToken?: string;
        hasProfile?: 0 | 1;
      }
    }

