# Local development and environment setup

Use Node.js 22 or newer and pnpm 10. Install the package manager if missing, then
install the repository dependencies without changing the lockfile:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:unit --run
```

The unit tests, including the rendered order-summary tests, use fixtures and do
not require live service credentials. A passing fixture test does not establish
that a live backend is configured or that a real order was verified.

## Configure live development

Copy `.env.example` to the ignored `.env.local` and supply the values needed for
the features you will exercise. Never commit real values. Only `PUBLIC_` values
are safe to expose to the browser; payment, email, and Understory secrets must
remain private.

| Variables                                                  | Needed for                                                                                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_VITE_BACKEND_URL`, `PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Browsing the catalogue, carts, and live order details through the intended Medusa backend and sales channel.                                           |
| `PUBLIC_POINT_OF_SALE_ID`, `EPAY_API_KEY`                  | Payment sessions; use approved test-service configuration, never production purchases for development verification.                                    |
| `PUBLIC_COOKIE_YES_ID`, `PUBLIC_GA_MEASUREMENT_ID`         | Optional consent and analytics integration. Leave empty when not testing those integrations. This does not disable other existing third-party scripts. |
| `RESEND_API_KEY`, `CANCELLATION_REQUEST_EMAIL_FROM`        | Sending cancellation-request emails. Development skips sending when these are absent; production does not.                                             |
| `CANCELLATION_REQUEST_EMAIL_TO`                            | Optional cancellation recipient; defaults to the existing store inbox.                                                                                 |
| `UNDERSTORY_CLIENT_ID`, `UNDERSTORY_CLIENT_SECRET`         | Live tasting events; without them the tasting page uses its empty state.                                                                               |
| `PURCHASES_PAUSED`                                         | Existing purchase-freeze flag; do not change an environment's activation state as part of routine setup.                                               |

After configuring the required backend values, use `pnpm dev`. Local Playwright
runs use `pnpm test:integration` and build/preview the application. The full suite
includes live backend flows and requires appropriate service configuration; do
not run purchasing or email side effects against production as a setup check.
`PLAYWRIGHT_BASE_URL` selects an already running test deployment instead.

For new checkouts, agents own ordinary dependency installation and identifying
which variables are actually needed. Reuse only approved credentials through the
configured credential helper. If a value or access mapping is unavailable, ask
the human with a real platform mention and list variable names and purpose, not
secret values. Provision secrets through the approved secret store or ignored
local environment file, not chat. Separate fixture-only verification from live
integration verification in the handoff.
