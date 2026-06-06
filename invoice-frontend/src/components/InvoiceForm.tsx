import { useState, useEffect } from 'react';
import { customersApi, type Customer } from '../api/customers';
import './css/InvoiceForm.css';

interface InvoiceFormProps {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const TAX_RATES = [0, 3, 5, 18, 28];
const STATUSES = ['Draft', 'Sent', 'Paid', 'Unpaid', 'Overdue', 'Void'];

export default function InvoiceForm({ initial, onSubmit, onCancel, loading }: InvoiceFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({
    customer: initial?.customer?._id || '',
    amount: initial?.amount || '',
    taxRate: initial?.taxRate ?? 0,
    status: initial?.status || 'Draft',
    issueDate: initial?.issueDate?.slice(0, 10) || '',
    dueDate: initial?.dueDate?.slice(0, 10) || '',
  });

  const selectedCustomer = customers.find((c) => c._id === form.customer);
  const tax = form.amount ? (Number(form.amount) * Number(form.taxRate)) / 100 : 0;
  const total = form.amount ? Number(form.amount) + tax : 0;

  useEffect(() => {
    customersApi.getAll().then(setCustomers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      amount: Number(form.amount),
      taxRate: Number(form.taxRate),
    });
  };

  return (
    <div className="invoice-form">
      <div className="invoice-form__field">
        <label>Customer</label>
        <select name="customer" value={form.customer} onChange={handleChange}>
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedCustomer && (
        <div className="invoice-form__field">
          <label>Company (auto-filled)</label>
          <input type="text" value={selectedCustomer.company} disabled />
        </div>
      )}

      <div className="invoice-form__row">
        <div className="invoice-form__field">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min={0}
          />
        </div>

        <div className="invoice-form__field">
          <label>Tax Rate</label>
          <select name="taxRate" value={form.taxRate} onChange={handleChange}>
            {TAX_RATES.map((r) => (
              <option key={r} value={r}>{r}%</option>
            ))}
          </select>
        </div>
      </div>

      <div className="invoice-form__row">
        <div className="invoice-form__field">
          <label>Issue Date</label>
          <input
            type="date"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
          />
        </div>

        <div className="invoice-form__field">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="invoice-form__field">
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="invoice-form__summary">
        Tax: <strong>₹{tax.toFixed(2)}</strong> · Total: <strong>₹{total.toFixed(2)}</strong>
      </div>

      <div className="invoice-form__actions">
        <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Invoice'}
        </button>
      </div>
    </div>
  );
}