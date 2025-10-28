import Phaser from 'phaser';
import VenusAPI from "@series-inc/venus-sdk/api";

export default class HelloWorldScene extends Phaser.Scene {
  private mainText!: Phaser.GameObjects.Text;
  private ball!: Phaser.GameObjects.Arc;
  private clickButton!: Phaser.GameObjects.Text;
  private hasStarted: boolean = false;
  private hudInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  private hudLine?: Phaser.GameObjects.Line;
  private floatTween?: Phaser.Tweens.Tween;

  constructor() {
    super("hello-world");
  }

  create(): void {
    VenusAPI.log("[HelloWorldScene] Create called");

    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const centerX = gameWidth / 2;
    const centerY = gameHeight / 2;

    // Simple background
    this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x1a1a2e);

    // Create a simple yellow ball
    this.ball = this.add.circle(centerX, 200, 30, 0xffff00);

    // Enable physics on the ball
    this.physics.add.existing(this.ball);
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(1);
    body.setCircle(30);

    // Add text
    this.mainText = this.add.text(centerX, centerY, "Click Play To Start", {
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
    });
    this.mainText.setOrigin(0.5);

    // Add floating animation to ball before game starts
    this.floatTween = this.tweens.add({
      targets: this.ball,
      y: this.ball.y - 20,
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Set up dialog close button listener
    const closeBtn = document.getElementById('close-dialog-btn');
    closeBtn?.addEventListener('click', () => this.hideDialog());

    VenusAPI.log("[HelloWorldScene] Scene created successfully");
  }

  update(): void {
    if (!this.hasStarted) return;

    // Maintain ball speed
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    const speed = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y);
    if (speed > 0 && speed < 270) {
      const scale = 300 / speed;
      body.setVelocity(body.velocity.x * scale, body.velocity.y * scale);
    }
  }

  onShow(context?: any): void {
    VenusAPI.log("[HelloWorldScene] onShow called");
    this.mainText.setText("Click Play To Start");

    // Handle hudInsets if provided
    if (context?.hudInsets) {
      this.hudInsets = context.hudInsets;
      this.updateHudLine();
    }
  }

  onPlay(context?: any): void {
    VenusAPI.log("[HelloWorldScene] onPlay called");
    this.mainText.setText("Game Started!");

    // Handle hudInsets if provided
    if (context?.hudInsets) {
      this.hudInsets = context.hudInsets;
      this.updateHudLine();
    }

    // Start ball movement
    this.hasStarted = true;

    // Stop floating animation
    if (this.floatTween) {
      this.floatTween.stop();
    }

    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(150, 200);

    // Add color changing animation
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.ball.setFillStyle(randomColor);
      },
      loop: true,
    });

    // Update text after delay
    this.time.delayedCall(1500, () => {
      this.mainText.setText("Bouncing Ball Demo");
      this.createButton();
    });
  }

  private updateHudLine(): void {
    const gameWidth = this.scale.width;
    VenusAPI.log(`[HelloWorldScene] updateHudLine called with hudInsets.top: ${this.hudInsets.top}`);

    // Remove existing line if any
    if (this.hudLine) {
      this.hudLine.destroy();
    }

    // Create white line at hudInsets top boundary
    if (this.hudInsets.top > 0) {
      const graphics = this.add.graphics();
      graphics.lineStyle(2, 0xffffff, 0.5);
      graphics.lineBetween(0, this.hudInsets.top, gameWidth, this.hudInsets.top);

      VenusAPI.log(`[HelloWorldScene] HUD line drawn at y=${this.hudInsets.top}`);
    }

    // Update UI positions based on hudInsets
    this.updateUIPositions();
  }

  private updateUIPositions(): void {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const centerX = gameWidth / 2;

    // Calculate safe area
    const safeTop = this.hudInsets.top;
    const safeBottom = gameHeight - this.hudInsets.bottom;
    const safeCenterY = safeTop + (safeBottom - safeTop) / 2;

    // Update text position to be in safe area
    if (this.mainText) {
      this.mainText.setPosition(centerX, safeCenterY);
    }

    // Update button position if it exists
    if (this.clickButton) {
      this.clickButton.setPosition(centerX, safeBottom - 60);
    }
  }

  private createButton(): void {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const centerX = gameWidth / 2;
    const safeBottom = gameHeight - this.hudInsets.bottom;

    this.clickButton = this.add.text(centerX, safeBottom - 60, "Click me", {
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