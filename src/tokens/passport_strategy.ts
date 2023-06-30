import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import responses from '../utils/responses';
import common_utils from '../utils/common_utils';

// eslint-disable-next-line @typescript-eslint/disable-no-var-requires
require('dotenv').config();

export interface JwtPayload {
  email?: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload:any):Promise<object>{
    try {
      const email = await common_utils.decrypt_token(payload);
      return await this.authService.validateUser(email);
    } catch (error) {
      return responses.get_response_object(responses.CODE_UNAUTHORIZED_ACCESS, {}, responses.MESSAGE_UNAUTHORIZED_ACCESS)
    }

  }

}
