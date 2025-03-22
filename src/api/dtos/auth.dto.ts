import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '../../core/interfaces/api/auth-service.interface';

export class LoginUserDto implements LoginDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User password', 
    example: 'password123', 
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterUserDto implements RegisterDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User password', 
    example: 'password123', 
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  lastName: string;
} 