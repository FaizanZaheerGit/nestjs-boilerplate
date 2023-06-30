import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
    @IsMongoId({message: 'id should be a valid MongoId'})
    @IsString({message: 'id should be a string'})
    @IsNotEmpty({message: 'id is required'})
    id: string;

    @IsString({message: 'old_password should be a string'})
    @IsNotEmpty({message: 'old_password is required'})
    old_password: string;

    @IsStrongPassword({minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1, }, {message: 'use a stronger password'})
    @IsString({message: 'new_password should be a string'})
    @IsNotEmpty({message: 'new_password is required'})
    new_password: string;
}
