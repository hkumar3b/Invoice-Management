import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { CustomerSchema } from './customers/customer.schema';
import { InvoiceSchema } from './invoices/invoice.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/invoice-db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Register models
  const CustomerModel = mongoose.model('Customer', CustomerSchema);
  const InvoiceModel = mongoose.model('Invoice', InvoiceSchema);

  // Clear existing data
  await CustomerModel.deleteMany({});
  await InvoiceModel.deleteMany({});
  console.log('Cleared existing data');

  // Read seed file
  const filePath = path.join(__dirname, '../seed-data.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const invoices = JSON.parse(rawData);

  //Extract unique customers and insert them
  const customerMap = new Map<string, mongoose.Types.ObjectId>();

  const uniqueCustomers: { name: string; company: string }[] = [
    ...new Map<string, string>(
      invoices.map((inv: any) => [inv.customer as string, inv.company as string])
    ).entries(),
  ].map(([name, company]) => ({ name, company }));

  for (const cust of uniqueCustomers) {
    const created = await CustomerModel.create(cust);
    customerMap.set(cust.name, created._id as mongoose.Types.ObjectId);
  }
  console.log(`Inserted ${uniqueCustomers.length} customers`);

  //Insert invoices with customer ObjectId reference
  const invoiceDocs = invoices.map((inv: any) => ({
    invoiceId: inv.invoiceId,
    customer: customerMap.get(inv.customer),
    amount: inv.amount,
    taxRate: inv.taxRate,
    tax: inv.tax,
    total: inv.total,
    status: inv.status,
    issueDate: new Date(inv.issueDate),
    dueDate: new Date(inv.dueDate),
  }));

  await InvoiceModel.insertMany(invoiceDocs);
  console.log(`Inserted ${invoiceDocs.length} invoices`);

  await mongoose.disconnect();
  console.log('Done. Disconnected.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});