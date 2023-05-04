import { WebSocketTransport } from '@colyseus/ws-transport';
import { RedisPresence, Server } from 'colyseus';
import * as http from 'http'

import { MainRoomService } from './rooms';
import { GAME_SERVICE_PORT } from '../shared/constants';
import { Logger } from '@nestjs/common';

export const initGameServer = async () => {

    const gameServer = new Server({
        transport: new WebSocketTransport({ server: http.createServer() }),
        presence: new RedisPresence()
    });

    gameServer.define('main_room', MainRoomService,{map:'mp_land'});

    if (process.env.NODE_END !== 'production') gameServer.simulateLatency(200);

    await gameServer.listen(GAME_SERVICE_PORT);

    Logger.log(`[MAIN] Game service running on port: ${GAME_SERVICE_PORT} 🎲`);

}