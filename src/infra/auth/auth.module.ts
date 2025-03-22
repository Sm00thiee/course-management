import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANTS } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: JWT_CONSTANTS.expiresIn },
    }),
    forwardRef(() => CoreModule)
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule]
})
export class AuthInfraModule {} 