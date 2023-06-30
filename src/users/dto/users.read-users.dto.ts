import { IsOptional, IsString, IsEmail, IsMongoId, IsNumber } from 'class-validator';

export class ReadUserDto {
    @IsMongoId({message: 'id should be a valid MongoId'})
    @IsString({message: 'id should be a string'})
    @IsOptional()
    id?: string;

    @IsString({message: 'name should be a string'})
    @IsOptional()
    name?: string;

    @IsEmail({}, {message: 'email_address should be a vaild email'})
    @IsString({message: 'email_address should be a string'})
    @IsOptional()
    email_address?: string;

    @IsNumber({allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0}, {message: 'page should be a valid number greater than 0'})
    @IsOptional()
    page?: string;

    @IsNumber({allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0}, {message: 'limit should be a valid number greater than 0'})
    @IsOptional()
    limit?: string;
}
