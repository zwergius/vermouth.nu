# Quantity offers during Medusa tier discovery work

The existing product requests include `*variants.prices` alongside calculated prices. Grid cards and product details read ordinary tiers from their own selected variant. There is no separate offer request, server map, or per-variant environment configuration.

The adapter accepts currency-matching, rule-free ordinary prices and a tax-inclusive calculated price. Unsupported rules/tax treatment, malformed data and missing tiers hide offers; ordinary product pricing remains available. Region/currency/tax policy remains owned by the existing storefront and Medusa.

Grid markup and product-detail buttons live directly in their respective views. Both reuse the quantity calculations and the existing `formatPrice` helper (with an optional currency-first format). Each preview uses the lowest applicable ordinary unit amount capped by the current single-bottle price; only positive incremental savings produce comparison totals. Cart and checkout continue to use Medusa and existing actions.

Forzudo Rojo in staging has ordinary tier copies for development. Volume Discount remains the administrative source of truth, but copies are not automatically synchronized. A workflow-based synchronizer is only a recorded idea, not implemented. Reverify copies against the Price List and cart after configuration changes.

Public Store product responses still omit Price List tiers: https://github.com/medusajs/medusa/issues/16836. In particular, raw ordinary tiers cannot reveal hidden quantity-specific price-list overrides. Removing the allowlist does not resolve this upstream limitation; source selection and production rollout remain tracked separately. Do not assume a future Price List response has the same structure or eligibility guarantees.

Run `pnpm test:unit --run`, `pnpm check`, and `PLAYWRIGHT_BASE_URL=http://localhost:5173 pnpm test:integration tests/quantity-offers.spec.ts` against a local preview using the staging catalog. The focused browser tests require the configured Forzudo Rojo fixture; no feature-specific environment variable is needed.
