import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';
import { EnrollmentService } from './services/enrollment.service';
import { InfraModule } from '../infra/infra.module';
import { AuthInfraModule } from '../infra/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => InfraModule),
    forwardRef(() => AuthInfraModule)
  ],
  controllers: [],
  providers: [
    UserService,
    AuthService,
    CourseService,
    EnrollmentService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserService
    }
  ],
  exports: [
    UserService,
    AuthService,
    CourseService,
    EnrollmentService,
    'USER_SERVICE'
  ],
})
export class CoreModule {} 