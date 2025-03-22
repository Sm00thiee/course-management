import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeedService } from './user.seed';
import { CourseSeedService } from './course.seed';
import { AppLoggerService } from '../../logging/logger.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly userSeedService: UserSeedService,
    private readonly courseSeedService: CourseSeedService,
    private readonly logger: AppLoggerService
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    try {
      this.logger.log('Starting database seeding...', 'SeedService');
      
      // Seed admin user
      await this.userSeedService.seed();
      
      // Seed sample courses
      await this.courseSeedService.seed();
      
      this.logger.log('Database seeding completed successfully', 'SeedService');
    } catch (error) {
      this.logger.error(`Error during database seeding: ${error.message}`, error.stack, 'SeedService');
      throw error;
    }
  }
} 