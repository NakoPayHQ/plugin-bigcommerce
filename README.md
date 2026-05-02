# NakoPay for BigCommerce

Accept Bitcoin and other crypto in BigCommerce with a one-flat-fee, non-custodial
checkout. Wallet-to-wallet - NakoPay never holds your funds.

[![Status](https://img.shields.io/badge/status-beta-blue)](https://nakopay.com/integrations)
[![License](https://img.shields.io/badge/license-MIT-green)](../LICENSE)

## Install

```
Click 'Get this app' on https://apps.bigcommerce.com/nakopay
```

## Configure

1. Get an API key from <https://nakopay.com/dashboard/api-keys>.
2. In BigCommerce admin: Apps → NakoPay → Connect
3. Set the webhook URL shown in the plugin settings inside your NakoPay
   dashboard (Settings → Webhooks).

## Test mode

Use `sk_test_*` keys to run the full checkout against the NakoPay sandbox.
No real funds move. Flip to `sk_live_*` when you're ready for production.

## Supported features

- [x] One-time checkout
- [x] Refunds
- [ ] Subscriptions
- [x] Multi-currency display
- [x] Tax pass-through
- [x] Test mode

## Local development

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the full setup. Quick
start for Node plugins:

- Node stack: see CONTRIBUTING § "Local development per host".
- Run `bash ../scripts/check-no-internal-urls.sh .` before opening a PR.

## Release

Tag-driven from the monorepo:

```
plugins/scripts/release.sh bigcommerce 0.1.0
```

The matching workflow at `.github/workflows/release-bigcommerce.yml` handles the
upload to the marketplace. Full runbook in [`../PUBLISHING.md`](../PUBLISHING.md).

## Issues

File on <https://github.com/NakoPayHQ/plugin-bigcommerce/issues>.

## License

MIT - see [`../LICENSE`](../LICENSE).
