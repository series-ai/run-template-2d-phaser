import Phaser from 'phaser';
import HelloWorldScene from './scenes/HelloWorldScene';
import './style.css';
import VenusAPI from '../venus-api/index.js';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  backgroundColor: '#2c3e50',
  scene: [HelloWorldScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 200 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Initialize the game
const game = new Phaser.Game(config);

// Get reference to the HelloWorldScene
let helloWorldScene: HelloWorldScene;

game.events.once('ready', () => {
  helloWorldScene = game.scene.getScene('hello-world') as HelloWorldScene;
});

// Initialize VenusAPI and register lifecycle handlers
async function initializeVenusAPI() {
  try {
    VenusAPI.log('[Main] Starting VenusAPI initialization');

    // Register lifecycle handlers BEFORE initialization
    VenusAPI.onShow((context?: any) => {
      VenusAPI.log('[Main] onShow triggered with context:', context);
      if (helloWorldScene && helloWorldScene.onShow) {
        helloWorldScene.onShow();
      }
    });

    VenusAPI.onPlay((context?: any) => {
      VenusAPI.log('[Main] onPlay triggered with context:', context);
      if (helloWorldScene && helloWorldScene.onPlay) {
        helloWorldScene.onPlay();
      }
    });

    VenusAPI.log('[Main] VenusAPI handlers registered');

    // Initialize VenusAPI
    const options = {
      helpText: 'Phaser 3 + Vite + TypeScript template with VenusAPI integration',
      mock: {
        // Mock options can be added here for development
      }
    };

    const success = await VenusAPI.initializeAsync(options);
    
    if (success) {
      VenusAPI.log('[Main] VenusAPI initialized successfully');
    } else {
      VenusAPI.error('[Main] VenusAPI initialization failed');
    }

  } catch (error) {
    console.error('[Main] VenusAPI initialization error:', error);
  }
}

// Initialize VenusAPI
initializeVenusAPI();

export default game;
