import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { format, transports } from 'winston';

@Injectable()
export class LoggerConfig {
  createLoggerOptions(): winston.LoggerOptions {
    return {
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.json()
      ),
      defaultMeta: { service: 'course-management' },
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          ),
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    };
  }
} 