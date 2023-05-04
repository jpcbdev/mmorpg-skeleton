import { dbClient } from '../../main';

export class PlayerRepository {

    static async getPlayer(conditions = {}) {
        const player = dbClient.collection('players').findOne(conditions);
        return player;
    }

    static async createPlayer(dto: { username: string }) {
        const player = await dbClient.collection('players').insertOne(dto);
        return player;
    }

}