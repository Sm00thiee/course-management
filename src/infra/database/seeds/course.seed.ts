import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from '../entities/course.entity';
import { AppLoggerService } from '../../logging/logger.service';

@Injectable()
export class CourseSeedService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly logger: AppLoggerService
  ) {}

  async seed(): Promise<void> {
    const courseCount = await this.courseRepository.count();

    if (courseCount === 0) {
      this.logger.log('Seeding 100 sample courses...', 'CourseSeedService');
      
      const courses = this.generateSampleCourses(100);
      await this.courseRepository.save(courses);
      
      this.logger.log('100 sample courses created successfully', 'CourseSeedService');
    } else {
      this.logger.log('Courses already exist, skipping creation', 'CourseSeedService');
    }
  }

  private generateSampleCourses(count: number): Partial<CourseEntity>[] {
    const subjects = [
      'Mathematics', 'Computer Science', 'Biology', 'Physics', 'Chemistry', 
      'History', 'Literature', 'Art', 'Music', 'Engineering'
    ];
    const levels = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
    const instructors = [
      'Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Prof. Brown', 
      'Dr. Davis', 'Prof. Miller', 'Dr. Wilson', 'Prof. Moore'
    ];
    
    const courses: Partial<CourseEntity>[] = [];
    
    for (let i = 1; i <= count; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const instructor = instructors[Math.floor(Math.random() * instructors.length)];
      const credits = Math.floor(Math.random() * 5) + 1;
      
      courses.push({
        title: `${level} ${subject} ${i}`,
        description: `This is a ${level.toLowerCase()} level course in ${subject}. Students will learn fundamental concepts and practical applications.`,
        credits: credits,
        instructor: instructor,
        isActive: true
      });
    }
    
    return courses;
  }
} 