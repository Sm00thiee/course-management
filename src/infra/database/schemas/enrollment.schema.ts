import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnrollmentStatus } from '../../../core/models/enrollment.model';
import * as mongoose from 'mongoose';

export type EnrollmentDocument = EnrollmentModel & Document;

@Schema({ timestamps: true })
export class EnrollmentModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: number;

  @Prop({ default: Date.now })
  enrollmentDate: Date;

  @Prop({ required: true, enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  status: string;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(EnrollmentModel); 