import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export const gameDatabase = async (): Promise<Db> => {
    try {
        const client = await MongoClient.connect(`${process.env.MONGO_DB_URI}`, { useUnifiedTopology: true } as MongoClientOptions);
        Logger.log(`[DATABASE MODULE] Mongodb Client connected`);
        return client.db(`${process.env.MONGO_DB_NAME}`);

    } catch (error) {
        Logger.error(`[DATABASE MODULE] Mongodb client connection error: ${error?.message}`);
        throw new InternalServerErrorException(error?.message);
    }
}