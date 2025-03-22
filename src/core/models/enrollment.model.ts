export enum EnrollmentStatus {
  ACTIVE = 'active',
  DROPPED = 'dropped'
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: number;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  lastUpdated: Date;
} 