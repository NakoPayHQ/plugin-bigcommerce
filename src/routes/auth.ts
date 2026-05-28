import express from 'express';
import { config } from '../config';
import { saveStore } from '../store';

export function setupAuth(app: express.Express): void {
  app.get('/auth', (req, res) => {
    const installUrl = `https://login.bigcommerce.com/app/${config.BC_CLIENT_ID}/install`;
    res.redirect(installUrl);
  });

  app.get('/auth/callback', async (req, res) => {
    const { code, scope, context } = req.query as Record<string, string>;
    if (!code || !context) return res.status(400).send('Missing parameters');

    const storeHash = context.replace('stores/', '');

    const tokenResp = await fetch('https://login.bigcommerce.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: config.BC_CLIENT_ID,
        client_secret: config.BC_CLIENT_SECRET,
        code,
        scope,
        grant_type: 'authorization_code',
        redirect_uri: config.BC_AUTH_CALLBACK,
        context,
      }),
    });

    if (!tokenResp.ok) {
      return res.status(500).send('Failed to get access token');
    }

    const data = await tokenResp.json() as any;
    saveStore(storeHash, data.access_token, scope, data.user?.email || '');

    res.send('NakoPay installed successfully. You can close this tab.');
  });

  app.get('/load', (_req, res) => res.send('NakoPay BigCommerce App'));
  app.get('/uninstall', (_req, res) => res.sendStatus(200));
}
