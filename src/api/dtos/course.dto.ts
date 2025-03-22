import { IsString, IsNumber, IsOptional, IsBoolean, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCourseDto, UpdateCourseDto } from '../../core/interfaces/api/course-service.interface';

export class CreateCourseValidationDto implements CreateCourseDto {
  @ApiProperty({ description: 'Course title', example: 'Introduction to Programming' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Course description', example: 'Learn the basics of programming with JavaScript' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Number of credits', example: 3 })
  @IsNumber()
  @Min(0)
  credits: number;

  @ApiProperty({ description: 'Course instructor', example: 'John Doe' })
  @IsString()
  instructor: string;

  @ApiPropertyOptional({ description: 'Whether the course is active', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCourseValidationDto implements UpdateCourseDto {
  @ApiPropertyOptional({ description: 'Course title', example: 'Advanced Programming' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ description: 'Course description', example: 'Advanced concepts in JavaScript programming' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Number of credits', example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  credits?: number;

  @ApiPropertyOptional({ description: 'Course instructor', example: 'Jane Smith' })
  @IsOptional()
  @IsString()
  instructor?: string;

  @ApiPropertyOptional({ description: 'Whether the course is active', example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 