import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { Customer, CustomerDocument } from '../customers/customer.schema';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,

    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
  ) {}

  // GET /invoices
  async findAll(filters: FilterInvoiceDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'dueDate',
      sortOrder = 'desc',
      status,
      customer,
      issueDateFrom,
      issueDateTo,
      dueDateFrom,
      dueDateTo,
    } = filters;

    const query: any = {};

    // Status filter
    if (status) query.status = status;

    // Customer filter (by name — lookup first)
    if (customer) {
      const customerDoc = await this.customerModel
        .findOne({ name: { $regex: customer, $options: 'i' } })
        .lean();
      if (customerDoc) {
        query.customer = customerDoc._id;
      } else {
        // No matching customer — return empty
        return { data: [], total: 0, page, limit, totalPages: 0 };
      }
    }

    // Issue date range filter
    if (issueDateFrom || issueDateTo) {
      query.issueDate = {};
      if (issueDateFrom) query.issueDate.$gte = new Date(issueDateFrom);
      if (issueDateTo) query.issueDate.$lte = new Date(issueDateTo);
    }

    // Due date range filter
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.invoiceModel
        .find(query)
        .populate('customer', 'name company')
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.invoiceModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // GET /invoices/:id
  async findOne(id: string) {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('customer', 'name company')
      .lean();

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    return invoice;
  }

  // POST /invoices
  async create(dto: CreateInvoiceDto) {
    const customer = await this.customerModel
      .findById(dto.customer)
      .lean();

    if (!customer) {
      throw new NotFoundException(`Customer with id ${dto.customer} not found`);
    }

    const tax = (dto.amount * dto.taxRate) / 100;
    const total = dto.amount + tax;

    const invoice = await this.invoiceModel.create({
      ...dto,
      customer: new Types.ObjectId(dto.customer),
      tax,
      total,
      issueDate: new Date(dto.issueDate),
      dueDate: new Date(dto.dueDate),
    });

    return invoice;
  }

  // PATCH /invoices/:id
  async update(id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.invoiceModel.findById(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    // Recalculate tax and total if amount or taxRate changed
    const amount = dto.amount ?? invoice.amount;
    const taxRate = dto.taxRate ?? invoice.taxRate;
    const tax = (amount * taxRate) / 100;
    const total = amount + tax;

    const updated = await this.invoiceModel
      .findByIdAndUpdate(
        id,
        { ...dto, tax, total },
        { new: true }
      )
      .populate('customer', 'name company')
      .lean();

    return updated;
  }

  // DELETE /invoices/:id
  async remove(id: string) {
    const invoice = await this.invoiceModel.findById(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    await this.invoiceModel.findByIdAndDelete(id);
    return { message: `Invoice ${id} deleted successfully` };
  }
}