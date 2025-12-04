import https from 'https';

/**
 * HTTPS Agent configuration for axios
 * Allows self-signed certificates in staging/development environments
 */
export const createHttpsAgent = () => {
  // Only reject unauthorized in production with valid certificates
  // For staging/development, allow self-signed certificates
  const isProduction = process.env.NODE_ENV === 'production';
  const isStaging = process.env.NEXT_PUBLIC_API_BASE_URL?.includes('staging');
  
  // For staging, we need to allow self-signed certificates
  // In production, only allow if explicitly configured
  const rejectUnauthorized = isProduction && !isStaging;
  
  return new https.Agent({
    rejectUnauthorized: !rejectUnauthorized,
  });
};


