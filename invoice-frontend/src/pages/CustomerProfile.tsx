import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customersApi, type CustomerProfile as CustomerProfileType } from '../api/customers';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import './CustomerProfile.css';

export default function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CustomerProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    customersApi
      .getProfile(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!data) return <div className="profile-error">Customer not found.</div>;

  const { customer, invoices, summary } = data;

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="profile">
      {/* Breadcrumb */}
      <div className="profile__breadcrumb">
        <span
          className="profile__breadcrumb-link"
          onClick={() => navigate('/')}
        >
          Invoices
        </span>
        <span className="profile__breadcrumb-sep">›</span>
        <span>Customer</span>
      </div>

      {/* Customer Header */}
      <div className="profile__header">
        <div className="profile__avatar">{initials}</div>
        <div>
          <h1 className="profile__name">{customer.name}</h1>
          <p className="profile__company">{customer.company}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="profile__stats">
        <StatCard
          label="Total Billed"
          value={`₹${summary.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="Total Tax"
          value={`₹${(summary.totalAmount - (summary.paidAmount + summary.unpaidAmount + summary.overdueAmount)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="Outstanding"
          value={`₹${(summary.unpaidAmount + summary.overdueAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="# Invoices"
          value={summary.totalInvoices}
        />
      </div>

      {/* Status Breakdown */}
      <div className="profile__breakdown">
        <div className="breakdown-item breakdown-item--paid">
          <span>Paid</span>
          <strong>₹{summary.paidAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div className="breakdown-item breakdown-item--unpaid">
          <span>Unpaid</span>
          <strong>₹{summary.unpaidAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div className="breakdown-item breakdown-item--overdue">
          <span>Overdue</span>
          <strong>₹{summary.overdueAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
        </div>
      </div>

      {/* Invoice History */}
      <div className="profile__history">
        <h2 className="profile__section-title">Invoice History</h2>
        <div className="profile__table-wrapper">
          <table className="profile__table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Total</th>
                <th>Status</th>
                <th>Issued</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv._id}>
                  <td className="invoice-id">{inv.invoiceId}</td>
                  <td>₹{inv.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td><Badge status={inv.status} /></td>
                  <td>{new Date(inv.issueDate).toLocaleDateString('en-IN')}</td>
                  <td>{new Date(inv.dueDate).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}