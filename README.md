# Phaser 3 + VenusAPI Template

A modern template for creating Phaser 3 games integrated with VenusAPI, using Vite and TypeScript.

## Features

- 🚀 **Vite** - Fast build tool and development server
- 📘 **TypeScript** - Full type safety with VenusAPI intellisense
- 🎮 **Phaser 3** - Latest version of the popular 2D game framework
- 🌟 **VenusAPI Integration** - Complete lifecycle management and platform features
- 🎨 **Modern CSS** - Beautiful styling with CSS gradients and shadows
- 📦 **Optimized Build** - Automatic code splitting for Phaser

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

**Note**: Builds with **embedded libraries by default** (Phaser loaded from Venus host). Bundle size: ~272KB vs 1.75MB bundled.

For standalone HTML5 export:
```bash
npm run build:bundled
```

### Preview Production Build

```bash
npm run preview
```

## Embedded Libraries

This template uses the Venus embedded libraries system **by default**. Phaser is loaded from:
- **Mobile**: Venus host app (instant, offline-ready, 1.1MB saved)
- **Web**: CDN fallback (`venus-static-01293ak.web.app`)

**Build Scripts**:
- `npm run build` - **Default**: Embedded libraries (272KB bundle)
- `npm run build:bundled` - Standalone export (1.75MB bundle)

The Vite plugin automatically:
- Externalizes Phaser from your bundle
- Generates virtual modules that load from `window.__venusLibraryExports`
- Injects configuration for the Venus host to provide libraries
- Serves CDN assets from local `cdn/` folder during development

**When to use bundled mode:**
- Distributing standalone HTML5 games outside Venus
- Testing without the Venus host
- Creating web-only exports

## Project Structure

```
├── public/
│   └── assets/          # Small static assets bundled with app (icons, UI elements)
├── cdn/                 # Large static assets deployed to CDN
│   ├── assets/          # Your large images, sounds, music, etc.
│   └── README.md        # CDN usage guide
├── src/
│   ├── scenes/          # Phaser scenes with VenusAPI integration
│   ├── main.ts          # Entry point with VenusAPI initialization
│   └── style.css        # Global styles
├── node_modules/
│   └── @series-inc/venus-sdk  # VenusAPI SDK
├── index.html           # HTML template
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration with CDN plugin
```

## VenusAPI Integration

This template demonstrates proper VenusAPI integration with:

### Lifecycle Management
- **onShow** - Called when game becomes visible
- **onPlay** - Called when user starts playing
- **onPause/onResume** - Handle app state changes
- **onHide** - Clean up when game is hidden

### Platform Features
- **Alerts** - `VenusAPI.showAlert()` for native-style dialogs
- **Logging** - `VenusAPI.log()` for proper console output
- **Storage** - Persistent data storage across sessions
- **Haptics** - Device vibration support

### Getting Started with VenusAPI

1. **Scene Integration**: Add lifecycle methods to your scenes:
```typescript
export default class MyGameScene extends Phaser.Scene {
  onShow(): void {
    // Game becomes visible - update UI, resume timers
    VenusAPI.log('Game shown');
  }

  onPlay(): void {
    // User starts playing - begin gameplay
    VenusAPI.log('Game started');
  }
}
```

2. **Register Handlers**: In `main.ts`, connect VenusAPI to your scenes:
```typescript
VenusAPI.onShow((context) => {
  if (myScene && myScene.onShow) {
    myScene.onShow();
  }
});
```

3. **Use Platform Features**:
```typescript
// Show native alert
VenusAPI.showAlert({
  title: 'Game Over',
  message: 'Your score: 1000',
  buttonText: 'Play Again'
});

See the full h5 api documentation for more details: https://github.com/series-ai/venus/blob/develop/docs/h5-api.md
```

## Template Features Demonstrated

