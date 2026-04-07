# StowKit Phaser Loader

Use `@series-inc/stowkit-phaser-loader` to load `.stow` asset packs in Phaser applications. Supports 2D textures, spritesheets, and audio — for 3D models use `@series-inc/stowkit-three-loader`.

## How Assets Get Into the Game

Assets are NEVER loaded as raw files (no `this.load.image('player.png')`, no `this.load.audio('bgm.wav')`, no `fetch('assets/sprite.png')`). The workflow is:

1. Source files (PNG, JPG, WAV) go into the project's `srcArtDir`
2. `stowkit build` compresses and packs them into `.stow` binary files (textures become KTX2/Basis Universal)
3. At runtime, this loader reads from the `.stow` pack using the asset's `stringId`

If you need to add an asset to the game, the pipeline step (`stowkit build`) must happen first. Then use the methods below to load from the pack.

## Quick Reference

| I need to... | Method |
|---|---|
| Load a pack from URL | `await StowKitPhaserLoader.load('/assets/game.stow')` |
| Load a pack from CDN (RUN.game) | Fetch blob via `RundotGameAPI.cdn.fetchAsset('default.stow')`, then `StowKitPhaserLoader.loadFromMemory(await blob.arrayBuffer(), opts)` |
| Add a texture to a scene | `await pack.loadTexture('player', this)` |
| Use texture as a sprite | `this.add.sprite(x, y, 'player')` — key matches the stringId passed to `loadTexture` |
| Load a spritesheet with animation | `const { textureKey, animationKey } = await pack.loadSpriteSheet('walk_anim', this)` |
| Play a spritesheet animation | `const sprite = this.add.sprite(x, y, textureKey); sprite.play(animationKey)` |
| Load audio | `const buffer = await pack.loadAudio('bgm')` |
| Play audio with Phaser | Use `this.sound.context` — see Audio section below |
| See what's in a pack | `pack.listAssets()` — returns array of `{ index, name, id, type, dataSize }` |
| Clean up a pack | `pack.dispose()` |
| Clean up shared resources | `StowKitPhaserLoader.dispose()` |

## Critical Rules

1. **Game config must use `Phaser.WEBGL`** — compressed textures require WebGL, not `Phaser.AUTO` or `Phaser.CANVAS`.
2. **Load textures in `create()`, not `preload()`** — `loadTexture` needs the renderer's GL context which isn't available during preload.
3. **Spritesheet sprites use `textureKey`, not the spritesheet asset path** — `loadSpriteSheet` returns `{ textureKey, animationKey }`. Use `textureKey` for `this.add.sprite()`.
4. **Alpha blending is handled automatically** — no game-side blend mode setup needed.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Using `this.load.image()` / `this.load.audio()` to load raw source files | StowKit projects load everything from `.stow` packs — use `pack.loadTexture()` and `pack.loadAudio()` |
| Calling `loadTexture` in `preload()` | Must be called in or after `create()` — needs the renderer's GL context |
| Not awaiting `StowKitPhaserLoader.load()` | All load methods are async — always `await` them |
| Forgetting to pass `this` (the scene) to `loadTexture` | `loadTexture(path, scene)` requires the Phaser scene to register with the texture manager |
| Using `Phaser.AUTO` renderer type | Compressed textures require WebGL — use `Phaser.WEBGL` |
| Using spritesheet asset path as sprite texture key | `loadSpriteSheet` returns `textureKey` — use that for `this.add.sprite()`, not the spritesheet path |
| Trying to load meshes / skinned meshes | This loader is 2D only (textures, spritesheets, audio) — use `@series-inc/stowkit-three-loader` for 3D |
| Manually decoding KTX2 / Basis | The loader handles all transcoding internally — just call `loadTexture` |
| Setting blend mode for alpha transparency | Not needed — the loader handles this automatically |

## Installation

```bash
npm install @series-inc/stowkit-phaser-loader phaser
```

Requires Phaser 3.60+ for compressed texture support.

The postinstall script copies Basis Universal transcoder files to `public/stowkit/basis/`. The `stowkit_reader.wasm` file is copied by the `@series-inc/stowkit-reader` dependency.

## Loading a Pack

### From URL (local dev)

```typescript
import { StowKitPhaserLoader } from '@series-inc/stowkit-phaser-loader';

const pack = await StowKitPhaserLoader.load('/cdn-assets/default.stow', {
    basisPath: 'stowkit/basis/',
    wasmPath: 'stowkit/stowkit_reader.wasm',
});
```

### From CDN (RUN.game production)

```typescript
import { StowKitPhaserLoader } from '@series-inc/stowkit-phaser-loader';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';

const blob = await RundotGameAPI.cdn.fetchAsset('default.stow');
const pack = await StowKitPhaserLoader.loadFromMemory(await blob.arrayBuffer(), {
    basisPath: 'stowkit/basis/',
    wasmPath: 'stowkit/stowkit_reader.wasm',
});
```

