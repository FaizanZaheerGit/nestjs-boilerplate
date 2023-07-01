import { Injectable, Inject, HttpStatus, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { User } from './users.schema';
import { CreateUserDto } from './dto/users.create-user.dto';
import { ChangePasswordDto } from './dto/users.change-password.dto';
import { TokenService } from '../tokens/tokens.service';
import { WinstonService } from '../winston/winston.service';
import common_utils from '../utils/common_utils';
import constants from '../utils/constants';
import responses from '../utils/responses';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;
const { ID, EMAIL_ADDRESS, PASSWORD, PASSWORD_SALT, USER, NEW_PASSWORD, CREATED_BY, UPDATED_BY } = constants;

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(WinstonService) private winstonService: WinstonService,
    ){}

    async onModuleInit() {
        const [password, salt] = await common_utils.encrypt_password(ADMIN_PASSWORD);
        await this.userModel.findOneAndUpdate({ email_address: ADMIN_EMAIL }, { email_address: ADMIN_EMAIL, password: password, password_salt: salt, name: ADMIN_NAME, phone_number: ADMIN_PHONE }, { upsert: true });
    }

    async create(createUserDto: CreateUserDto, req): Promise<object> {
        try {
            createUserDto[EMAIL_ADDRESS] = createUserDto[EMAIL_ADDRESS].trim().toLowerCase();
            const existing_user = await this.userModel.exists({email_address: createUserDto[EMAIL_ADDRESS]});
            if (existing_user) {
                return responses.get_response_object(responses.CODE_ALREADY_EXISTS, {}, responses.MESSAGE_ALREADY_EXISTS([USER, EMAIL_ADDRESS]));
            }
            const [password, salt] = await common_utils.encrypt_password(createUserDto[PASSWORD]);
            createUserDto[PASSWORD] = password;
            createUserDto[PASSWORD_SALT] = salt;
            createUserDto[CREATED_BY] = req?.user?.data?.user?._id || null;
            createUserDto[UPDATED_BY] = req?.user?.data?.user?._id || null;
            await this.userModel.create(createUserDto);
            const new_user = await this.userModel.findOne({email_address: createUserDto[EMAIL_ADDRESS]}).select('-password -password_salt')
            .populate({path: 'created_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}})
            .populate({path: 'updated_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}});
            return responses.get_response_object(responses.CODE_CREATED, {user: new_user}, responses.MESSAGE_CREATED(USER));
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(createUserDto)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async read(read_filter: FilterQuery<User> ={}, projection_filter: QueryOptions<User> ={}, req): Promise<object> {
        try {
            const users = await this.userModel.find(read_filter, {}, {projection: projection_filter})
            .populate({path: 'created_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}})
            .populate({path: 'updated_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}});
            return responses.get_response_object(responses.CODE_SUCCESS, {users: users}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(read_filter)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async readOne(read_filter: FilterQuery<User> ={}, req =null): Promise<object> {
        try {
            const user = await this.userModel.findOne(read_filter)
            .populate({path: 'created_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}})
            .populate({path: 'updated_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}});
            if (!user) return responses.get_response_object(responses.CODE_NOT_FOUND, {}, responses.MESSAGE_NOT_FOUND([USER, `${Object.keys(read_filter)[0]}`]));
            return responses.get_response_object(responses.CODE_SUCCESS, {user: user}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            if (req != null) {
                this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(read_filter)},  message: ${err.message}`);
            }
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async update(read_filter: FilterQuery<User> ={}, update_filter: UpdateQuery<User> ={}, query_options: QueryOptions ={}, req): Promise<object> {
        try {
            await this.userModel.updateOne(read_filter, update_filter, query_options);
            update_filter[UPDATED_BY] = req?.user?.data?.user?._id || null;
            const updated_user = await this.userModel.findOne(read_filter).select('-password -password_salt')
            .populate({path: 'created_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}})
            .populate({path: 'updated_by', select: 'name email_address phone_number display_picture', options: {strictPopulate: false}});
            return responses.get_response_object(responses.CODE_SUCCESS, {user: updated_user}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${req.data},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto, req): Promise<object> {
        try {
            const [password, salt] = await common_utils.encrypt_password(changePasswordDto[NEW_PASSWORD]);
            const updated_user = await this.userModel.findOneAndUpdate({_id: changePasswordDto[ID]}, {password: password, password_salt: salt}, {upsert: false, returnDocument: 'after'});
            return responses.get_response_object(responses.CODE_SUCCESS, {user: updated_user}, responses.MESSAGE_PASSWORD_UPDATED_SUCCESSFULLY);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(changePasswordDto)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async delete(delete_filter: FilterQuery<User> ={}, req): Promise<object> {
        try {
            const user: Model<User> = await this.userModel.findOne(delete_filter);
            await this.tokenService.deleteMany({user: user['_id']});
            await this.userModel.deleteOne(delete_filter);
            return responses.get_response_object(responses.CODE_SUCCESS, {}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`status: ${req.status},  path: ${req.path},  data: ${JSON.stringify(delete_filter)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }
}
