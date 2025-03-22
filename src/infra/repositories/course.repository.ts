import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICourseRepository } from '../../core/interfaces/spi/course-repository.interface';
import { Course } from '../../core/models/course.model';
import { CreateCourseDto, UpdateCourseDto } from '../../core/interfaces/api/course-service.interface';
import { CourseEntity } from '../database/entities/course.entity';
import { AppLoggerService } from '../logging/logger.service';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    private readonly logger: AppLoggerService
  ) {}

  private mapToCore(entity: CourseEntity): Course {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      credits: entity.credits,
      instructor: entity.instructor,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  async findAll(): Promise<Course[]> {
    this.logger.log('Finding all courses', 'CourseRepository');
    const courses = await this.courseRepository.find();
    return courses.map(course => this.mapToCore(course));
  }

  async findById(id: number): Promise<Course | null> {
    this.logger.log(`Finding course by id: ${id}`, 'CourseRepository');
    const course = await this.courseRepository.findOne({ where: { id } });
    return course ? this.mapToCore(course) : null;
  }

  async create(courseData: CreateCourseDto): Promise<Course> {
    this.logger.log(`Creating new course: ${courseData.title}`, 'CourseRepository');
    const newCourse = this.courseRepository.create(courseData);
    const saved = await this.courseRepository.save(newCourse);
    return this.mapToCore(saved);
  }

  async update(id: number, courseData: UpdateCourseDto): Promise<Course | null> {
    this.logger.log(`Updating course with id: ${id}`, 'CourseRepository');
    
    // First check if course exists
    const existingCourse = await this.courseRepository.findOne({ where: { id } });
    if (!existingCourse) {
      return null;
    }
    
    // Update the course
    await this.courseRepository.update(id, courseData);
    
    // Fetch updated course
    const updated = await this.courseRepository.findOne({ where: { id } });
    return updated ? this.mapToCore(updated) : null;
  }

  async delete(id: number): Promise<boolean> {
    this.logger.log(`Deleting course with id: ${id}`, 'CourseRepository');
    const result = await this.courseRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 