import { WebSocketTransport } from '@colyseus/ws-transport';
import { RedisPresence, Server } from 'colyseus';
import * as http from 'http'

import { MainRoomService } from './rooms';
import { GAME_SERVICE_PORT } from '../shared/constants';
import { Logger } from '@nestjs/common';

export const GameServer = async () => {
    const transport = new WebSocketTransport({ server: http.createServer() });
    const presence = new RedisPresence();
    const gameServer = new Server({ transport, presence });

    gameServer.define('main_room', MainRoomService, { map: 'mp_land' });
    if (process.env.NODE_END !== 'production') gameServer.simulateLatency(60);
    await gameServer.listen(GAME_SERVICE_PORT);
    Logger.log(`[MAIN] Game service running on port: ${GAME_SERVICE_PORT} 🎲`);
}