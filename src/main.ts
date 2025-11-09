import Phaser from 'phaser';
import HelloWorldScene from './scenes/HelloWorldScene';
import './style.css';
import VenusAPI from "@series-inc/venus-sdk/api";

// ============================================================================
// IMPORTANT: NO VenusAPI CALLS SHOULD BE MADE UNTIL initializeAsync RESOLVES
// ============================================================================
// VenusAPI must be fully initialized before any of its methods (log, error,
// storage, ads, etc.) can be used. Wait for initializeAsync to complete
// before calling any VenusAPI methods or starting gameplay that uses the SDK.
// ============================================================================

async function bootstrap(): Promise<void> {
  try {
    // Step 1: Initialize VenusAPI FIRST
    const options = {
      helpText: "Phaser 3 + Vite + TypeScript template with VenusAPI integration",
      mock: {
        // Mock options can be added here for development
      },
    };

    const success = await VenusAPI.initializeAsync(options);

    if (!success) {
      VenusAPI.error("[Main] VenusAPI initialization failed");
      return;
    }

    VenusAPI.log("[Main] VenusAPI initialized successfully");

    // Step 2: Create Phaser game AFTER VenusAPI is ready
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 720,
      height: 1560,
      parent: "app",
      backgroundColor: "#2c3e50",
      scene: HelloWorldScene,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    new Phaser.Game(config);
    VenusAPI.log("[Main] Phaser game created");
  } catch (error) {
    console.error("[Main] Bootstrap error:", error);
  }
}

// Start the app
bootstrap();
