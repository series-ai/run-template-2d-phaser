# CDN Assets

This folder contains large static assets that will be deployed to the Firebase CDN.

## How it works

1. **Add your assets here** (images, audio, videos, 3D models, etc.)
2. **Commit and push** to the `develop` branch
3. **GitHub Actions automatically** mirrors this to the static CDN repository
4. **Assets become available** at: `https://venus-static-cdn.web.app/your-app-name/`

The app name is **auto-detected from your folder path** (`H5/{folder-name}/`).

## Local Development

The `venusLibrariesPlugin()` in `vite.config.ts` intercepts CDN URLs and serves files from this folder during development.

## Usage in Code

```typescript
import VenusAPI from '@series-inc/venus-sdk/api';

// Reference CDN assets using VenusAPI.cdn.resolveAssetUrl():
const audioUrl = VenusAPI.cdn.resolveAssetUrl('_template_phaser/assets/music.mp3');
this.load.audio('bgMusic', audioUrl);

// Local dev:  /_template_phaser/assets/music.mp3 (served from this folder)
// Production: https://venus-static-cdn.web.app/_template_phaser/assets/music.mp3
```

**Note:** Replace `_template_phaser` with your actual folder name from `H5/{folder-name}/`.

## Deployment Commands

**First time setup:** Create your game configuration:
```bash
venus create-game  # Generates game.config.json with unique gameId
```

**Deploy your game:**
```bash
# Quick build and publish
npm run yeet

# Or manually with Venus CLI
npm run build
venus update-and-publish-game
```

## Important Notes

- **DO** commit assets to this folder
- **DON'T** manually edit the static CDN repository (auto-synced by CI)
- **DO** use the folder name from `H5/{folder-name}/` as your CDN prefix
- Use `public/` folder for small essential assets (<100KB)
- Use `cdn/` folder for large assets (>100KB)
- App name is auto-detected - no manual configuration needed

