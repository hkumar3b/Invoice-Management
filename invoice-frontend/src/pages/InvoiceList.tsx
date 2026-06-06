import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoicesApi, type Invoice, type InvoiceFilters } from '../api/invoices';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import InvoiceForm from '../components/InvoiceForm';
import './InvoiceList.css';

const STATUSES = ['', 'Sent', 'Unpaid', 'Overdue', 'Paid', 'Void', 'Draft'];

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    limit: 20,
    sortBy: 'dueDate',
    sortOrder: 'desc',
    status: '',
    customer: '',
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await invoicesApi.getAll(filters);
      setInvoices(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const handleFilter = (key: keyof InvoiceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCreate = async (data: any) => {
    setFormLoading(true);
    try {
      await invoicesApi.create(data);
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editInvoice) return;
    setFormLoading(true);
    try {
      await invoicesApi.update(editInvoice._id, data);
      setEditInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const sortIcon = (field: string) => {
    if (filters.sortBy !== field) return ' ↕';
    return filters.sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <h1 className="invoice-list__title">Invoices</h1>
        <div className="invoice-list__header-actions">
          <button
            className="btn btn--secondary"
            onClick={() => navigate('/summary')}
          >
            Summary
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setShowModal(true)}
          >
            + New Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="invoice-list__filters">
        <input
          className="filter-input"
          placeholder="Search customer..."
          value={filters.customer || ''}
          onChange={(e) => handleFilter('customer', e.target.value)}
        />
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => handleFilter('status', e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || 'All Status'}</option>
          ))}
        </select>
        <input
          className="filter-input"
          type="date"
          value={filters.issueDateFrom || ''}
          onChange={(e) => handleFilter('issueDateFrom', e.target.value)}
          placeholder="Issue from"
        />
        <input
          className="filter-input"
          type="date"
          value={filters.issueDateTo || ''}
          onChange={(e) => handleFilter('issueDateTo', e.target.value)}
          placeholder="Issue to"
        />
        <input
          className="filter-input"
          type="date"
          value={filters.dueDateFrom || ''}
          onChange={(e) => handleFilter('dueDateFrom', e.target.value)}
          placeholder="Due from"
        />
        <input
          className="filter-input"
          type="date"
          value={filters.dueDateTo || ''}
          onChange={(e) => handleFilter('dueDateTo', e.target.value)}
          placeholder="Due to"
        />
      </div>

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th
                  className="sortable"
                  onClick={() => handleSort('customer')}
                >
                  Customer
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort('amount')}
                >
                  Amount{sortIcon('amount')}
                </th>
                <th>Tax%</th>
                <th
                  className="sortable"
                  onClick={() => handleSort('total')}
                >
                  Total{sortIcon('total')}
                </th>
                <th>Status</th>
                <th
                  className="sortable"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date{sortIcon('dueDate')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td className="invoice-id">{inv.invoiceId}</td>
                  <td>
                    <span
                      className="customer-link"
                      onClick={() => navigate(`/customers/${inv.customer._id}`)}
                    >
                      {inv.customer.name}
                    </span>
                  </td>
                  <td>₹{inv.amount.toLocaleString()}</td>
                  <td>{inv.taxRate}%</td>
                  <td>₹{inv.total.toLocaleString()}</td>
                  <td><Badge status={inv.status} /></td>
                  <td>{new Date(inv.dueDate).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => setEditInvoice(inv)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={filters.page || 1}
        totalPages={totalPages}
        total={total}
        limit={filters.limit || 20}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />

      {/* Create Modal */}
      {showModal && (
        <Modal title="New Invoice" onClose={() => setShowModal(false)}>
          <InvoiceForm
            onSubmit={handleCreate}
            onCancel={() => setShowModal(false)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editInvoice && (
        <Modal title="Edit Invoice" onClose={() => setEditInvoice(null)}>
          <InvoiceForm
            initial={editInvoice}
            onSubmit={handleUpdate}
            onCancel={() => setEditInvoice(null)}
            loading={formLoading}
          />
        </Modal>
      )}
    </div>
  );
}