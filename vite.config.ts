import { defineConfig } from 'vite';
import { venusLibrariesPlugin } from "@series-inc/venus-sdk/vite";

// App name is auto-detected from folder name (H5/{folder-name}/)
// CDN assets in cdn/ folder are automatically served in dev mode

export default defineConfig({
  plugins: [venusLibrariesPlugin()],
  base: "./",
  // Vite uses esbuild both for transforms and (in dev) dependency prebundling.
  // Venus SDK includes top-level await, so we must target an environment that supports it.
  esbuild: {
    target: "es2022",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
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
