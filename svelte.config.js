import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build', // Output directory for static files
      assets: 'build', // Output directory for assets
      fallback: 'index.html', // Fallback for client-side routing
      precompress: false, // Optional: Disable precompression
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : '',
    },
    prerender: {
      // Only prerender routes that are explicitly static
      entries: [], // Empty to avoid prerendering dynamic routes
      handleHttpError: ({ path, message }) => {
        if (message.includes('404')) {
          console.warn(`Resource not found: ${path}`);
          return; // Suppress 404 errors
        }
        throw new Error(message);
      },
    },
  },
  extensions: ['.svelte', '.svx'],
};

export default config;