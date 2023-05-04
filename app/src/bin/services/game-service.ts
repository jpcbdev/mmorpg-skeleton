import { Client, Room } from 'colyseus.js';

export class GameService {

    static client = new Client(process.env.WS_GAME_SERVICE_URL ?? '');

    static async connectToRoom(name: string): Promise<Room<unknown> | undefined> {
        try {
            const room = await this.client.joinOrCreate(name);
            return room;
        } catch (error: any) {
            console.log(`Game server error code: ${error['code']}. Message: ${error['message']}`);
        }

    }
}

