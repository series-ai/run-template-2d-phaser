import Phaser from 'phaser';
import VenusAPI from '../../venus-api/index.js';

export default class HelloWorldScene extends Phaser.Scene {
  private mainText!: Phaser.GameObjects.Text;
  private alertButton?: Phaser.GameObjects.Text;

  constructor() {
    super('hello-world');
  }

  preload(): void {
    // Load the Phaser logo
    this.load.image('logo', 'assets/phaser-logo.png');
  }

  create(): void {
    // Add the logo to the center of the screen
    const logo = this.add.image(400, 300, 'logo');
    logo.setScale(0.5);

    // Add main text that will be updated by Venus lifecycle events
    this.mainText = this.add.text(400, 450, 'Hello World from Phaser 3!', {
      fontSize: '32px',
      color: '#ffffff'
    });
    this.mainText.setOrigin(0.5);

    // Make the logo interactive
    logo.setInteractive();
    logo.on('pointerdown', () => {
      logo.setTint(Math.random() * 0xffffff);
    });

    // Add some simple animation
    this.tweens.add({
      targets: logo,
      y: 280,
      duration: 1500,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });
  }

  // Called when onShow event is triggered
  onShow(): void {
    this.mainText.setText('onShow was called');
    VenusAPI.log('[HelloWorldScene] onShow was called');
  }

  // Called when onPlay event is triggered
  onPlay(): void {
    this.mainText.setText('onPlay was called, your game should begin!');
    VenusAPI.log('[HelloWorldScene] onPlay was called - game started!');
    
    // Add the alert button after onPlay
    this.createAlertButton();
  }

  private createAlertButton(): void {
    if (this.alertButton) {
      this.alertButton.destroy();
    }

    // Create a styled button
    this.alertButton = this.add.text(400, 520, 'Click for VenusAPI Alert!', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#3498db',
      padding: { x: 20, y: 10 }
    });
    this.alertButton.setOrigin(0.5);
    this.alertButton.setInteractive({ useHandCursor: true });
    
    // Add button click handler
    this.alertButton.on('pointerdown', () => {
      VenusAPI.showAlert({
        title: 'VenusAPI Alert',
        message: 'You clicked a VenusAPI button!',
        buttonText: 'OK'
      });
    });

    // Add hover effects
    this.alertButton.on('pointerover', () => {
      this.alertButton?.setStyle({ backgroundColor: '#2980b9' });
    });

    this.alertButton.on('pointerout', () => {
      this.alertButton?.setStyle({ backgroundColor: '#3498db' });
    });
  }
}
