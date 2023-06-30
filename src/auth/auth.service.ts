import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../tokens/passport_strategy';
import { User } from '../users/users.schema';
import { WinstonService } from '../winston/winston.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../tokens/tokens.service';
import { LoginDto } from './dto/auth.login.dto';
import responses from '../utils/responses';
import constants from '../utils/constants';
import common_utils from '../utils/common_utils';

const { EMAIL_ADDRESS, MESSAGE, DATA, PASSWORD, USER } = constants;

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(WinstonService) private winstonService: WinstonService,
        @Inject(UsersService) private usersService: UsersService
    ){}
    async validateUser(email : string):Promise<User|object>{
        try {
            const user = await this.usersService.readOne({email_address: email}, null);
            if(!user) return {};
            return user;
        } catch (err) {
            console.log(err);
            return {};
        }
    }

    async login(loginDto: LoginDto, req) {
        try {
            loginDto[EMAIL_ADDRESS] = loginDto[EMAIL_ADDRESS].trim().toLowerCase();
            const existing_user = await this.usersService.readOne({ email_address: loginDto[EMAIL_ADDRESS] });
            if (existing_user[MESSAGE] != responses.MESSAGE_SUCCESS) {
                return responses.get_response_object(responses.CODE_NOT_FOUND, {}, responses.MESSAGE_NOT_FOUND([USER, EMAIL_ADDRESS]))
            }
            const match_password = common_utils.compare_password(loginDto[PASSWORD], existing_user[DATA].user.password);
            if (!match_password) {
                return responses.get_response_object(responses.CODE_INVALID_CALL, {}, responses.MESSAGE_INVALID_EMAIL_ADDRESS_OR_PASSWORD)
            }
            const payload: JwtPayload = {email: loginDto[EMAIL_ADDRESS]};
            const encrypt_token : string = await common_utils.encrypt_token(payload.email);
            const token = this.jwtService.sign(encrypt_token);
            await this.tokenService.create({user: existing_user[DATA].user._id, token: token, purpose: 'session_management'}, req);
            return responses.get_response_object(responses.CODE_SUCCESS, {user: existing_user[DATA].user, token: token}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`path: ${req.path},  data: ${JSON.stringify(loginDto)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async logout(token: string, req: any) {
        try {
            const exisitng_token = await this.tokenService.readOne({token: token, is_expired: false});
            if (!exisitng_token) {
               return responses.get_response_object(responses.CODE_INVALID_CALL, {}, responses.MESSAGE_INVALID_TOKEN)
            }
            await this.tokenService.updateOne({token: token, is_expired: false}, {is_expired: true, expiry_time: common_utils.get_current_epoch_time()});
            return responses.get_response_object(responses.CODE_SUCCESS, {}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`path: ${req.path},  data: ${JSON.stringify({})},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }
}
