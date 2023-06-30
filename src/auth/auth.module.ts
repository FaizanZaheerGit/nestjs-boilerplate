import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../tokens/passport_strategy';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { JWT_SECRET } = process.env;

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt',
      property: 'user'
    }),
    JwtModule.register({ secret: JWT_SECRET }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule]
})
export class AuthModule {}
