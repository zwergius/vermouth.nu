import adapter from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/kit/vite"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    //  By default, `npm run build` will create a standard Node app.
    //  You can create optimized builds for different platforms by
    //  specifying a different adapter
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: "build",
      assets: "build",
      fallback: "index.html",
      precompress: false,
      strict: true,
    }),

    prerender: {
      crawl: true,
      //enabled: true,
      // onError: ({ status, path, referrer, referenceType }) => {
      //   if (path.startsWith('/blog')) throw new Error('Missing a blog page!');
      //   console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
      // },
    },
  },
}

export default config
