import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { User } from './users.schema';
import { CreateUserDto } from './dto/users.create-user.dto';
import { ChangePasswordDto } from './dto/users.change-password.dto';
import { WinstonService } from '../winston/winston.service';
import common_utils from '../utils/common_utils';
import constants from '../utils/constants';
import responses from '../utils/responses';

const { EMAIL_ADDRESS, PASSWORD, PASSWORD_SALT } = constants;

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject(WinstonService) private winstonService: WinstonService,
    ){}

    async create(createUserDto: CreateUserDto, req) {
        try {
            createUserDto['email_address'] = createUserDto['email_address'].trim().toLowerCase();
            const existing_user = await this.userModel.exists({email_address: createUserDto['email_address']});
            if (existing_user) {
                return responses.get_response_object(responses.CODE_ALREADY_EXISTS, {}, responses.MESSAGE_ALREADY_EXISTS(['User', 'Email address']));
            }
            const [password, salt] = await common_utils.encrypt_password(createUserDto['password']);
            createUserDto['password'] = password;
            createUserDto['password_salt'] = salt;
            await this.userModel.create(createUserDto);
            const new_user = await this.userModel.findOne({email_address: createUserDto['email_address']}).select('-password -password_salt');
            return responses.get_response_object(responses.CODE_CREATED, {user: new_user}, responses.MESSAGE_CREATED('User'));
        } catch (err) {
            this.winstonService.error(`path: ${req.path},  data: ${JSON.stringify(createUserDto)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async read(read_filter: FilterQuery<User> ={}, projection_filter: QueryOptions<User> ={}, req) {
        try {
            const users = await this.userModel.find(read_filter, {}, {projection: projection_filter})
            .populate({path: 'created_by', select: 'name email_address phone_number', options: {strictPopulate: false}})
            .populate({path: 'updated_by', select: 'name email_address phone_number', options: {strictPopulate: false}});
            return responses.get_response_object(responses.CODE_SUCCESS, {users: users}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(read_filter)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async readOne(read_filter: FilterQuery<User> ={}, req =null) {
        try {
            const user = await this.userModel.findOne(read_filter)
            .populate({path: 'created_by', select: 'name email_address phone_number', options: {strictPopulate: false}})
            .populate({path: 'updated_by', select: 'name email_address phone_number', options: {strictPopulate: false}});
            if (!user) return responses.get_response_object(responses.CODE_NOT_FOUND, {}, responses.MESSAGE_NOT_FOUND(['User', `${Object.keys(read_filter)[0]}`]));
            return responses.get_response_object(responses.CODE_SUCCESS, {user: user}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            if (req != null) {
                this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(read_filter)},  message: ${err.message}`);
            }
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async update(read_filter: FilterQuery<User> ={}, update_filter: UpdateQuery<User> ={}, query_options: QueryOptions ={}, req) {
        try {
            await this.userModel.updateOne(read_filter, update_filter, query_options);
            const updated_user = await this.userModel.findOne(read_filter).select('-password -password_salt');
            return responses.get_response_object(responses.CODE_SUCCESS, {user: updated_user}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${req.data},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto, req) {
        try {
            const [password, salt] = await common_utils.encrypt_password(changePasswordDto['new_password']);
            const updated_user = await this.userModel.findOneAndUpdate({_id: changePasswordDto['id']}, {password: password, password_salt: salt}, {upsert: false, returnDocument: 'after'});
            return responses.get_response_object(responses.CODE_SUCCESS, {user: updated_user}, responses.MESSAGE_PASSWORD_UPDATED_SUCCESSFULLY);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(changePasswordDto)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async delete(delete_filter: FilterQuery<User> ={}, req) {
        try {
            await this.userModel.deleteOne(delete_filter);
            return responses.get_response_object(responses.CODE_SUCCESS, {}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(delete_filter)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }
}
