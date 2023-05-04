import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export const initDatabase = async (): Promise<Db> => {

    try {
        const client = await MongoClient.connect('mongodb://localhost', { useUnifiedTopology: true } as MongoClientOptions);
        Logger.log(`[DATABASE MODULE] Mongodb Client connected 🍃`);
        return client.db('phaser-colyseus-template');

    } catch (error) {
        Logger.error(`[DATABASE MODULE] Mongodb client connection error: ${error?.message}`);
        throw new InternalServerErrorException(error?.message);
    }

}