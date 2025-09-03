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

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/
│   └── assets/          # Static assets (images, sounds, etc.)
├── src/
│   ├── scenes/          # Phaser scenes with VenusAPI integration
│   ├── main.ts          # Entry point with VenusAPI initialization
│   └── style.css        # Global styles
├── venus-api/           # Symlinked VenusAPI (shared across H5 games)
├── index.html           # HTML template
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
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

