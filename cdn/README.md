# CDN Assets

This folder contains large static assets that will be deployed to the Firebase CDN.

## How it works

1. **Add your assets here** (images, audio, videos, 3D models, etc.)
2. **Commit and push** to the `develop` branch
3. **GitHub Actions automatically** mirrors this to `static-asset-cdn/public/your-app-name/`
4. **Assets become available** at: `https://venus-static-01293ak.web.app/your-app-name/`

## Local Development

The Vite plugin in `vite.config.ts` intercepts CDN URLs and serves files from this folder during development.

## Usage in Code

```typescript
// Reference CDN assets using VenusAPI.resolveAssetUrl():
const audioUrl = VenusAPI.resolveAssetUrl('your-app-name/assets/music.mp3');
this.load.audio('bgMusic', audioUrl);

// Local dev:  /your-app-name/assets/music.mp3 (served from this folder)
// Production: https://venus-static-01293ak.web.app/your-app-name/assets/music.mp3
```

## Important Notes

- **DO** commit assets to this folder
- **DON'T** manually edit `static-asset-cdn/public/your-app-name/` (auto-synced)
- Use `public/` folder for small essential assets (<100KB)
- Use `cdn/` folder for large assets (>100KB)

