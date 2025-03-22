export enum UserRole {
  ADMIN = 'admin',
  REGULAR = 'regular'
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
} 