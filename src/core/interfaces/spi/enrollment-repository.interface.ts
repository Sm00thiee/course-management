import { Enrollment } from '../../models/enrollment.model';
import { EnrollCourseDto } from '../api/enrollment-service.interface';

export interface IEnrollmentRepository {
  findAll(): Promise<Enrollment[]>;
  findById(id: string): Promise<Enrollment | null>;
  findByUserAndCourse(userId: string, courseId: number): Promise<Enrollment | null>;
  findByUser(userId: string): Promise<Enrollment[]>;
  findByCourse(courseId: number): Promise<Enrollment[]>;
  create(enrollmentData: EnrollCourseDto): Promise<Enrollment>;
  update(id: string, enrollmentData: Partial<Enrollment>): Promise<Enrollment | null>;
  delete(id: string): Promise<boolean>;
} 