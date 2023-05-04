import { Logger } from '@nestjs/common';
import { Client, Room, ServerError } from 'colyseus';
import { IncomingMessage } from 'http';

import { IAuthPlayer } from '../../auth/interfaces';
import { MainState, PlayerState } from '../states';
import { PlayerRepository } from '../repositories';

export class MainRoomService extends Room<MainState> {

    maxClients: number = 10;

    async onAuth(client: Client, options: object, request?: IncomingMessage) {

        const user = { name: 'John' };

        if (!user) throw new ServerError(401, 'Unauthorized');

        return user;

    }

    async onCreate(options: object): Promise<void> {

        Logger.debug(`[MAIN ROOM] ${this.roomName} created!`);

        this.setState(new MainState());

        this.onMessage('move', (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.x = data.x;
            player.y = data.y;
            player.flipX = data.flipX;
        });

    }

    async onJoin(client: Client, options?: object, auth?: IAuthPlayer): Promise<void> {

        this.setPlayerOnJoin(client);

        await PlayerRepository.createPlayer({ username: client.sessionId });

        Logger.debug(`[MAIN ROOM] Client ID: ${client.id} join!`);

    }

    async onLeave(client: Client, consented?: boolean): Promise<void> {
        
        if (this.state.players.has(client.sessionId)) this.state.players.delete(client.sessionId);

        Logger.debug(`[MAIN ROOM] Client ID: ${client.id} leave!`);

    }

    async onDispose(): Promise<void> {

        Logger.debug(`[MAIN ROOM] ${this.roomName} disposed!`);
    }

    private setPlayerOnJoin(client: Client) {

        const player = new PlayerState();

        player.sessionId = client.sessionId;
        player.playerId = client.id;
        player.x = Math.floor(Math.random() * 400);
        player.y = Math.floor(Math.random() * 400);

        this.state.players.set(client.sessionId, player);

    }

}