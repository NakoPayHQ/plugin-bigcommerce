function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`${key} environment variable is required`);
  return val;
}

export const config = {
  BC_CLIENT_ID: requireEnv('BC_CLIENT_ID'),
  BC_CLIENT_SECRET: requireEnv('BC_CLIENT_SECRET'),
  BC_AUTH_CALLBACK: process.env.BC_AUTH_CALLBACK || 'https://your-server.com/auth/callback',

  NAKOPAY_API_KEY: requireEnv('NAKOPAY_API_KEY'),
  NAKOPAY_WEBHOOK_SECRET: process.env.NAKOPAY_WEBHOOK_SECRET || '',
  NAKOPAY_API_BASE: process.env.NAKOPAY_API_BASE || 'https://daslrxpkbkqrbnjwouiq.supabase.co/functions/v1',

  HOST: process.env.HOST || 'https://your-server.com',
  PORT: parseInt(process.env.PORT || '3000', 10),
};
