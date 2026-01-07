import adapter from '@sveltejs/adapter-node';

const config = {
  kit: {
    adapter: adapter(),
    csrf: { 
      trustedOrigins: ['localhost', '127.0.0.1']
    }
  }
};

export default config;
