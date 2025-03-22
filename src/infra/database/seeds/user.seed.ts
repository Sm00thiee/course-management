import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../schemas/user.schema';
import { UserRole } from '../../../core/models/user.model';
import { AppLoggerService } from '../../logging/logger.service';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly logger: AppLoggerService
  ) {}

  async seed(): Promise<void> {
    const adminUserCount = await this.userModel.countDocuments({ 
      email: 'admin@test.com' 
    });

    if (adminUserCount === 0) {
      this.logger.log('Seeding admin user...', 'UserSeedService');
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('password123', saltRounds);
      
      // Create admin user
      await this.userModel.create({
        email: 'admin@test.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      });
      
      this.logger.log('Admin user created successfully', 'UserSeedService');
    } else {
      this.logger.log('Admin user already exists, skipping creation', 'UserSeedService');
    }
  }
} 