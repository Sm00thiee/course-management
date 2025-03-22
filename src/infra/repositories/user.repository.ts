import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../core/interfaces/spi/user-repository.interface';
import { User, UserRole } from '../../core/models/user.model';
import { CreateUserDto, UpdateUserDto } from '../../core/interfaces/api/user-service.interface';
import { UserModel, UserDocument } from '../database/schemas/user.schema';
import { AppLoggerService } from '../logging/logger.service';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    private readonly logger: AppLoggerService
  ) {}

  private toEntity(document: UserDocument): User {
    return {
      id: document._id ? document._id.toString() : '',
      email: document.email,
      password: document.password,
      firstName: document.firstName,
      lastName: document.lastName,
      role: document.role as UserRole,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Finding all users', 'UserRepository');
    const users = await this.userModel.find().exec();
    return users.map(user => this.toEntity(user));
  }

  async findById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`, 'UserRepository');
    const user = await this.userModel.findById(id).exec();
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`, 'UserRepository');
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.toEntity(user) : null;
  }

  async create(userData: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user with email: ${userData.email}`, 'UserRepository');
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    
    const savedUser = await createdUser.save();
    return this.toEntity(savedUser);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    this.logger.log(`Updating user with ID: ${id}`, 'UserRepository');
    
    const updateData = { ...userData };
    
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
      
    return updatedUser ? this.toEntity(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting user with ID: ${id}`, 'UserRepository');
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }
} 