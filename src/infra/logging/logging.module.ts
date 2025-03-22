import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './logger.service';
import { LoggerConfig } from './logger.config';

@Global()
@Module({
  providers: [LoggerConfig, AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggingModule {} 