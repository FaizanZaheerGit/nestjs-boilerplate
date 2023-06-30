import { IsNotEmpty, IsOptional, IsString, IsEmail, IsPhoneNumber, IsStrongPassword, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
    @MinLength(3, {message: 'name should be more than 3 characters'})
    @IsString({message: 'name should be a string'})
    @IsNotEmpty({message: 'name is required'})
    name: string;

    @IsEmail({}, {message: 'email_address should be a vaild email'})
    @IsString({message: 'email_address should be a string'})
    @IsNotEmpty({message: 'email_address is required'})
    email_address: string;

    @IsPhoneNumber(null, {message: 'phone_number should be a valid phone_number'})
    @IsString({message: 'phone_number should be a string'})
    @IsOptional()
    phone_number?: string;

    @IsStrongPassword({minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1, }, {message: 'use a stronger password'})
    @IsString({message: 'password should be a string'})
    @IsNotEmpty({message: 'password is required'})
    password: string;

    @IsUrl({}, {message: 'display_picture should be a valid url'})
    @IsString({message: 'display_picture should be a string'})
    @IsOptional()
    display_picture?: string;
}
