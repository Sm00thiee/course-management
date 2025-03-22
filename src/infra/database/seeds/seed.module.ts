import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel, UserSchema } from '../schemas/user.schema';
import { CourseEntity } from '../entities/course.entity';
import { UserSeedService } from './user.seed';
import { CourseSeedService } from './course.seed';
import { SeedService } from './seed.service';
import { LoggingModule } from '../../logging/logging.module';

@Module({
  imports: [
    LoggingModule,
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
    ]),
    TypeOrmModule.forFeature([CourseEntity]),
  ],
  providers: [
    UserSeedService,
    CourseSeedService,
    SeedService,
  ],
  exports: [SeedService],
})
export class SeedModule {} 