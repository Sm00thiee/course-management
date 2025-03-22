import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnrollCourseDto } from '../../core/interfaces/api/enrollment-service.interface';

export class EnrollmentDto implements EnrollCourseDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Course ID', example: 1 })
  @IsNumber()
  courseId: number;
} 