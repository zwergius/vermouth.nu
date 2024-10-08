// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
//
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
// 	// for more information about preprocessors
// 	preprocess: vitePreprocess(),
//
// 	kit: {
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		adapter: adapter()
// 	}
// };
//
// export default config;

import adapter from '@sveltejs/adapter-static'
// import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    prerender: {
      crawl: true,
      handleHttpError: ({ path, message }) => {
        // ignore deliberate link to shiny 404 page
        if (path === '/not-found') {
          return
        }

        // otherwise fail the build
        throw new Error(message)
      },
      entries: [
        '/',
        '/cards/christian',
        '/cards/thomas',
        '/cards/christoffer',
        '/christian-vermouth-nu.pkpass',
        '/christoffer-vermouth-nu.pkpass',
        '/thomas-vermouth-nu.pkpass',
        '/not-found', // Generate 404
      ],
    },
  },
}

export default config