Options (all optional):
- `basisPath` — path to Basis Universal transcoder dir (default: `'/basis/'`)
- `wasmPath` — path to `stowkit_reader.wasm` (default: `'/stowkit/stowkit_reader.wasm'`)
- `gl` — WebGL context to use (if not provided, a temporary canvas is created)

## Asset Types

| Type | Enum | Load Method |
|------|------|-------------|
| Texture | `AssetType.TEXTURE_2D` (2) | `pack.loadTexture(stringId, scene)` |
| SpriteSheet | type `8` | `pack.loadSpriteSheet(stringId, scene, animKey?)` |
| Audio | `AssetType.AUDIO` (3) | `pack.loadAudio(stringId, audioContext?)` |

Assets are referenced by their `stringId` from `.stowmeta` files (e.g. `"player"`, `"background"`).

## Textures

```typescript
// In your scene's create() method:
await pack.loadTexture('player', this);
const player = this.add.sprite(400, 300, 'player');
```

`loadTexture` registers the texture with Phaser's texture manager using the stringId as the key. Must be called in or after `create()`.

KTX2 textures are automatically transcoded to the best GPU-compressed format:
- **Desktop:** BC7 (BPTC) for alpha, BC3 (DXT5) for alpha, BC1 (DXT1) for opaque
- **Mobile:** ASTC 4x4, ETC2, ETC1, PVRTC
- **Fallback:** RGBA32 uncompressed

Textures are cached per-pack — loading the same stringId twice returns the same instance.

### Texture Filtering

Controlled by `.stowmeta` metadata. Set `"filtering": 1` for `NEAREST` (pixel art), otherwise `LINEAR` is used. Change this in the `.stowmeta` file and rebuild with `stowkit build`.

## Spritesheets

Spritesheets are defined as `.stowspritesheet` JSON files in the `srcArtDir` alongside their texture:

```json
{
    "version": 1,
    "textureAsset": "ball_sheet.png",
    "rows": 8,
    "columns": 8,
    "frameCount": 64,
    "frameRate": 6
}
```

The texture (`ball_sheet.png`) and spritesheet definition (`ball_animation.stowspritesheet`) are both placed in `srcArtDir`. Run `stowkit build` to pack them.

### Loading and Playing

```typescript
// Load spritesheet — loads the texture, registers frames, and creates animation
const { textureKey, animationKey } = await pack.loadSpriteSheet('ball_animation', this);

// Create sprite using the BASE TEXTURE KEY (not the spritesheet path)
const sprite = this.add.sprite(400, 300, textureKey);
sprite.setDisplaySize(64, 64);
sprite.play(animationKey);
```

**Important:** Use `textureKey` (returned by `loadSpriteSheet`) as the texture key for `this.add.sprite()`. The spritesheet's frames are added directly to the base texture — do NOT use the spritesheet asset path as the sprite key.

### Custom Animation Key

```typescript
const { textureKey, animationKey } = await pack.loadSpriteSheet('walk_cycle', this, 'player_walk');
// animationKey === 'player_walk'
```

If no `animKey` is provided, it defaults to `${assetPath}_anim`.

### Spritesheet Metadata

```typescript
const meta = pack.getSpriteSheetMetadata('ball_animation');
// { textureId, rows, columns, frameCount, frameRate }
```

### How It Works Internally

1. Loads the referenced texture via `loadTexture` (KTX2 → GPU-compressed)
2. Calculates frame dimensions: `frameWidth = texWidth / columns`, `frameHeight = texHeight / rows`
3. Adds numbered frames (0, 1, 2, ...) directly to the compressed texture using `texture.add()`
4. Creates a Phaser animation with `generateFrameNumbers` and the specified frame rate

Frames are added to the base texture — NOT via `addSpriteSheet` (which fails for compressed textures because it tries to call `texImage2D` on a non-existent image source).

## Audio

```typescript
// Decode to AudioBuffer
const buffer = await pack.loadAudio('bgm');

// Or with a specific AudioContext
const ctx = new AudioContext();
const buffer = await pack.loadAudio('bgm', ctx);
```

Audio is AAC format (M4A container), decoded via Web Audio API.

### Playing audio with Phaser's sound system

```typescript
const buffer = await pack.loadAudio('bgm');
const source = this.sound.context.createBufferSource();
source.buffer = buffer;
source.connect(this.sound.context.destination);
source.loop = true;
source.start();
```

For HTML5 preview: `const el = await pack.createAudioPreview(index);`

## Pack Manifest

```typescript
const assets = pack.listAssets();
// Each: { index, name, id, type, dataSize, hasMetadata }

const count = pack.getAssetCount();
const info = pack.getAssetInfo(0);
```

## Metadata Helpers

```typescript
// Texture
const tex = pack.getTextureMetadata(index);
// { width, height, channels, channelFormat, filtering }

// Audio
const audio = pack.getAudioMetadata(index);
// { sampleRate, channels, durationMs }

// SpriteSheet
const ss = pack.getSpriteSheetMetadata('walk_cycle');
// { textureId, rows, columns, frameCount, frameRate }
```

## Multiple Packs

