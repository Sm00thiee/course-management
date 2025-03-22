import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, NotFoundException, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { EnrollmentDto } from '../dtos/enrollment.dto';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { Enrollment } from '../../core/models/enrollment.model';

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly logger: AppLoggerService
  ) {}

  @Post('enroll')
  @ApiOperation({ summary: 'Enroll in a course' })
  @ApiResponse({ status: 201, description: 'Successfully enrolled in the course' })
  @ApiResponse({ status: 404, description: 'User or course not found' })
  @ApiResponse({ status: 409, description: 'Already enrolled in the course' })
  async enrollCourse(@Body() enrollmentDto: EnrollmentDto, @Request() req): Promise<Enrollment> {
    this.logger.log(`User ${req.user.id} enrolling in course ${enrollmentDto.courseId}`, 'EnrollmentController');
    
    // Only allow users to enroll themselves
    if (req.user.id !== enrollmentDto.userId && req.user.role !== 'admin') {
      throw new UnauthorizedException('You can only enroll yourself in courses');
    }
    
    return this.enrollmentService.enrollCourse(enrollmentDto);
  }

  @Delete(':userId/courses/:courseId')
  @ApiOperation({ summary: 'Drop a course' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Successfully dropped the course' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async dropCourse(
    @Param('userId') userId: string,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Request() req
  ): Promise<{ success: boolean }> {
    this.logger.log(`User ${req.user.id} dropping course ${courseId}`, 'EnrollmentController');
    
    // Only allow users to drop their own enrollments
    if (req.user.id !== userId && req.user.role !== 'admin') {
      throw new UnauthorizedException('You can only drop your own courses');
    }
    
    const result = await this.enrollmentService.dropCourse(userId, courseId);
    return { success: result };
  }

  @Get('users/:userId/courses')
  @ApiOperation({ summary: 'Get all courses a user is enrolled in' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return all enrollments for the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserEnrollments(@Param('userId') userId: string, @Request() req): Promise<Enrollment[]> {
    this.logger.log(`Getting enrollments for user ${userId}`, 'EnrollmentController');
    
    // Only allow users to view their own enrollments
    if (req.user.id !== userId && req.user.role !== 'admin') {
      throw new UnauthorizedException('You can only view your own enrollments');
    }
    
    return this.enrollmentService.getUserEnrollments(userId);
  }

  @Get('courses/:courseId/users')
  @ApiOperation({ summary: 'Get all users enrolled in a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Return all enrollments for the course' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getCourseEnrollments(@Param('courseId', ParseIntPipe) courseId: number): Promise<Enrollment[]> {
    this.logger.log(`Getting enrollments for course ${courseId}`, 'EnrollmentController');
    return this.enrollmentService.getCourseEnrollments(courseId);
  }
} 