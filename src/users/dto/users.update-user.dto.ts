import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsPhoneNumber, IsUrl, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsMongoId({message: 'id should be a valid MongoId'})
    @IsString({message: 'id should be a string'})
    @IsNotEmpty({message: 'id is required'})
    id: string;

    @MinLength(3, {message: 'name should be more than 3 characters'})
    @IsString({message: 'name should be a string'})
    @IsOptional()
    name?: string;

    @IsPhoneNumber(null, {message: 'phone_number should be a valid phone_number'})
    @IsString({message: 'phone_number should be a string'})
    @IsOptional()
    phone_number?: string;

    @IsUrl({}, {message: 'display_picture should be a valid url'})
    @IsString({message: 'display_picture should be a string'})
    @IsOptional()
    display_picture?: string;
}