Each pack has its own WASM reader instance — fully isolated:
```typescript
const [uiPack, levelPack] = await Promise.all([
    StowKitPhaserLoader.load('/assets/ui.stow'),
    StowKitPhaserLoader.load('/assets/level1.stow'),
]);
```

## Cleanup

```typescript
pack.dispose();                // Clears texture cache, closes WASM reader
StowKitPhaserLoader.dispose(); // Frees shared Basis transcoder + temp WebGL context
```

## Exports

```typescript
import {
    StowKitPhaserLoader,  // Static loader class
    StowKitPhaserPack,    // Pack instance (returned by load)
    BasisTranscoder,      // Basis Universal transcoder
    AssetType,            // Enum: STATIC_MESH, TEXTURE_2D, AUDIO, etc.
    PerfLogger            // Performance logging
} from '@series-inc/stowkit-phaser-loader';

// Types
import type {
    StowKitPhaserLoaderOptions,
    TextureData
} from '@series-inc/stowkit-phaser-loader';
```

## Complete Example

```typescript
import Phaser from 'phaser';
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { StowKitPhaserLoader, StowKitPhaserPack } from '@series-inc/stowkit-phaser-loader';

class GameScene extends Phaser.Scene {
    private pack!: StowKitPhaserPack;

    constructor() {
        super('GameScene');
    }

    async create() {
        // Load pack from CDN
        const blob = await RundotGameAPI.cdn.fetchAsset('default.stow');
        this.pack = await StowKitPhaserLoader.loadFromMemory(await blob.arrayBuffer(), {
            basisPath: 'stowkit/basis/',
            wasmPath: 'stowkit/stowkit_reader.wasm',
        });

        // Load a static texture
        await this.pack.loadTexture('background', this);
        this.add.image(400, 300, 'background');

        // Load an animated spritesheet
        const { textureKey, animationKey } = await this.pack.loadSpriteSheet('player_walk', this);
        const player = this.add.sprite(400, 300, textureKey);
        player.setDisplaySize(64, 64);
        player.play(animationKey);

        // Load and play audio
        const bgm = await this.pack.loadAudio('bgm');
        const source = this.sound.context.createBufferSource();
        source.buffer = bgm;
        source.connect(this.sound.context.destination);
        source.loop = true;
        source.start();
    }
}

const game = new Phaser.Game({
    type: Phaser.WEBGL,  // Required for compressed textures
    width: 800,
    height: 600,
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 } },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
});
```

## Complete Spritesheet Example

```typescript
import Phaser from 'phaser';
import { StowKitPhaserLoader, StowKitPhaserPack } from '@series-inc/stowkit-phaser-loader';

class AnimatedScene extends Phaser.Scene {
    private pack!: StowKitPhaserPack;

    constructor() {
        super('AnimatedScene');
    }

    async create() {
        this.pack = await StowKitPhaserLoader.load('/cdn-assets/default.stow', {
            basisPath: 'stowkit/basis/',
            wasmPath: 'stowkit/stowkit_reader.wasm',
        });

        // Load multiple spritesheets
        const { textureKey: idleKey, animationKey: idleAnim } =
            await this.pack.loadSpriteSheet('player_idle', this);
        const { textureKey: walkKey, animationKey: walkAnim } =
            await this.pack.loadSpriteSheet('player_walk', this);

        // Create sprite with idle animation
        const player = this.add.sprite(400, 300, idleKey);
        player.play(idleAnim);

        // Switch animation on click
        this.input.on('pointerdown', () => {
            if (player.anims.currentAnim?.key === idleAnim) {
                player.setTexture(walkKey);
                player.play(walkAnim);
            } else {
                player.setTexture(idleKey);
                player.play(idleAnim);
            }
        });
    }
}
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Textures not loading / blank | Basis transcoder files missing | Verify `basis_transcoder.js` and `.wasm` are at the `basisPath` URL. Re-run `npm install` to trigger postinstall copy |
| "Scene required" / texture errors | `loadTexture` called too early | Call `loadTexture` in or after `create()`, not in `preload()` |
| WASM file not found | Wrong `wasmPath` or file not copied | Check `stowkit_reader.wasm` exists at the expected URL |
| `texImage2D` error on spritesheet | Using Phaser's `addSpriteSheet` with compressed texture | Use `pack.loadSpriteSheet()` — it adds frames directly to the compressed texture |
| Dark fringe / halo around alpha edges | Outdated loader version | Update `@series-inc/stowkit-phaser-loader` to latest |
| Pixel art looks blurry | Default linear filtering | Set `"filtering": 1` in the asset's `.stowmeta` and rebuild |
| Spritesheet sprite is blank | Using spritesheet path as texture key | Use `textureKey` returned by `loadSpriteSheet`, not the asset path |
| No compressed format supported | WebGL unavailable | Use `Phaser.WEBGL` for game type. Falls back to RGBA32 if no GPU compression extensions |
| Audio not playing | AudioContext suspended | Browsers require user interaction before audio — start in response to click/tap |
| Need 3D models? | Wrong loader | Use `@series-inc/stowkit-three-loader` — this loader is 2D only |
