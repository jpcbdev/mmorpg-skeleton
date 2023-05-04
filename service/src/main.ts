import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http'
import { SERVICE_PORT } from './shared/constants';
import { Logger } from '@nestjs/common';

import { monitor } from '@colyseus/monitor';
import { initGameServer } from './game/server';
import { initDatabase } from './shared/utils';
import { Db } from 'mongodb';

export let dbClient: Db = null;

async function bootstrap() {

  const app = express();
  app.use('/monitor', monitor());

  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));

  nestApp.enableShutdownHooks();
  nestApp.enableCors();
  nestApp.init();

  const httpServer = http.createServer(app);

  dbClient = await initDatabase();
  await initGameServer();

  httpServer.listen(SERVICE_PORT);

  Logger.log(`[MAIN] Service running on port ${SERVICE_PORT} 🔥`);

}

bootstrap();
