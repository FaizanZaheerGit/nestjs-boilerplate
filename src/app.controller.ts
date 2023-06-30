import { Controller, Get, HttpStatus, Param, Request } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { WinstonService } from './winston/winston.service';
import responses from './utils/responses';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private winstonService: WinstonService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/v1/logs/:type')
  async getLogs(@Param('type') _type: string, @Request() req) {
    try {
      if (_type !== 'error' && _type !== 'combined') {
        return responses.get_response_object(responses.CODE_INVALID_CALL, {}, responses.MESSAGE_INVALID_CALL);
      }
      if (_type == 'error') {
        fs.readFile('./error.log', (err, data) => {
          if (err) {
            this.winstonService.error(`path: ${req.path},  data: ${_type},  message: '${err.message}`);
            return responses.get_response_object(responses.CODE_GENERAL_ERROR, { error: err.message }, responses.MESSAGE_GENERAL_ERROR);
          }
          return responses.get_response_object(responses.CODE_SUCCESS, {data: data.toString()}, responses.MESSAGE_SUCCESS);
        })
      }
      if (_type == 'combined') {
        fs.readFile('./combined.log', (err, data) => {
          if (err) {
            this.winstonService.error(`path: ${req.path},  data: ${_type},  message: '${err.message}`);
            return responses.get_response_object(responses.CODE_GENERAL_ERROR, { error: err.message }, responses.MESSAGE_GENERAL_ERROR);
          }
          return responses.get_response_object(responses.CODE_SUCCESS, {data: data.toString()}, responses.MESSAGE_SUCCESS);
        })
      }
    } catch (err) {
      this.winstonService.error(`path: ${req.path},  data: ${_type},  message: '${err.message}`);
      return responses.get_response_object(HttpStatus.BAD_REQUEST, {type: _type}, err.message);
    }
  }
}
