/**
 * NakoPay webhook handler for BigCommerce.
 * Updates BigCommerce order status via the V2 Orders API.
 */

import express from 'express';
import crypto from 'crypto';
import { config } from '../config';
import { getOrderByInvoice, getStore } from '../store';

function verifySignature(rawBody: string, sigHeader: string): boolean {
  const secret = config.NAKOPAY_WEBHOOK_SECRET;
  if (!secret || !sigHeader) return false;

  const parts: Record<string, string> = {};
  for (const kv of sigHeader.split(',')) {
    const trimmed = kv.trim();
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    parts[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  if (!parts.t || !parts.v1) return false;

  const t = parseInt(parts.t, 10);
  if (Math.abs(Math.floor(Date.now() / 1000) - t) > 300) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
}

export function setupWebhook(app: express.Express): void {
  app.post('/nakopay-webhook', express.raw({ type: '*/*' }), async (req, res) => {
    const rawBody = req.body.toString();
    const sig = req.headers['x-nakopay-signature'] as string || '';

    if (!verifySignature(rawBody, sig)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type as string;
    const invoice = payload.data as Record<string, unknown>;
    const invoiceId = invoice.id as string;

    const order = getOrderByInvoice(invoiceId);
    if (!order) {
      return res.status(200).json({ ok: true, resolved: false });
    }

    const store = getStore(order.store_hash);
    if (!store) {
      return res.status(200).json({ ok: true, resolved: false });
    }

    if (eventType === 'invoice.paid') {
      await updateBcOrderStatus(store, order.order_id, 11); // 11 = Awaiting Fulfillment
    } else if (eventType === 'invoice.expired' || eventType === 'invoice.canceled') {
      await updateBcOrderStatus(store, order.order_id, 6); // 6 = Declined
    }

    return res.status(200).json({ ok: true });
  });
}

async function updateBcOrderStatus(store: any, orderId: string, statusId: number): Promise<void> {
  const url = `https://api.bigcommerce.com/stores/${store.store_hash}/v2/orders/${orderId}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Auth-Token': store.access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ status_id: statusId }),
  });

  if (!resp.ok) {
    console.error(`BigCommerce order update failed [${resp.status}]:`, await resp.text());
  }
}
