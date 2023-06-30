import { Injectable } from '@nestjs/common';
import * as winston from 'winston';


const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `Time: ${timestamp}, level: ${level}, message: ${stack || message}`;
});

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      logFormat,
    ),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
});

@Injectable()
export class WinstonService {
    constructor(){}

    log(message: any, context?: string) {
      logger.log('info', message, { context });
    }

    error(message: any, trace?: string, context?: string) {
      logger.log('error', message, { trace, context });
    }

    warn(message: any, context?: string) {
      logger.log('warn', message, { context });
    }

    debug(message: any, context?: string) {
      logger.log('debug', message, { context });
    }

    verbose(message: any, context?: string) {
      logger.log('verbose', message, { context });
    }
}
