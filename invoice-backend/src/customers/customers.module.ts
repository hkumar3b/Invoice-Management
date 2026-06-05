import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, collection: 'customers', schema: CustomerSchema }]),
  ],
  exports: [MongooseModule],
})
export class CustomersModule {}