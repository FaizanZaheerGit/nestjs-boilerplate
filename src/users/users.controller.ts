import { Controller, UseGuards, Post, Get, Put, Patch, Delete, Body, Query, Param, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuthGuard.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.create-user.dto';
import { ReadUserDto } from './dto/users.read-users.dto';
import { UpdateUserDto } from './dto/users.update-user.dto';
import { ChangePasswordDto } from './dto/users.change-password.dto';
import { DeleteUserDto } from './dto/users.delete-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/users')

export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('/user-create')
    async createUser (@Body() createUserDto: CreateUserDto, @Request() req) {
        return await this.usersService.create(createUserDto, req);
    }

    @Get('/user-read')
    async readUser (@Query() args: ReadUserDto, @Request() req) {
        return await this.usersService.read(args, {password: 0, password_salt: 0}, req);
    }

    @Put('/user-update')
    async updateUser (@Body() updateUserDto: UpdateUserDto, @Request() req) {
        const updateUserDtoCopy = {...updateUserDto};
        delete updateUserDtoCopy.id;
        return await this.usersService.update({_id: updateUserDto['id']}, updateUserDtoCopy, {upsert: true, returnDocument: 'after'}, req);
    }

    @Patch('/user-change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
        return await this.usersService.changePassword(changePasswordDto, req);
    }

    @Delete('/user-delete/:id')
    async deleteUser (@Param('id') id: DeleteUserDto, @Request() req) {
        return await this.usersService.delete(id, req);
    }
}
