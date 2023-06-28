import { Logger } from '@nestjs/common';
import { Client, Room, ServerError } from 'colyseus';
import { IAuthPlayer } from '../../authorization/interfaces';

import { MainState, PlayerState } from '../states';
import { PlayerRepository } from '../repositories';

export class MainRoomService extends Room<MainState> {

    maxClients = 10;
    MAP_WIDTH = 640;
    MAP_HEIGHT = 480;
    VELOCITY = 10;

    async onAuth(client: Client, options: object, request?: unknown) {
        const user = { name: 'John' }; // exist always temp
        if (!user) throw new ServerError(401, 'Unauthorized');
        return user;
    }

    async onCreate(options: object): Promise<void> {
        Logger.debug(`[MAIN ROOM] ${this.roomName} created!`);
        this.setState(new MainState());
        this.onMessage('move', (client, data) => this.setPlayerMove(client, data));
        this.setSimulationInterval((delta) => this.update(delta));
    }

    async onJoin(client: Client, options?: object, auth?: IAuthPlayer): Promise<void> {
        await this.setPlayerJoined(client);
    }

    onLeave(client: Client, consented: boolean): void {
        const session = this.state.players.get(client.sessionId);
        if (session) { this.state.players.delete(client.sessionId); Logger.debug(`[MAIN ROOM] Client ID: ${client.id} leave!`); };
    }

    async onDispose(): Promise<void> {
        Logger.debug(`[MAIN ROOM] ${this.roomName} disposed!`);
    }

    private setPlayerMove(client: Client, data: { left: boolean, right: boolean, up: boolean, down: boolean }) {
        const player = this.state.players.get(client.sessionId);
        if (data?.left) { player.x -= this.VELOCITY; player.flipX = true }
        if (data?.right) { player.x += this.VELOCITY; player.flipX = false };
        if (data?.up) player.y -= this.VELOCITY;
        if (data?.down) player.y += this.VELOCITY;
    }

    private async setPlayerJoined(client: Client) {
        const player = new PlayerState();
        player.sessionId = client.sessionId;
        player.playerId = client.id;
        player.x = Math.floor(Math.random() * this.MAP_WIDTH);
        player.y = Math.floor(Math.random() * this.MAP_HEIGHT);
        this.state.players.set(client.sessionId, player);
        // await PlayerRepository.createPlayer({ username: client.sessionId }); save new user to database
        Logger.debug(`[MAIN ROOM] Client ID: ${client.id} join!`);
    }

    private update(delta: number): void {}

}