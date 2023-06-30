import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WinstonService } from './winston/winston.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const { PORT } = process.env;
const winstonService = new WinstonService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  await app.listen(PORT, () => {
    winstonService.verbose(`STARTED!  Listening on port ${PORT}`);
    Logger.verbose(`STARTED!  Listening on port ${PORT}`);
  });
}
bootstrap();
