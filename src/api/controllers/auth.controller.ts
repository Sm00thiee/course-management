import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../core/services/auth.service';
import { LoginUserDto, RegisterUserDto } from '../dtos/auth.dto';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { AuthResponse } from '../../core/interfaces/api/auth-service.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLoggerService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (invalid data)' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterUserDto): Promise<AuthResponse> {
    this.logger.log(`Received registration request for: ${registerDto.email}`, 'AuthController');
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid credentials)' })
  async login(@Body() loginDto: LoginUserDto): Promise<AuthResponse> {
    this.logger.log(`Received login request for: ${loginDto.email}`, 'AuthController');
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return the user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid token)' })
  getProfile(@Req() req) {
    this.logger.log(`User accessing profile: ${req.user.email}`, 'AuthController');
    return req.user;
  }
} 