import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import config from './config/config';
import { WinstonModule } from 'src/winston/winston.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './tokens/tokens.module';
import { GlobalExceptionFilter } from './global-exception-filter';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGODB_URI),
    UsersModule,
    WinstonModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ],
})
export class AppModule {}
