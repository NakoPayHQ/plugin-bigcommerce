# Changelog
## 1.1.0 - 2026-05-17

### Changed
- Default NAKOPAY_API_BASE env fallback is now https://api.nakopay.com/v1 (branded). Override via env var as before.

## 0.1.0 - 2026-05-02

### Added
- Initial release
- BigCommerce OAuth app install flow
- Checkout redirect to NakoPay hosted invoice
- NakoPay webhook handler with HMAC-SHA256 verification
- BigCommerce Orders API integration for status updates
- SQLite session storage
