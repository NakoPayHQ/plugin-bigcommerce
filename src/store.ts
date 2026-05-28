import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'bigcommerce.db');
let db: Database.Database;

export function initDb(): void {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      store_hash TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      scope TEXT,
      email TEXT
    );
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      store_hash TEXT NOT NULL,
      nakopay_invoice_id TEXT,
      status TEXT DEFAULT 'pending'
    );
  `);
}

export function getDb(): Database.Database { return db; }

export function saveStore(storeHash: string, accessToken: string, scope: string, email: string): void {
  db.prepare(`INSERT OR REPLACE INTO stores (store_hash, access_token, scope, email) VALUES (?, ?, ?, ?)`)
    .run(storeHash, accessToken, scope, email);
}

export function getStore(storeHash: string): any {
  return db.prepare(`SELECT * FROM stores WHERE store_hash = ?`).get(storeHash);
}

export function saveOrder(orderId: string, storeHash: string, invoiceId: string): void {
  db.prepare(`INSERT OR REPLACE INTO orders (order_id, store_hash, nakopay_invoice_id) VALUES (?, ?, ?)`)
    .run(orderId, storeHash, invoiceId);
}

export function getOrderByInvoice(invoiceId: string): any {
  return db.prepare(`SELECT * FROM orders WHERE nakopay_invoice_id = ?`).get(invoiceId);
}
