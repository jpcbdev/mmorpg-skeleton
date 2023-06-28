export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    fps: { limit: 40, target: 40 },
    backgroundColor: '#7ED957',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            gravity: { y: 0 },
        },
        matter: {
            setBounds: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};