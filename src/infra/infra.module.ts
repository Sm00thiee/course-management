import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingModule } from './logging/logging.module';
import { UserRepository } from './repositories/user.repository';
import { CourseRepository } from './repositories/course.repository';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { UserModel, UserSchema } from './database/schemas/user.schema';
import { EnrollmentModel, EnrollmentSchema } from './database/schemas/enrollment.schema';
import { CourseEntity } from './database/entities/course.entity';
import { USER_REPOSITORY, COURSE_REPOSITORY, ENROLLMENT_REPOSITORY } from './constants';

@Module({
  imports: [
    LoggingModule,

    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/course-management'),
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: EnrollmentModel.name, schema: EnrollmentSchema }
    ]),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'password',
      database: process.env.MYSQL_DATABASE || 'course_management',
      entities: [CourseEntity],
      synchronize: true, // Only for development
    }),
    TypeOrmModule.forFeature([CourseEntity])
  ],
  controllers: [],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository
    },
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseRepository
    },
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepository
    }
  ],
  exports: [
    LoggingModule,
    USER_REPOSITORY,
    COURSE_REPOSITORY,
    ENROLLMENT_REPOSITORY
  ],
})
export class InfraModule {} 