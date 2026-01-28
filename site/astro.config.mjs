import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jem-computer.github.io',
  base: '/esoterica',
  build: {
    assets: '_assets'
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});
