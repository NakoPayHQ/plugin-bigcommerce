/**
 * NakoPay BigCommerce App - main entry point.
 *
 * Flow:
 *   1. Merchant installs via BigCommerce App Marketplace (or direct install)
 *   2. OAuth grants access to the store's API
 *   3. App creates a custom checkout redirect payment method
 *   4. At checkout, customer is redirected to NakoPay hosted invoice
 *   5. After payment, NakoPay webhook fires and we update the BC order
 */

import express from 'express';
import { config } from './config';
import { setupAuth } from './routes/auth';
import { setupCheckout } from './routes/checkout';
import { setupWebhook } from './routes/webhook';
import { initDb } from './store';

const app = express();

initDb();
setupAuth(app);
setupCheckout(app);
setupWebhook(app);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'nakopay-bigcommerce', version: '0.1.0' });
});

app.listen(config.PORT, () => {
  console.log(`NakoPay BigCommerce app listening on port ${config.PORT}`);
});
