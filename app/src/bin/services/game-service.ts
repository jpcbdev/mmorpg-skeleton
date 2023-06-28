import { Client, Room } from 'colyseus.js';
import { Options } from '@colyseus/loadtest';

export async function GameService(options: Options): Promise<Room> {
    const client = new Client(process.env.GAME_SERVICE_URL ?? null);
    const room: Room = await client.joinOrCreate(options.roomName);
    return room;
}

// cli(awaitGameService);
