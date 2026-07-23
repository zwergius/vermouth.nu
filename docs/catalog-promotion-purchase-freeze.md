# Catalog promotion purchase freeze

The storefront supports a temporary purchase freeze for catalog promotions. Browsing and cart-line
removal remain available while add/update cart actions, checkout submission, and payment creation
are blocked in both the interface and server routes.

## Activate

1. Set the private runtime environment variable `PURCHASES_PAUSED=true` for the target deployment.
2. Deploy the storefront configuration.
3. Verify the pause notice is visible on a product page and the cart page.
4. Verify product quantity/add controls and checkout controls are disabled.
5. Verify a direct POST to the cart quantity and checkout actions returns a SvelteKit failure result
   with status `503`.
6. Verify a direct request to `/betaling` returns `503` and does not create an ePay payment.
7. Run `pnpm test:purchase-freeze`.
8. Begin the reviewed catalog promotion only after all checks pass.

## Deactivate

1. Complete the catalog, media, URL, price, cart, analytics, and email smoke checks.
2. Set `PURCHASES_PAUSED=false` or remove the variable.
3. Deploy the storefront configuration.
4. Verify a representative product can be added to the cart and continued to payment.

Purchases are enabled by default. Values other than a case-insensitive, whitespace-tolerant `true`
do not activate the freeze.
