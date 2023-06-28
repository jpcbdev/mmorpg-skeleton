import 'phaser';
import { useEffect } from 'react';
import { MainScene } from '../bin/scenes';

import { GameConfig } from '../bin/configs';

const Game = (): any => {
    useEffect(() => { init() }, []);
    const init = async () => {
        if (typeof window !== 'object') return;
        const game = new Phaser.Game(GameConfig);
        game.scene.add('main', MainScene);
        game.scene.start('main');
    };
    return null;
}

export default Game;