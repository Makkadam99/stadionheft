import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative Pfade, damit die App auch in einem Unterordner (z. B. GitHub Pages) läuft
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.png'],
      manifest: {
        name: 'Stadionheft – FC Bayern',
        short_name: 'Stadionheft',
        description: 'Mein Stadion-Tagebuch für FC-Bayern-Spiele',
        lang: 'de',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F4ECDC',
        theme_color: '#C4122F',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,woff2,woff,svg,webmanifest}']
      }
    })
  ]
});
