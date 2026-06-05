import { IsString, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { InvoiceStatus } from '../invoice.schema';

export class CreateInvoiceDto {
  @IsString()
  invoiceId: string;

  @IsString()
  customer: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @IsEnum([0, 3, 5, 18, 28])
  taxRate: number;

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  dueDate: string;
}
