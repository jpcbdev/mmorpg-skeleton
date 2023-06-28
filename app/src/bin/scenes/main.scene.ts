import 'phaser';
import { Room } from 'colyseus.js';
import { GameService } from '../services';

import { Options } from '@colyseus/loadtest';

interface IPlayer {
    sessionId?: string,
    playerId?: string,
    x?: number,
    y?: number
    flipX?: boolean,
    onChange?: Function
}

export class MainScene extends Phaser.Scene {

    private room: Room;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private currentPlayer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private currentPlayerReference: Phaser.GameObjects.Rectangle;
    private playersMap: Map<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> = new Map<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
    private music: Phaser.Sound.BaseSound;
    private cursorInput = {
        left: false,
        right: false,
        up: false,
        down: false,
    }

    async preload() {
        this.load.image('player', '/sprites/player/idle.png');
        this.load.audio('music', '/music/game_music.mp3');
    }

    async create() {
        // Connect with game room
        this.room = await GameService({ roomName: 'main_room' } as unknown as Options);

        // Rooms events
        this.room.onStateChange((state: any) => this.onStageChange(state));
        this.room.state.players.onAdd((player: IPlayer, sessionId: string) => this.onPlayerAdded(player, sessionId));
        this.room.state.players.onRemove((player: IPlayer, sessionId: string) => this.onPlayerRemoved(player, sessionId));

        // Game actions
        this.setSceneAudio();
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time: number, delta: number) {
        if (!this.room) return;
        this.sendCursorInput();
        this.setPlayersInterpolation();
    }

    private sendCursorInput(): void {
        this.cursorInput.left = this.cursors?.left.isDown;
        this.cursorInput.right = this.cursors.right.isDown;
        this.cursorInput.up = this.cursors.up.isDown;
        this.cursorInput.down = this.cursors.down.isDown;
        if (Object.values(this.cursorInput).some(k => k == true)) this.room?.send('move', this.cursorInput);
    }

    private onStageChange(state: any): void {
        this.setPlayerState(state?.players);
    }

    private onPlayerAdded(player: IPlayer, sessionId: string): void {
        const sprite = this.setPlayerSprite(player);
        player.onChange(() => this.setPlayerState(player))
        this.playersMap.set(player.sessionId, sprite);
    }

    private onPlayerRemoved(player: IPlayer, sessionId: string): void {
        const entity = this.playersMap.get(sessionId);
        if (entity) entity.destroy();
    }

    private setPlayerState(player: IPlayer) {
        const entity = this.playersMap.get(player.sessionId);
        if (!entity) return;
        entity.setData('serverX', player.x);
        entity.setData('serverY', player.y);
        entity.setData('serverFlipX', player.flipX);
    }

    private setPlayerSprite(player: IPlayer): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        const sprite = this.physics.add.sprite(player?.x, player?.y, 'player');
        sprite.setScale(0.2);
        sprite.setCollideWorldBounds(true);
        sprite.setBounce(0, 0);
        return sprite;
    }

    private setPlayersInterpolation(): void {
        this.playersMap.forEach((player, key) => {
            const entity = this.playersMap.get(key);
            if (entity?.data?.values) {
                player.x = Phaser.Math.Linear(player.x, entity.data.values.serverX, 0.2);
                player.y = Phaser.Math.Linear(player.y, entity.data.values.serverY, 0.2);
                player.flipX = entity.data.values.serverFlipX;
            }
        })
    }

    private setSceneAudio(): void {
        this.music = this.sound.add('music', { loop: true, volume: 0.0 });
        if (!this.sound.locked) { this.music.play() } else { this.sound.once(Phaser.Sound.Events.UNLOCKED, () => this.music.play()) };
        this.sound.pauseOnBlur = false;
        document.addEventListener('visibilitychange', () => { if (!document.hidden) { this.music.resume() } else { this.music.pause() } });
    }

}