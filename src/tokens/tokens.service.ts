import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './tokens.schema';
import { WinstonService } from '../winston/winston.service';
import responses from '../utils/responses';
import constants from '../utils/constants';

const { TOKEN, PURPOSE, EXPIRY_TIME, IS_EXPIRED, USER } = constants;

export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<Token>,
        @Inject(WinstonService) private winstonService: WinstonService,
    ) {}

    async create(insert_data: object, req) {
        try {
            let token_data = {
                user: insert_data[USER],
                token: insert_data[TOKEN],
                purpose: insert_data[PURPOSE] || '',
                expiry_time: insert_data[EXPIRY_TIME] || 0,
                is_expired: insert_data[IS_EXPIRED] || false
            }
            const new_token = await this.tokenModel.create(token_data);
            return responses.get_response_object(responses.CODE_CREATED, {token: new_token}, responses.MESSAGE_CREATED(TOKEN));
        } catch (err) {
            this.winstonService.error(`path: ${req.path},  data: ${JSON.stringify(insert_data)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async readOne(read_filter: object) {
        try {
            const token = await this.tokenModel.findOne(read_filter);
            return responses.get_response_object(responses.CODE_SUCCESS, {token: token}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`path: 'reading one token',  data: ${JSON.stringify(read_filter)},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async updateOne(read_filter: object, update_filter: object) {
        try {
            const updated_token = await this.tokenModel.updateOne(read_filter, update_filter);
            return responses.get_response_object(responses.CODE_SUCCESS, {token: updated_token}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`path: 'updating one token',  data: ${JSON.stringify({...read_filter, ...update_filter})},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }

    async updateMany(read_filter: object, update_filter: object) {
        try {
            const updated_token = await this.tokenModel.updateMany(read_filter, update_filter);
            return responses.get_response_object(responses.CODE_SUCCESS, {token: updated_token}, responses.MESSAGE_SUCCESS);
        } catch (err) {
            this.winstonService.error(`path: 'updating many token',  data: ${JSON.stringify({...read_filter, ...update_filter})},  message: ${err.message}`);
            console.log(err.message);
            return responses.get_response_object(HttpStatus.BAD_REQUEST, {}, err.message);
        }
    }
}
