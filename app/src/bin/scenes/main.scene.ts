import 'phaser';
import { Room } from 'colyseus.js';
import { GameService } from '../services';

interface IPlayer {
    sessionId: string,
    playerId: string,
    x: number,
    y: number
    flipX: boolean
}

export class MainScene extends Phaser.Scene {

    private room: Room<unknown> | undefined;
    private velocity = 25;
    private playerSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: IPlayer;
    private playersSprite: Map<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> = new Map<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
    private music: Phaser.Sound.BaseSound;
    
    async preload() {
        this.load.image('player', '/sprites/player/idle.png');
        this.load.audio('music', '/music/game_music.mp3');
    }

    async create() {
        this.setMusicAudio();
        this.room = await GameService.connectToRoom('main_room');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.room?.onStateChange.once((state: any) => {
            this.setPlayerOnStateChange(state?.players);
            this.setPlayersOnStateChange(state?.players);
        });
        this.room?.onStateChange((state: any) => {
            this.setPlayersOnStateChange(state?.players);
        });
    }

    update() {
        if (this.cursors?.up.isDown) {
            this.playerSprite.y -= this.velocity;
            this.room?.send('move', { x: this.playerSprite.x, y: this.playerSprite.y });
        }
        if (this.cursors?.right.isDown) {
            this.playerSprite.x += this.velocity;
            this.playerSprite.flipX = false;
            this.room?.send('move', { x: this.playerSprite.x, y: this.playerSprite.y, flipX: false });
        }
        if (this.cursors?.down.isDown) {
            this.playerSprite.y += this.velocity;
            this.room?.send('move', { x: this.playerSprite.x, y: this.playerSprite.y });
        }
        if (this.cursors?.left.isDown) {
            this.playerSprite.x -= this.velocity;
            this.playerSprite.flipX = true;
            this.room?.send('move', { x: this.playerSprite.x, y: this.playerSprite.y, flipX: true });
        }
    }

    private setPlayerOnStateChange(players: Map<any, any>) {
        this.player = players?.get(this.room?.sessionId)?.toJSON() ?? null;
        const sprite = this.createPlayerSprite(this.player);
        this.playerSprite = sprite;
    }

    private setPlayersOnStateChange(players: Map<string, IPlayer>) {
        const sessionId = this.room?.sessionId ?? '';
        players.delete(sessionId);
        const spriteKeysNotUsed: string[] = [];
        this.playersSprite.forEach((sprite, key) => { if (!players.has(key)) { spriteKeysNotUsed.push(key) }; });
        spriteKeysNotUsed.map(key => this.playersSprite.get(key)?.destroy())
        players.forEach((player: IPlayer, key) => {
            if (!this.playersSprite.get(key)) {
                const sprite = this.createPlayerSprite(player);
                this.playersSprite.set(player.sessionId, sprite);
            } else {
                const sprite = this.playersSprite.get(key);
                sprite.x = player.x;
                sprite.y = player.y;
                sprite.flipX = player.flipX;
            }
        });
    }

    private createPlayerSprite(player: IPlayer): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        const sprite = this.physics.add.sprite(player?.x, player?.y, 'player');
        sprite.setScale(0.2);
        sprite.setCollideWorldBounds(true);
        sprite.setBounce(0, 0);
        return sprite;
    }

    private setMusicAudio(): void {
        this.music = this.sound.add('music', { loop: true, volume: 0.0 });
        if (!this.sound.locked) { this.music.play() } else { this.sound.once(Phaser.Sound.Events.UNLOCKED, () => this.music.play()) };
        this.sound.pauseOnBlur = false;
        document.addEventListener('visibilitychange', () => { if (!document.hidden) { this.music.resume() } else { this.music.pause() } });
    }

}