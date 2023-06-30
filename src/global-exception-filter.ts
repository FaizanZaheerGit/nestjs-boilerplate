import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { WinstonService } from './winston/winston.service';

/* This is a global exception filter class in TypeScript that catches and handles HTTP exceptions. */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const winstonService = new WinstonService();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message : any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }
    if(Array.isArray(message?.message)) {
      message.message = message.message[0]
    }
    Logger.error(exception)
    response.status(200).json({
      statusCode: status,
      data: {},
      message: message
    });
    winstonService.error(`status: ${status},  path: ${request.path},  data: {},  message: ${message}`);
  }
}
