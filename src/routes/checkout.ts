/**
 * Checkout redirect handler.
 * BigCommerce redirects the customer here during checkout.
 * We create a NakoPay invoice and redirect to the hosted payment page.
 */

import express from 'express';
import crypto from 'crypto';
import { config } from '../config';
import { getStore, saveOrder } from '../store';

// v1 paths are pass-through kebab-case on every supported base URL.
function resolveEndpoint(name: string): string {
  return name;
}

export function setupCheckout(app: express.Express): void {
  app.get('/checkout/redirect', async (req, res) => {
    const { store_hash, order_id, amount, currency } = req.query as Record<string, string>;

    if (!store_hash || !order_id || !amount) {
      return res.status(400).send('Missing required parameters');
    }

    const store = getStore(store_hash);
    if (!store) {
      return res.status(401).send('Store not installed');
    }

    const invoiceResp = await fetch(
      `${config.NAKOPAY_API_BASE.replace(/\/$/, '')}/${resolveEndpoint('invoices-create')}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.NAKOPAY_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NakoPay-BigCommerce/0.1.0',
          'X-NakoPay-Version': '2025-04-20',
          'Idempotency-Key': `bc_${store_hash}_${order_id}`,
        },
        body: JSON.stringify({
          amount,
          currency: (currency || 'USD').toUpperCase(),
          coin: 'BTC',
          description: `BigCommerce Order #${order_id}`,
          metadata: { source: 'bigcommerce', store_hash, order_id },
        }),
      }
    );

    const invoice = await invoiceResp.json() as Record<string, unknown>;

    if (!invoiceResp.ok || !invoice.checkout_url) {
      return res.status(500).send('Could not create payment invoice');
    }

    saveOrder(order_id, store_hash, invoice.id as string);
    res.redirect(invoice.checkout_url as string);
  });
}
