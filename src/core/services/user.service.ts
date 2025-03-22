import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IUserService, CreateUserDto, UpdateUserDto } from '../interfaces/api/user-service.interface';
import { IUserRepository } from '../interfaces/spi/user-repository.interface';
import { User, UserRole } from '../models/user.model';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { USER_REPOSITORY } from '../../infra/constants';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly logger: AppLoggerService
  ) {}

  async getAllUsers(): Promise<User[]> {
    this.logger.log('Getting all users', 'UserService');
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    this.logger.log(`Getting user by ID: ${id}`, 'UserService');
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    this.logger.log(`Getting user by email: ${email}`, 'UserService');
    return this.userRepository.findByEmail(email);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user with email: ${userData.email}`, 'UserService');
    
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      this.logger.error(`User with email ${userData.email} already exists`, undefined, 'UserService');
      throw new ConflictException(`User with email ${userData.email} already exists`);
    }

    try {
      const role = Object.values(UserRole).includes(userData.role as UserRole) 
        ? userData.role 
        : UserRole.REGULAR;
      
      return this.userRepository.create({
        ...userData,
        role
      });
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack, 'UserService');
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    this.logger.log(`Updating user with ID: ${id}`, 'UserService');
    
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      this.logger.error(`User with ID ${id} not found`, undefined, 'UserService');
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(userData.email);
      if (userWithEmail) {
        this.logger.error(`Email ${userData.email} is already in use`, undefined, 'UserService');
        throw new ConflictException(`Email ${userData.email} is already in use`);
      }
    }

    if (userData.role) {
      userData.role = Object.values(UserRole).includes(userData.role as UserRole)
        ? userData.role
        : existingUser.role;
    }

    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    this.logger.log(`Deleting user with ID: ${id}`, 'UserService');
    
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      this.logger.error(`User with ID ${id} not found`, undefined, 'UserService');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return this.userRepository.delete(id);
  }
} 