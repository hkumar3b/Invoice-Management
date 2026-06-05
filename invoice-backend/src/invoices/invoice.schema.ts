import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

export enum InvoiceStatus {
  SENT = 'Sent',
  UNPAID = 'Unpaid',
  OVERDUE = 'Overdue',
  PAID = 'Paid',
  VOID = 'Void',
  DRAFT = 'Draft',
}

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, unique: true, trim: true })
  invoiceId: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: [0, 3, 5, 18, 28] })
  taxRate: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, enum: InvoiceStatus })
  status: InvoiceStatus;

  @Prop({ required: true })
  issueDate: Date;

  @Prop({ required: true })
  dueDate: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);