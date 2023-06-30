import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, {message: 'email_address should be a valid email'})
    @IsString({message: 'email_address should be a valid string'})
    @IsNotEmpty({message: 'email_address should not be empty'})
    email_address: string;

    @IsString({message: 'password should be a valid string'})
    @IsNotEmpty({message: 'password should not be empty'})
    password: string;
}
