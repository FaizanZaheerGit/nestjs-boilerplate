import { Controller, Post, UseGuards, Body, Request, Headers } from '@nestjs/common';
import { Public } from '../tokens/public_decorator';
import { JwtAuthGuard } from './jwtAuthGuard.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.login.dto';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/auth')

export class AuthController {
    constructor(
        private authService: AuthService
    ){}
    
    @Public()
    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Request() req) {
        const result = await this.authService.login(loginDto, req);
        return result;
    }

    @Post('/logout')
    async logout(@Headers('Authorization') authorizationHeader: string, @Request() req) {
        const token: string = authorizationHeader.split(' ')[1];
        const result = await this.authService.logout(token, req);
        return result;
    }
}
