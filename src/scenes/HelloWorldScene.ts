import Phaser from 'phaser';
import RundotGameAPI from "@series-inc/rundot-game-sdk/api";
import { StowKitPhaserLoader, StowKitPhaserPack } from "@series-inc/stowkit-phaser-loader";

export default class HelloWorldScene extends Phaser.Scene {
  private mainText!: Phaser.GameObjects.Text;
  private ball?: Phaser.GameObjects.Sprite;
  private clickButton!: Phaser.GameObjects.Text;
  private pack!: StowKitPhaserPack;

  constructor() {
    super("hello-world");
  }

  async create(): Promise<void> {
    RundotGameAPI.log("[HelloWorldScene] Create called - loading StowKit pack");

    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const centerX = gameWidth / 2;
    const centerY = gameHeight / 2;

    // Simple background
    this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x1a1a2e);

    // Add text
    this.mainText = this.add.text(centerX, centerY, "Loading asset…", {
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
    });
    this.mainText.setOrigin(0.5);

    // Load the StowKit pack from CDN and create bouncing ball
    await this.loadPackAndCreateBall(centerX);

    // Update text and create button after delay
    this.time.delayedCall(1500, () => {
      this.mainText.setText("Bouncing Ball Template v.0.0.4.woof");
      this.createButton();
    });

    // Set up dialog close button listener
    const closeBtn = document.getElementById('close-dialog-btn');
    closeBtn?.addEventListener('click', () => this.hideDialog());
  }

  private async loadPackAndCreateBall(centerX: number): Promise<void> {
    // Fetch .stow pack from CDN
    const blob = await RundotGameAPI.cdn.fetchAsset('default.stow');
    const arrayBuffer = await blob.arrayBuffer();
    RundotGameAPI.log(`[HelloWorldScene] Fetched StowKit pack, size: ${arrayBuffer.byteLength}`);

    // Parse the pack
    this.pack = await StowKitPhaserLoader.loadFromMemory(arrayBuffer, {
      basisPath: 'stowkit/basis/',
      wasmPath: 'stowkit/stowkit_reader.wasm',
    });

    // Load spritesheet from pack — registers texture, frames, and animation
    const { textureKey, animationKey } = await this.pack.loadSpriteSheet('ball_animation', this);

    // Create the animated ball sprite using the base texture key
    this.ball = this.add.sprite(centerX, 200, textureKey);
    this.ball.setDisplaySize(64, 64);
    this.ball.play(animationKey);

    this.physics.add.existing(this.ball);
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(1);
    body.setCircle(32);
    body.setVelocity(150, 200);
  }

  update(): void {
    if (!this.ball) return;
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    const speed = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y);
    if (speed > 0 && speed < 270) {
      const scale = 300 / speed;
      body.setVelocity(body.velocity.x * scale, body.velocity.y * scale);
    }
  }

  private createButton(): void {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const centerX = gameWidth / 2;

    this.clickButton = this.add.text(centerX, gameHeight - 100, "Click me", {
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#e74c3c",
      padding: { x: 20, y: 10 },
    });
    this.clickButton.setOrigin(0.5);
    this.clickButton.setInteractive({ useHandCursor: true });

    this.clickButton.on("pointerdown", () => {
      this.showDialog();
    });
  }

  private showDialog(): void {
    const overlay = document.getElementById("dialog-overlay");
    if (overlay) {
      overlay.classList.remove("hidden");
    }
  }

  private hideDialog(): void {
    const overlay = document.getElementById('dialog-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }
}
