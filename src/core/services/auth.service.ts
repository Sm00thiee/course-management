import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService, LoginDto, RegisterDto, TokenPayload, AuthResponse } from '../interfaces/api/auth-service.interface';
import { IUserService } from '../interfaces/api/user-service.interface';
import { UserRole, User } from '../models/user.model';
import { AppLoggerService } from '../../infra/logging/logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`Registering new user with email: ${registerDto.email}`, 'AuthService');
    
    // Create a new user with REGULAR role
    const user = await this.userService.createUser({
      ...registerDto,
      role: UserRole.REGULAR
    });
    
    // Generate JWT token
    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Attempting login for user: ${loginDto.email}`, 'AuthService');
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      this.logger.error(`Invalid credentials for email: ${loginDto.email}`, undefined, 'AuthService');
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.generateAuthResponse(user as User);
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    this.logger.log(`Validating user: ${email}`, 'AuthService');
    
    const user = await this.userService.getUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Remove password from returned user
    const { password: _, ...result } = user;
    return result;
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };
    
    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword
    };
  }
} 