import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IEnrollmentService, EnrollCourseDto } from '../interfaces/api/enrollment-service.interface';
import { IEnrollmentRepository } from '../interfaces/spi/enrollment-repository.interface';
import { ICourseRepository } from '../interfaces/spi/course-repository.interface';
import { IUserRepository } from '../interfaces/spi/user-repository.interface';
import { Enrollment, EnrollmentStatus } from '../models/enrollment.model';
import { AppLoggerService } from '../../infra/logging/logger.service';
import { ENROLLMENT_REPOSITORY, COURSE_REPOSITORY, USER_REPOSITORY } from '../../infra/constants';

@Injectable()
export class EnrollmentService implements IEnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly logger: AppLoggerService
  ) {}

  async enrollCourse(enrollmentData: EnrollCourseDto): Promise<Enrollment> {
    this.logger.log(`Enrolling user ${enrollmentData.userId} in course ${enrollmentData.courseId}`, 'EnrollmentService');
    
    // Check if the user exists
    const user = await this.userRepository.findById(enrollmentData.userId);
    if (!user) {
      this.logger.error(`User with ID ${enrollmentData.userId} not found`, undefined, 'EnrollmentService');
      throw new NotFoundException(`User with ID ${enrollmentData.userId} not found`);
    }
    
    // Check if the course exists
    const course = await this.courseRepository.findById(enrollmentData.courseId);
    if (!course) {
      this.logger.error(`Course with ID ${enrollmentData.courseId} not found`, undefined, 'EnrollmentService');
      throw new NotFoundException(`Course with ID ${enrollmentData.courseId} not found`);
    }
    
    // Check if the user is already enrolled in the course
    const existingEnrollment = await this.enrollmentRepository.findByUserAndCourse(
      enrollmentData.userId,
      enrollmentData.courseId
    );
    
    if (existingEnrollment && existingEnrollment.status === EnrollmentStatus.ACTIVE) {
      this.logger.error(
        `User ${enrollmentData.userId} is already enrolled in course ${enrollmentData.courseId}`,
        undefined,
        'EnrollmentService'
      );
      throw new ConflictException(`User is already enrolled in this course`);
    } else if (existingEnrollment && existingEnrollment.status === EnrollmentStatus.DROPPED) {
      // If the user has previously dropped the course, reactivate the enrollment
      const updatedEnrollment = await this.enrollmentRepository.update(
        existingEnrollment.id,
        {
          status: EnrollmentStatus.ACTIVE,
          lastUpdated: new Date()
        }
      );
      
      if (!updatedEnrollment) {
        throw new Error(`Failed to reactivate enrollment`);
      }
      
      return updatedEnrollment;
    }
    
    // Create a new enrollment
    return this.enrollmentRepository.create(enrollmentData);
  }

  async dropCourse(userId: string, courseId: number): Promise<boolean> {
    this.logger.log(`Dropping course ${courseId} for user ${userId}`, 'EnrollmentService');
    
    // Check if the user is enrolled in the course
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    
    if (!enrollment) {
      this.logger.error(`User ${userId} is not enrolled in course ${courseId}`, undefined, 'EnrollmentService');
      throw new NotFoundException(`User is not enrolled in this course`);
    }
    
    if (enrollment.status === EnrollmentStatus.DROPPED) {
      this.logger.error(`User ${userId} has already dropped course ${courseId}`, undefined, 'EnrollmentService');
      throw new ConflictException(`User has already dropped this course`);
    }
    
    // Update the enrollment status to DROPPED
    const updatedEnrollment = await this.enrollmentRepository.update(
      enrollment.id,
      {
        status: EnrollmentStatus.DROPPED,
        lastUpdated: new Date()
      }
    );
    
    return !!updatedEnrollment;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    this.logger.log(`Getting enrollments for user ${userId}`, 'EnrollmentService');
    
    // Check if the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`, undefined, 'EnrollmentService');
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    return this.enrollmentRepository.findByUser(userId);
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    this.logger.log(`Getting enrollments for course ${courseId}`, 'EnrollmentService');
    
    // Check if the course exists
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      this.logger.error(`Course with ID ${courseId} not found`, undefined, 'EnrollmentService');
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    
    return this.enrollmentRepository.findByCourse(courseId);
  }

  async isUserEnrolled(userId: string, courseId: number): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} is enrolled in course ${courseId}`, 'EnrollmentService');
    
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    return !!enrollment && enrollment.status === EnrollmentStatus.ACTIVE;
  }
} 