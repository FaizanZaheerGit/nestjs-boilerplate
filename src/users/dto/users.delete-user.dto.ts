import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class DeleteUserDto {
    @IsMongoId({message: 'id should be a valid MongoId'})
    @IsString({message: 'id should be a string'})
    @IsNotEmpty({message: 'id is required'})
    id: string;
}
