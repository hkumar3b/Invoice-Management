import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, collection: 'invoices', schema: InvoiceSchema }]),
  ],
  exports: [MongooseModule],
})
export class InvoicesModule {}