/// vite.config.js
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { execSync } from 'child_process';

let buildTimestamp = new Date().toISOString();
try {
  const gitDate = execSync('git log -1 --format=%cd').toString().trim();
  buildTimestamp = gitDate;
} catch (e) { }

const nzstDate = new Date(buildTimestamp).toLocaleString('en-NZ', {
  timeZone: 'Pacific/Auckland',
  dateStyle: 'full',
  timeStyle: 'long'
});

export default defineConfig({
  define: {
    '__BUILD_TIMESTAMP__': JSON.stringify(nzstDate),
    global: 'window',
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'assets/icon.svg',
        'assets/quick_logo.png'
      ],
      manifest: {
        name: 'Rush Roofing Services CMS',
        short_name: 'Rush Roofing',
        description: 'Manage Rush Roofing Services website content.',
        theme_color: '#37474f',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'assets/icon.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'assets/icon.svg', sizes: '512x512', type: 'image/svg+xml' }
        ],
      },
    }),
  ],
});