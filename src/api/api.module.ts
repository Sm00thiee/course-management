import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { CourseController } from './controllers/course.controller';
import { EnrollmentController } from './controllers/enrollment.controller';
import { CoreModule } from '../core/core.module';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [CoreModule],
  controllers: [
    UserController,
    AuthController,
    CourseController,
    EnrollmentController
  ],
  providers: [AdminGuard],
  exports: [],
})
export class ApiModule {} 