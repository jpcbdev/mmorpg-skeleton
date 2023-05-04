import 'phaser';
import { useEffect } from 'react';
import { MainScene } from '../bin/scenes';

const Game = (): any => {

    useEffect(() => { init() }, []);

    const init = async () => {

        if (typeof window !== 'object') return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 640,
            height: 480,
            fps: { target: 60 },
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

        const game = new Phaser.Game(config);

        game.scene.add('main', MainScene);
        game.scene.start('main');

    };

    return null;
}

export default Game;