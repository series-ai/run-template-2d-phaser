# Phaser 3 + Vite + TypeScript Template

A modern template for creating Phaser 3 games with Vite and TypeScript.

## Features

- 🚀 **Vite** - Fast build tool and development server
- 📘 **TypeScript** - Type safety and better developer experience
- 🎮 **Phaser 3** - Latest version of the popular 2D game framework
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
│   ├── scenes/          # Phaser scenes
│   ├── main.ts          # Entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Features Demonstrated

The included HelloWorld scene shows:
- Loading and displaying sprites
- Adding text with custom styling
- Interactive elements (click the logo!)
- Simple animations using Phaser tweens
- Responsive scaling

## Adding New Scenes

1. Create a new scene file in `src/scenes/`
2. Extend `Phaser.Scene`
3. Import and add it to the scenes array in `main.ts`

## Customization

- Modify `vite.config.ts` for build settings
- Update `tsconfig.json` for TypeScript options
- Edit `src/style.css` for global styling
- Adjust game configuration in `src/main.ts`

## License

MIT
