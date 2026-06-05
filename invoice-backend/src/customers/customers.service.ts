import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { Invoice, InvoiceDocument } from '../invoices/invoice.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,

    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
  ) {}

  // GET /customers
  async findAll() {
    return this.customerModel.find().lean();
  }

  // GET /customers/top-five
  async getTopFive() {
    return this.invoiceModel.aggregate([
      {
        $group: {
          _id: '$customer',
          totalAmount: { $sum: '$total' },
          totalInvoices: { $count: {} },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      { $unwind: '$customerInfo' },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          totalInvoices: 1,
          name: '$customerInfo.name',
          company: '$customerInfo.company',
        },
      },
    ]);
  }

  // GET /customers/:id
  async getProfile(id: string) {
    const customer = await this.customerModel.findById(id).lean();

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const invoices = await this.invoiceModel
      .find({ customer: id })
      .lean();

    const summary = await this.invoiceModel.aggregate([
      { $match: { customer: customer._id } },
      {
        $group: {
          _id: null,
          totalInvoices: { $count: {} },
          totalAmount: { $sum: '$total' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Paid'] }, '$total', 0],
            },
          },
          unpaidAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Unpaid'] }, '$total', 0],
            },
          },
          overdueAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Overdue'] }, '$total', 0],
            },
          },
        },
      },
    ]);

    return {
      customer,
      invoices,
      summary: summary[0] || {
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        overdueAmount: 0,
      },
    };
  }
}