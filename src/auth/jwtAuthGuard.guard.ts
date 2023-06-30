import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../tokens/tokens.service';
import responses from '../utils/responses';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  public constructor(private readonly reflector: Reflector, private readonly tokenService: TokenService) {
    super();
  }

  public async canActivate(context: ExecutionContext):Promise<any>{
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest()
    const authorization: string = request?.headers?.authorization ?? '';
    if(!authorization) return responses.get_response_object(responses.CODE_UNAUTHORIZED_ACCESS, {}, responses.MESSAGE_UNAUTHORIZED_ACCESS)
    const [, token] = authorization.split(' ');
    const token_exist = await this.tokenService.readOne({token: token, purpose: 'session_management', is_expired: false});
    if(!token_exist) return responses.get_response_object(responses.CODE_UNAUTHORIZED_ACCESS, {}, responses.MESSAGE_UNAUTHORIZED_ACCESS)
    return super.canActivate(context);
  }
}
