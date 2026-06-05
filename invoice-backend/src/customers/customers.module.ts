import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.schema';
import { Invoice, InvoiceSchema } from '../invoices/invoice.schema';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, collection: 'customers', schema: CustomerSchema },
      { name: Invoice.name, collection: 'invoices', schema: InvoiceSchema },
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}