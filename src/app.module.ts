import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { InfraModule } from './infra/infra.module';
import { LoggerMiddleware } from './infra/middleware/logger.middleware';
import { AuthInfraModule } from './infra/auth/auth.module';
import { SeedModule } from './infra/database/seeds/seed.module';

@Module({
  imports: [
    ApiModule, 
    CoreModule, 
    InfraModule, 
    AuthInfraModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
