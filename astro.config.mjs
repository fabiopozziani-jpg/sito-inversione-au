// @ts-check
import { defineConfig } from 'astro/config';
import wix from '@wix/astro';
import wixPages from '@wix/astro-pages';
import react from '@astrojs/react';
import wixHostingAdapter from '@wix/astro-wix-hosting-adapter';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.inversioneau.com',
  integrations: [wix(), wixPages(), react()],
  security: { checkOrigin: false },
  adapter: wixHostingAdapter(),
  image: { domains: ['static.wixstatic.com'] },
  output: 'server',

  // Redirect 301 dai vecchi URL del sito Wix Editor e URL corti per le locandine.
  // Da verificare in preview: se l'adapter Wix non li onora, li gestiamo in middleware.
  redirects: {
    '/webinar-registration': { status: 301, destination: '/eventi/polo-motor-show/' },
    '/copia-di-polo-motorshow': { status: 301, destination: '/sponsor/' },
    '/diventa-sponsor': { status: 301, destination: '/sponsor/diventa-sponsor/' },
    '/polo': { status: 301, destination: '/eventi/polo-motor-show/' },
    '/rally': { status: 301, destination: '/rally-colli-euganei/' },
    '/press': { status: 301, destination: '/stampa/' },
    '/media': { status: 301, destination: '/foto-e-video/' },
  },
});
