import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

// IMPORTANT: Update this to your actual app name when you start a new project
const APP_NAME = 'your-app-name';

// Custom plugin to serve CDN assets from local cdn directory during development
function serveCdnAssets(): any {
  const cdnPath = path.resolve(import.meta.dirname || __dirname, 'cdn');

  return {
    name: 'serve-cdn-assets',
    configureServer(server: any): void {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (!req.url) return next();

        // Check if URL starts with our app's CDN path
        const urlPath = req.url.split('?')[0]; // Remove query params

        if (urlPath.startsWith(`/${APP_NAME}/`)) {
          // Remove the /app-name/ prefix to get relative path
          const relativePath = urlPath.replace(`/${APP_NAME}/`, '');
          const filePath = path.join(cdnPath, relativePath);

          // Check if file exists
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            // Determine content type from extension
            const ext = path.extname(filePath).toLowerCase();
            const contentType =
              {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.mp3': 'audio/mpeg',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.ogg': 'audio/ogg',
                '.wav': 'audio/wav',
                '.json': 'application/json',
                '.glb': 'model/gltf-binary',
                '.gltf': 'model/gltf+json',
              }[ext] || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            return res.end(fs.readFileSync(filePath));
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [serveCdnAssets()],
  server: {
    port: 3000,
  },
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
});
