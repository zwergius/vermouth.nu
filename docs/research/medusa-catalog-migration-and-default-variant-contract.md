# Medusa catalog migration and default-variant contract

Research for [Choose the Medusa catalog migration and default-variant contract](https://linear.app/zwergius/issue/VNU-28/choose-the-medusa-catalog-migration-and-default-variant-contract), performed 2026-07-18.

## Decision

Use a source-controlled, idempotent Medusa custom CLI script, executed explicitly with `medusa exec`, to migrate the catalog. The script should read a reviewed catalog manifest, resolve products by handle, assign and validate globally unique variant SKUs, replace the placeholder option with the canonical `Size` option and real values, set translated/customer-facing variant titles, create or update the required variants and prices through Medusa workflows, and set `product.metadata.default_variant_sku` only after confirming that the SKU belongs to that product.

Do not use a schema migration, an Admin-only checklist, CSV import, startup hook, or implicit `predeploy` execution for this catalog-data change. Database migrations remain for schema/module changes; Medusa documents custom CLI scripts as the supported mechanism for database seeding and one-off container-aware work, and recommends using Medusa workflows from those scripts ([custom CLI scripts](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts), [seed data with a custom CLI script](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts/seed-data)).

Keep `metadata.default_variant_sku` as the explicit default contract. Medusa 2.13.4 has no first-class default-variant relation or property on `Product`; `ProductVariant.variant_rank` only controls ordering. Product metadata is the smallest supported extension point, while SKU is a unique, environment-independent commerce identifier ([Medusa 2.13.4 Product model](https://github.com/medusajs/medusa/blob/v2.13.4/packages/modules/product/src/models/product.ts), [ProductVariant model and SKU index](https://github.com/medusajs/medusa/blob/v2.13.4/packages/modules/product/src/models/product-variant.ts)).

## Repository and runtime evidence

- The actual backend is [Oak-Digital/vermouth-nu](https://github.com/Oak-Digital/vermouth-nu). At inspected revision [`aee1529`](https://github.com/Oak-Digital/vermouth-nu/commit/aee15291801c3b7f36deed93b4be50458f9d5321), `apps/ecommerce` pins Medusa packages to **2.13.4**. Its package scripts expose `medusa exec`, `medusa db:migrate`, and `medusa db:sync-links`; `seed` points to `src/scripts/seed.ts`, but that file is absent from the repository ([backend package](https://github.com/Oak-Digital/vermouth-nu/blob/aee15291801c3b7f36deed93b4be50458f9d5321/apps/ecommerce/package.json), [scripts directory](https://github.com/Oak-Digital/vermouth-nu/tree/aee15291801c3b7f36deed93b4be50458f9d5321/apps/ecommerce/src/scripts)). There is therefore an established script location and command, but no reusable product-data migration implementation to extend.
- Backend CI installs, formats, type-checks, builds, and lints; it does not deploy or run catalog scripts. The repository does not document the external hosting release command ([backend CI](https://github.com/Oak-Digital/vermouth-nu/blob/aee15291801c3b7f36deed93b4be50458f9d5321/.github/workflows/ci.yml)). The production catalog migration must therefore be an explicit release-runbook step owned by the deployment platform, not assumed from repository automation.
- The storefront pins `@medusajs/js-sdk` and `@medusajs/types` to **2.13.1**, three patch releases behind the backend ([storefront package](https://github.com/zwergius/vermouth.nu/blob/b1d4b4a0c45ddb69912aaca21499e8dd35ffae2c/package.json)). The used Store Product shapes are compatible, but implementation should align both packages to the backend patch or validate the metadata/variant types locally instead of assuming untyped metadata is correct.
- An authenticated read-only inspection of the configured [live Store Products API](https://medusa.vermouth-nu.hz2.oaklab.cloud/store/products) on 2026-07-18 returned 14 products. Thirteen still used `Default option` / `Default option value`; Sardino Rojo already used `Size` with raw values `0.75` and `5`. Nine variants had a null SKU, and no product had `default_variant_sku`. This makes SKU assignment and preflight validation prerequisites, not cleanup that can follow URL/default rollout.

## Why a custom workflow-backed script

Medusa's `updateProductsWorkflow` supports product metadata and nested variant updates, including a variant's title, SKU, and option assignment. The dedicated option and variant workflows also preserve previous data in compensating steps ([update products workflow](https://github.com/medusajs/medusa/blob/v2.13.4/packages/core/core-flows/src/product/workflows/update-products.ts), [update product options step](https://github.com/medusajs/medusa/blob/v2.13.4/packages/core/core-flows/src/product/steps/update-product-options.ts), [update product variants step](https://github.com/medusajs/medusa/blob/v2.13.4/packages/core/core-flows/src/product/steps/update-product-variants.ts)). Medusa nested workflows executed with `runAsStep` participate in the parent workflow's compensation if a later step fails ([execute nested workflows](https://docs.medusajs.com/learn/fundamentals/workflows/execute-another-workflow), [compensation functions](https://docs.medusajs.com/learn/fundamentals/workflows/compensation-function)).

The backend implementation should therefore have:

1. A versioned catalog manifest containing product handles, the desired variants, required SKU, customer-facing title, `Size` value, prices, and `default_variant_sku`. Do not store environment-specific Medusa IDs in it.
2. A custom catalog-migration workflow that composes Medusa's option/product/variant/create/price workflows with `runAsStep`, so a failed application compensates completed steps.
3. A thin `src/scripts/migrate-product-catalog.ts` entry point that performs `--dry-run`, `--apply`, `--verify`, and `--rollback <snapshot>` modes through `medusa exec`.
4. Package commands with an explicit version, such as `catalog:v1:dry-run`, `catalog:v1:apply`, `catalog:v1:verify`, and `catalog:v1:rollback`. A second successful `apply` must make no changes.

The manifest's first-run matching rules must account for null legacy SKUs. Resolve the product by unique handle; within a single-variant product, match the sole legacy variant; within a multi-variant product, require an unambiguous reviewed legacy fingerprint (existing SKU or option value/title). Abort before writing if any product, variant, or default cannot be matched exactly once. After the first application, desired SKU is the only identity.

## Default-variant contract

The contract is:

```text
product.metadata.default_variant_sku: non-empty string
```

For every published storefront product:

- the key is required;
- exactly one variant on the same product has that SKU;
- every variant SKU is non-null and globally unique;
- the referenced variant is the normal default regardless of inventory; inventory-aware fallback remains owned by the separate inventory effort;
- no consumer infers the default from array position, `variant_rank`, size text, title, price, or translated content.

Product metadata is appropriate here because Medusa explicitly supports metadata for custom integration information and merges metadata updates rather than replacing unrelated keys ([Store API metadata rules](https://docs.medusajs.com/api/store#manage-metadata)). The script must still read, merge, and verify the product's existing metadata defensively because metadata is not schema-validated. A variant-level `is_default` flag is rejected because it permits zero or multiple defaults and duplicates product-level truth. A custom module/link is also rejected for one scalar reference unless future requirements need richer default-selection rules.

## Store API implications

In Medusa 2.13.4, product metadata is **not** among the default Store Product fields, while options, option values, variants, and variant options are ([2.13.4 Store Product query config](https://github.com/medusajs/medusa/blob/v2.13.4/packages/medusa/src/api/store/products/query-config.ts)). The storefront's current detail request adds categories and calculated prices but does not request metadata ([current detail load](https://github.com/zwergius/vermouth.nu/blob/b1d4b4a0c45ddb69912aaca21499e8dd35ffae2c/src/routes/sortiment/%5Bslug%3Dvermouth%5D/%2Bpage.ts#L76-L80)).

Every product query that needs to build a product-detail URL or choose a default must therefore add `+metadata` while retaining the required relations and calculated prices. Medusa's `fields` syntax uses `+` to add a scalar field to route defaults and `*` to select a relation ([Store API field selection](https://docs.medusajs.com/api/store#select-fields-and-relations)). At the storefront boundary, parse `metadata.default_variant_sku` as an unknown value, require a string, and verify it against the returned product variants before using it.

## Translation implications

Medusa 2.13.4 marks `ProductOption.title`, `ProductOptionValue.value`, and `ProductVariant.title` as translatable fields ([option model](https://github.com/medusajs/medusa/blob/v2.13.4/packages/modules/product/src/models/product-option.ts), [option-value model](https://github.com/medusajs/medusa/blob/v2.13.4/packages/modules/product/src/models/product-option-value.ts), [variant model](https://github.com/medusajs/medusa/blob/v2.13.4/packages/modules/product/src/models/product-variant.ts)). However, the actual backend does not register `@medusajs/medusa/translation` or enable the `translation` feature flag ([backend config](https://github.com/Oak-Digital/vermouth-nu/blob/aee15291801c3b7f36deed93b4be50458f9d5321/apps/ecommerce/medusa-config.ts)); Medusa requires both plus database migration before locale records can be served ([Translation Module configuration](https://docs.medusajs.com/resources/commerce-modules/translation#configure-translation-module)). The storefront also does not set a Medusa locale on SDK requests; it only uses the browser locale for formatting ([SDK configuration](https://github.com/zwergius/vermouth.nu/blob/b1d4b4a0c45ddb69912aaca21499e8dd35ffae2c/src/lib/medusa/index.ts), [request hook](https://github.com/zwergius/vermouth.nu/blob/b1d4b4a0c45ddb69912aaca21499e8dd35ffae2c/src/hooks.server.ts)).

For this Danish-only storefront, write the agreed customer-facing Danish packaging labels (`Flaske`, `Pakke`, `Bag-in-Box`) as the original variant titles so they work without locale negotiation. Keep the canonical option title and size-value notation defined by the catalog manifest. Enabling locale-aware Medusa translations is not required for this migration and should not be smuggled into it. If multilingual storefront content becomes a destination later, enable the Translation Module in a separate schema/deployment change, migrate its database tables, populate translations for these three model types, and set `locale` or `x-medusa-locale` on Store API requests; missing translations fall back to original values ([supported translated product models](https://docs.medusajs.com/resources/commerce-modules/translation), [serving translations](https://docs.medusajs.com/resources/commerce-modules/translation/storefront)). `default_variant_sku` remains deliberately untranslated.

## Rollback and deployment gate

Before each environment is changed, `--dry-run` must query and validate the complete target set and write a redacted, environment-specific snapshot of the current product metadata, options, variants, prices, and IDs to protected deployment storage. Do not commit that snapshot. The apply workflow's compensation handles failures during execution; it does not replace an operator-triggered rollback after a successful run.

Rollout order for development, staging, then production:

1. Deploy backend code containing the manifest, workflow, script, and tests without auto-running it.
2. Run dry-run; review the exact create/update plan and snapshot location.
3. Ensure a current database backup exists.
4. Run apply once, then verify. Verification must fail unless every manifest product has one `Size` option, every intended variant has the expected title/value/SKU/price, every default SKU resolves within its product, and a second apply is a no-op.
5. Query the Store API with `+metadata`, variant options, and calculated prices and validate the response contract before enabling the variant-aware storefront.
6. On failure after completion, run rollback against the captured snapshot and verify, or restore the database backup if the scripted rollback cannot prove equivalence.

Do not add this command to `start`, `dev`, or unconditional `predeploy`: repeated application during routine deploys would make merchant catalog data an implicit side effect of application startup. The existing backend `predeploy` is limited to schema migration and link synchronization, and the checked-in CI has no deployment job, so the production command and protected snapshot location must be added to the external platform's release runbook.

## Required implementation checks

- Unit-test manifest validation, null/duplicate SKU rejection, default ownership, legacy matching, metadata preservation, dry-run purity, second-run no-op behavior, and rollback-plan generation.
- Integration-test the custom workflow against Medusa 2.13.4, including compensation after a deliberately injected mid-run failure.
- Test `+metadata` through the Store API, not only Product Module queries.
- Run the complete migration and rollback against a production-shaped staging database before production.
- Pin or align storefront SDK/types with the backend patch during implementation, then type-check the explicit metadata parser.

## Access limitations

The backend source, its first-party GitHub history, the configured live Store API, and the storefront were accessible. The hosting provider's deployment configuration, production database console/backups, Medusa Admin authentication, and workflow execution history were not available. Consequently, the report defines the required explicit release step and backup/snapshot gate but cannot name the platform-specific command runner or storage location.
