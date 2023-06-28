import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http'
import { SERVICE_PORT } from './shared/constants';

import { Logger } from '@nestjs/common';
import { monitor } from '@colyseus/monitor';
import { GameServer } from './game/server';

import { gameDatabase } from './databases';
import { Db } from 'mongodb';
import { playground } from "@colyseus/playground";

export let dbClient: Db = null;

async function bootstrap() {
  const app = express();
  app.use('/playground', playground)
  app.use('/monitor', monitor());
  const server = await NestFactory.create(AppModule, new ExpressAdapter(app));
  server.enableShutdownHooks();
  server.enableCors();
  server.init();
  const httpServer = http.createServer(app);
  dbClient = await gameDatabase();
  await GameServer();
  httpServer.listen(SERVICE_PORT);
  Logger.log(`[MAIN] Service running on port ${SERVICE_PORT} 🔥`);
}

bootstrap();