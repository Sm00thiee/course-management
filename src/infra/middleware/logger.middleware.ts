import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logging/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    
    const start = Date.now();
    
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const { statusCode } = res;
      
      const message = `${method} ${originalUrl} ${statusCode} ${responseTime}ms`;
      
      if (statusCode >= 500) {
        this.logger.error(message, undefined, 'HTTP');
      } else if (statusCode >= 400) {
        this.logger.warn(message, 'HTTP');
      } else {
        this.logger.log(message, 'HTTP');
      }
    });
    
    next();
  }
} 