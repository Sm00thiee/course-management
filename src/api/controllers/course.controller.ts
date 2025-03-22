import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, ParseIntPipe, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CourseService } from '../../core/services/course.service';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { Course } from '../../core/models/course.model';
import { CreateCourseValidationDto, UpdateCourseValidationDto } from '../dtos/course.dto';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly logger: AppLoggerService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiResponse({ status: 200, description: 'Return all courses' })
  async getAllCourses(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ courses: Course[], total: number, page: number, limit: number, totalPages: number }> {
    this.logger.log(`Getting all courses with pagination: page ${page}, limit ${limit}`, 'CourseController');
    
    // Convert to numbers and set defaults
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    
    // Get all courses first (in a real app you'd use a repository method with pagination)
    const allCourses = await this.courseService.getAllCourses();
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = allCourses.length;
    const totalPages = Math.ceil(total / limit);
    
    // Slice courses according to pagination
    const courses = allCourses.slice(startIndex, endIndex);
    
    return {
      courses,
      total,
      page,
      limit,
      totalPages
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by id' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Return the course' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getCourseById(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    this.logger.log(`Getting course by id: ${id}`, 'CourseController');
    const course = await this.courseService.getCourseById(id);
    
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    
    return course;
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'The course has been created' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async createCourse(@Body() courseData: CreateCourseValidationDto): Promise<Course> {
    this.logger.log(`Creating new course: ${courseData.title}`, 'CourseController');
    return this.courseService.createCourse(courseData);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'The course has been updated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() courseData: UpdateCourseValidationDto
  ): Promise<Course> {
    this.logger.log(`Updating course with id: ${id}`, 'CourseController');
    const updatedCourse = await this.courseService.updateCourse(id, courseData);
    
    if (!updatedCourse) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    
    return updatedCourse;
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'The course has been deleted' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden access (admin only)' })
  async deleteCourse(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    this.logger.log(`Deleting course with id: ${id}`, 'CourseController');
    const deleted = await this.courseService.deleteCourse(id);
    return { success: deleted };
  }
} 