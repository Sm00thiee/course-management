import { Enrollment } from '../../models/enrollment.model';

export interface EnrollCourseDto {
  userId: string;
  courseId: number;
}

export interface IEnrollmentService {
  enrollCourse(enrollmentData: EnrollCourseDto): Promise<Enrollment>;
  dropCourse(userId: string, courseId: number): Promise<boolean>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  isUserEnrolled(userId: string, courseId: number): Promise<boolean>;
} 