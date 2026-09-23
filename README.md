# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Tasting dates (Understory)

The `/smagninger` page reads public, active events for the existing Vermouth tasting
experience from Understory. It lists sessions at Bunker526, using the local times returned
by Understory and Danish date formatting. On each server page load, Understory is queried for events starting from the
current Danish time. Only public, active events are shown. There is no browser timer or application cache. If Understory is
unavailable, the dates are hidden and the booking link remains available.

Create an internal integration key with `event.read` access in Understory's
Company settings → Integrations. Configure these private environment variables:

```dotenv
UNDERSTORY_CLIENT_ID=
UNDERSTORY_CLIENT_SECRET=
```

Use `.env` locally and set both as secrets in the Cloudflare deployment environment.
Never prefix them with `PUBLIC_` or commit their values. The experience ID is configured in `src/routes/smagninger/+page.server.ts`.
