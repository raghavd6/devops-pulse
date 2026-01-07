import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  test: { 
    environment: 'node'
  },
  server: {
    middlewareMode: true,
    hmr: false
  }
};
