# Quantity offers during Medusa tier discovery work

The UI consumes `QuantityPricing` independently of its source. The temporary Store adapter reads ordinary variant tier copies; it does not discover or authorize Price List offers. Volume Discount remains the administrative source of truth. A workflow-based synchronizer is only a recorded idea, not implemented.

Offers default to off. For a verified nonproduction variant, set the private server variable `QUANTITY_OFFER_VARIANT_IDS` to its ID (comma-separated for multiple verified variants). Start the normal development server with this variable. Never put an Admin credential in storefront public configuration.

Only opt a variant in after its copied tiers match the active Price List and cart prices for the current context, including quantity decreases. Recheck after any price-list change; copies are not automatically synchronized. Do not enable this temporary path in production without resolving rollout requirements. Public product responses cannot reveal hidden quantity-specific price-list conflicts.

The adapter accepts currency-matching, rule-free ordinary prices and the storefront's tax-inclusive calculated price. Unknown rules/tax treatment, malformed data, missing tiers and discovery failures hide offers; normal product pricing and purchasing remain available. This conservative limitation belongs to the temporary source, not the UI contract. Region/currency/tax policy remains owned by the existing storefront and Medusa.

The root server loader passes a normalized map keyed by exact variant ID to grid and product details. Quantities come from configured bounds. Each preview uses the lowest applicable verified unit amount capped by the current single-bottle price; only positive incremental savings produce comparison totals. Cart and checkout continue to use Medusa and existing actions.

Replace `loadQuantityOffers` and its adapter after the upstream contract is settled: https://github.com/medusajs/medusa/issues/16836. Do not assume a future Price List response uses the same raw structure or eligibility guarantees.

Run `pnpm test:unit --run src/lib/helpers/quantity-pricing.test.ts src/lib/medusa/quantity-pricing.test.ts`, `pnpm check`, and the focused quantity-offer browser tests against a development server with a verified test variant enabled.
