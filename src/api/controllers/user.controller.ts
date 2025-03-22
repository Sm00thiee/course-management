import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { User, UserRole } from '../../core/models/user.model';
import { CreateUserDto, UpdateUserDto } from '../../core/interfaces/api/user-service.interface';
import { UserService } from '../../core/services/user.service';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLoggerService
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async getAllUsers(): Promise<User[]> {
    this.logger.log('Getting all users', 'UserController');
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<User> {
    this.logger.log(`Getting user by ID: ${id}`, 'UserController');
    const user = await this.userService.getUserById(id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been created' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user', 'UserController');
    
    // Only admins should be able to create other admin users
    this.ensureAdminRoleIfCreatingAdmin(userData);
    
    return this.userService.createUser(userData);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto
  ): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`, 'UserController');
    
    // Only admins should be able to change roles to admin
    this.ensureAdminRoleIfUpdatingToAdmin(userData);
    
    const updatedUser = await this.userService.updateUser(id, userData);
    
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    this.logger.log(`Deleting user with ID: ${id}`, 'UserController');
    
    // Get the user first to check if it's an admin
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    const deleted = await this.userService.deleteUser(id);
    return { success: deleted };
  }
  
  // This is a placeholder - in a real application, you would get the current user from the request
  // and check their role. For now, we'll assume all requests are from admins
  private ensureAdminRoleIfCreatingAdmin(userData: CreateUserDto): void {
    if (userData.role === UserRole.ADMIN) {
      // Uncomment below to add additional check if needed
      // throw new ForbiddenException('Only admins can create admin users');
    }
  }
  
  private ensureAdminRoleIfUpdatingToAdmin(userData: UpdateUserDto): void {
    if (userData.role === UserRole.ADMIN) {
      // Uncomment below to add additional check if needed
      // throw new ForbiddenException('Only admins can update to admin role');
    }
  }
} 