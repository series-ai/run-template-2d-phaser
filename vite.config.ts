import { defineConfig } from 'vite';
import { venusLibrariesPlugin } from "@series-inc/venus-sdk/vite";

// App name is auto-detected from folder name (H5/{folder-name}/)
// CDN assets in cdn/ folder are automatically served in dev mode

export default defineConfig({
  plugins: [venusLibrariesPlugin()],
  base: "./",
  build: {
    target: "es2022", // Support top-level await for embedded libraries
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
});
