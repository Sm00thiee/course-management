import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { createLogger } from 'winston';
import { LoggerConfig } from './logger.config';

@Injectable()
export class AppLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly loggerConfig: LoggerConfig) {
    this.logger = createLogger(this.loggerConfig.createLoggerOptions());
  }

  log(message: string, context?: string) {
    const logContext = context || 'Application';
    this.logger.info(message, { context: logContext });
  }

  error(message: string, trace?: string, context?: string) {
    const logContext = context || 'Application';
    this.logger.error(message, { trace, context: logContext });
  }

  warn(message: string, context?: string) {
    const logContext = context || 'Application';
    this.logger.warn(message, { context: logContext });
  }

  debug(message: string, context?: string) {
    const logContext = context || 'Application';
    this.logger.debug(message, { context: logContext });
  }

  verbose(message: string, context?: string) {
    const logContext = context || 'Application';
    this.logger.verbose(message, { context: logContext });
  }
} 