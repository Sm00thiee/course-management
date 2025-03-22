export interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  instructor: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 