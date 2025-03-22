import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ICourseService, CreateCourseDto, UpdateCourseDto } from '../interfaces/api/course-service.interface';
import { ICourseRepository } from '../interfaces/spi/course-repository.interface';
import { Course } from '../models/course.model';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { COURSE_REPOSITORY } from '../../infra/constants';

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    private readonly logger: AppLoggerService
  ) {}

  async getAllCourses(): Promise<Course[]> {
    this.logger.log('Getting all courses', 'CourseService');
    return this.courseRepository.findAll();
  }

  async getCourseById(id: number): Promise<Course | null> {
    this.logger.log(`Getting course by id: ${id}`, 'CourseService');
    const course = await this.courseRepository.findById(id);
    
    if (!course) {
      this.logger.warn(`Course with id ${id} not found`, 'CourseService');
    }
    
    return course;
  }

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    this.logger.log(`Creating new course: ${courseData.title}`, 'CourseService');
    
    try {
      return this.courseRepository.create(courseData);
    } catch (error) {
      this.logger.error(`Error creating course: ${error.message}`, error.stack, 'CourseService');
      throw new ConflictException('Error creating course');
    }
  }

  async updateCourse(id: number, courseData: UpdateCourseDto): Promise<Course | null> {
    this.logger.log(`Updating course with id: ${id}`, 'CourseService');
    
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      this.logger.error(`Course with id ${id} not found for update`, undefined, 'CourseService');
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    
    try {
      return this.courseRepository.update(id, courseData);
    } catch (error) {
      this.logger.error(`Error updating course: ${error.message}`, error.stack, 'CourseService');
      throw new ConflictException('Error updating course');
    }
  }

  async deleteCourse(id: number): Promise<boolean> {
    this.logger.log(`Deleting course with id: ${id}`, 'CourseService');
    
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      this.logger.error(`Course with id ${id} not found for deletion`, undefined, 'CourseService');
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    
    return this.courseRepository.delete(id);
  }
} 