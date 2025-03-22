import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEnrollmentRepository } from '../../core/interfaces/spi/enrollment-repository.interface';
import { Enrollment, EnrollmentStatus } from '../../core/models/enrollment.model';
import { EnrollCourseDto } from '../../core/interfaces/api/enrollment-service.interface';
import { EnrollmentModel, EnrollmentDocument } from '../database/schemas/enrollment.schema';
import { AppLoggerService } from '../logging/logger.service';

@Injectable()
export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectModel(EnrollmentModel.name) private enrollmentModel: Model<EnrollmentDocument>,
    private readonly logger: AppLoggerService
  ) {}

  private toEntity(document: EnrollmentDocument): Enrollment {
    return {
      id: document._id ? document._id.toString() : '',
      userId: document.userId,
      courseId: document.courseId,
      enrollmentDate: document.enrollmentDate,
      status: document.status as EnrollmentStatus,
      lastUpdated: document.lastUpdated,
    };
  }

  async findAll(): Promise<Enrollment[]> {
    this.logger.log('Finding all enrollments', 'EnrollmentRepository');
    const enrollments = await this.enrollmentModel.find().exec();
    return enrollments.map(enrollment => this.toEntity(enrollment));
  }

  async findById(id: string): Promise<Enrollment | null> {
    this.logger.log(`Finding enrollment by ID: ${id}`, 'EnrollmentRepository');
    const enrollment = await this.enrollmentModel.findById(id).exec();
    return enrollment ? this.toEntity(enrollment) : null;
  }

  async findByUserAndCourse(userId: string, courseId: number): Promise<Enrollment | null> {
    this.logger.log(`Finding enrollment for user ${userId} and course ${courseId}`, 'EnrollmentRepository');
    const enrollment = await this.enrollmentModel.findOne({ userId, courseId }).exec();
    return enrollment ? this.toEntity(enrollment) : null;
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    this.logger.log(`Finding enrollments for user: ${userId}`, 'EnrollmentRepository');
    const enrollments = await this.enrollmentModel.find({ 
      userId, 
      status: EnrollmentStatus.ACTIVE 
    }).exec();
    return enrollments.map(enrollment => this.toEntity(enrollment));
  }

  async findByCourse(courseId: number): Promise<Enrollment[]> {
    this.logger.log(`Finding enrollments for course: ${courseId}`, 'EnrollmentRepository');
    const enrollments = await this.enrollmentModel.find({ 
      courseId, 
      status: EnrollmentStatus.ACTIVE 
    }).exec();
    return enrollments.map(enrollment => this.toEntity(enrollment));
  }

  async create(enrollmentData: EnrollCourseDto): Promise<Enrollment> {
    this.logger.log(`Creating enrollment for user ${enrollmentData.userId} in course ${enrollmentData.courseId}`, 'EnrollmentRepository');
    
    const newEnrollment = new this.enrollmentModel({
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId,
      enrollmentDate: new Date(),
      status: EnrollmentStatus.ACTIVE,
      lastUpdated: new Date()
    });
    
    const savedEnrollment = await newEnrollment.save();
    return this.toEntity(savedEnrollment);
  }

  async update(id: string, enrollmentData: Partial<Enrollment>): Promise<Enrollment | null> {
    this.logger.log(`Updating enrollment with ID: ${id}`, 'EnrollmentRepository');
    
    const updatedEnrollment = await this.enrollmentModel
      .findByIdAndUpdate(id, enrollmentData, { new: true })
      .exec();
      
    return updatedEnrollment ? this.toEntity(updatedEnrollment) : null;
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting enrollment with ID: ${id}`, 'EnrollmentRepository');
    const result = await this.enrollmentModel.findByIdAndDelete(id).exec();
    return !!result;
  }
} 