The included HelloWorld scene shows:
- **VenusAPI Lifecycle** - Text updates based on onShow/onPlay events
- **Platform Integration** - Button that triggers VenusAPI.showAlert()
- **TypeScript Support** - Full intellisense for VenusAPI methods
- **Phaser Integration** - Logo animation and interactions
- **Responsive Design** - Scales properly across devices

## Building Your Game

1. **Start with the HelloWorld scene** as a reference
2. **Add your game logic** to the `onPlay()` method
3. **Handle state changes** with `onShow()`, `onPause()`, `onResume()`
4. **Use VenusAPI features** for alerts, storage, haptics, etc.
5. **Test lifecycle events** to ensure smooth user experience

## Adding New Scenes

1. Create a new scene file in `src/scenes/`
2. Extend `Phaser.Scene` and add VenusAPI lifecycle methods
3. Import and add it to the scenes array in `main.ts`
4. Connect VenusAPI handlers to your scene methods

## Customization

- **Game Logic**: Add your gameplay to scene files
- **VenusAPI Features**: Explore storage, haptics, monetization APIs
- **Build Settings**: Modify `vite.config.ts`
- **TypeScript**: Update `tsconfig.json` for your needs
- **Styling**: Edit `src/style.css` for custom appearance

## Managing Game Assets

You have two options for static assets (images, sounds, music):

### Option 1: Bundle with App (public/ folder)
**Use for:** Small essential assets (UI elements, icons, small sprites)

```bash
# Add to public/assets/
cp sprite.png public/assets/

# Reference in Phaser
this.load.image('sprite', 'assets/sprite.png');
```

**Pros:** Fast loading, bundled with app  
**Cons:** Increases app size, deployed with every version

### Option 2: CDN Hosting (cdn/ folder)
**Use for:** Large files (background music, high-res images, videos)

#### Step 1: Set Your App Name
Open `vite.config.ts` and update the `APP_NAME` constant:
```typescript
// IMPORTANT: Update this to your actual app name
const APP_NAME = 'my-awesome-game'; // ← Change this!
```

#### Step 2: Add Assets to cdn/ Folder
```bash
# Add your large assets to the cdn folder
cp background-music.mp3 cdn/assets/
cp hero-sprite.png cdn/assets/
```

#### Step 3: Reference in Code
```typescript
// Use VenusAPI.resolveAssetUrl() with your app name:
const audioUrl = VenusAPI.resolveAssetUrl('my-awesome-game/assets/background-music.mp3');
this.load.audio('bgMusic', audioUrl);

// Returns different URLs based on environment:
// Local dev:  /my-awesome-game/assets/background-music.mp3
// Production: https://venus-static-01293ak.web.app/my-awesome-game/assets/background-music.mp3
```

#### Step 4: Local Development
The Vite plugin automatically serves CDN assets from your local `cdn/` folder during development:
- Request: `/my-awesome-game/assets/background-music.mp3`
- Served from: `cdn/assets/background-music.mp3`

#### Step 5: Deploy to Production
```bash
# Commit and push to develop branch
git add cdn/
git commit -m "Add game assets"
git push origin develop

# Automatic deployment happens:
# 1. GitHub Actions copies cdn/ → static-asset-cdn/public/my-awesome-game/
# 2. Firebase deploys to CDN (~2-5 minutes)
# 3. Assets available at: https://venus-static-01293ak.web.app/my-awesome-game/
```

**Important Notes:**
- ✅ **DO** update `APP_NAME` in `vite.config.ts` first
- ✅ **DO** commit assets to `cdn/` folder (source of truth)
- ❌ **DON'T** manually edit `static-asset-cdn/public/` (auto-synced by CI)
- ✅ **DO** use `VenusAPI.resolveAssetUrl()` to get the right URL for both environments

**Pros:** Doesn't bloat app, shared across versions, can update independently  
**Cons:** Network-dependent in production

### Recommended Approach
- **Small assets (<100KB)**: Use `public/assets/`
- **Large assets (>100KB)**: Use `cdn/assets/`
- **Essential loading screen**: Use `public/`
- **Background music, cutscenes**: Use `cdn/`
