import { IsOptional, IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { InvoiceStatus } from '../invoice.schema';

export class FilterInvoiceDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  // Sorting
  @IsOptional()
  @IsString()
  sortBy?: 'amount' | 'dueDate' = 'dueDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  // Filters
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsDateString()
  issueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  issueDateTo?: string;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;
}