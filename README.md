# NakoPay for BigCommerce

Add Bitcoin, Lightning, and altcoin payments to your BigCommerce store. Orders
settle wallet-to-wallet with a flat 1% fee.

[![Status](https://img.shields.io/badge/status-stable-blue)](https://nakopay.com/integrations/bigcommerce)
[![License](https://img.shields.io/badge/license-MIT-green)](../LICENSE)

## Requirements

- Node.js 18+
- A [BigCommerce store](https://www.bigcommerce.com/) (Standard plan or higher)
- A [BigCommerce developer account](https://developer.bigcommerce.com/)
- A NakoPay account ([sign up free](https://nakopay.com))
- A server with a public HTTPS URL

## Setup

### 1. Create a BigCommerce app

1. Go to [BigCommerce Dev Tools](https://devtools.bigcommerce.com/) > My Apps > Create an App
2. Set the Auth Callback URL to `https://your-server.com/auth/callback`
3. Set the Load Callback URL to `https://your-server.com/load`
4. Set the Uninstall Callback URL to `https://your-server.com/uninstall`
5. Under OAuth Scopes, select: Orders (modify), Order Transactions (modify)
6. Note your **Client ID** and **Client Secret**

### 2. Clone and install

```bash
git clone https://github.com/NakoPayHQ/plugin-bigcommerce.git
cd plugin-bigcommerce
npm install
```

### 3. Configure

```bash
cp .env.example .env
```

Edit `.env` with your BigCommerce and NakoPay credentials.

### 4. Start

```bash
npm run dev    # development
npm start      # production
```

### 5. Install on your store

Go to your BigCommerce admin > Apps > My Draft Apps > NakoPay > Install

### 6. Configure NakoPay webhook

Set the webhook URL at [nakopay.com/dashboard/webhooks](https://nakopay.com/dashboard/webhooks):

```
https://your-server.com/nakopay-webhook
```

Subscribe to: `invoice.paid`, `invoice.expired`, `invoice.canceled`

## How it works

1. Customer proceeds to checkout on your BigCommerce store
2. Selects "Pay with Bitcoin via NakoPay"
3. Gets redirected to NakoPay's hosted checkout (QR code + address)
4. Pays with Bitcoin
5. NakoPay webhook fires, app updates the BigCommerce order status
6. Order moves to "Awaiting Fulfillment"

## Supported features

- [x] Checkout redirect payments
- [x] HMAC-SHA256 webhook verification
- [x] Automatic order status updates
- [x] OAuth app install flow
- [x] SQLite session storage
- [x] Test/live mode

## Support

- [Open a GitHub issue](https://github.com/NakoPayHQ/plugin-bigcommerce/issues)
- [NakoPay documentation](https://nakopay.com/docs)
- [Contact support](https://nakopay.com/contact)

## About BigCommerce

[BigCommerce](https://www.bigcommerce.com/) - e-commerce platform for growing businesses. Visit their website to learn more about the platform and its features.

## License

MIT
