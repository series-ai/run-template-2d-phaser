import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
})
