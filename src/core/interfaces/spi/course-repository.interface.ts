import { Course } from '../../models/course.model';
import { CreateCourseDto, UpdateCourseDto } from '../api/course-service.interface';

export interface ICourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  create(courseData: CreateCourseDto): Promise<Course>;
  update(id: number, courseData: UpdateCourseDto): Promise<Course | null>;
  delete(id: number): Promise<boolean>;
} 