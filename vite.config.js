import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function deferCssPlugin() {
  return {
    name: 'defer-css-plugin',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        `<link rel="preload" as="style" href="$1" />\n  <link rel="stylesheet" href="$1" media="print" onload="this.media='all'" />\n  <noscript><link rel="stylesheet" href="$1" /></noscript>`
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), deferCssPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
})
