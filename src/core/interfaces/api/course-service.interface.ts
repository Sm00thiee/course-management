import { Course } from '../../models/course.model';

export interface CreateCourseDto {
  title: string;
  description: string;
  credits: number;
  instructor: string;
  isActive?: boolean;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  credits?: number;
  instructor?: string;
  isActive?: boolean;
}

export interface ICourseService {
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | null>;
  createCourse(courseData: CreateCourseDto): Promise<Course>;
  updateCourse(id: number, courseData: UpdateCourseDto): Promise<Course | null>;
  deleteCourse(id: number): Promise<boolean>;
} 