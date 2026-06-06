import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoicesApi } from '../api/invoices';
import { customersApi, type TopCustomer } from '../api/customers';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import './Summary.css';

export default function Summary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [stats, setStats] = useState({
    totalBilled: 0,
    totalTax: 0,
    totalInvoices: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [invoicesRes, customersRes, topFiveRes] = await Promise.all([
          invoicesApi.getAll({ limit: 1 }),
          customersApi.getAll(),
          customersApi.getTopFive(),
        ]);

        // Get all invoices to compute totals
        const allInvoices = await invoicesApi.getAll({
          limit: invoicesRes.total,
          page: 1,
        });

        const totalBilled = allInvoices.data.reduce((sum, inv) => sum + inv.total, 0);
        const totalTax = allInvoices.data.reduce((sum, inv) => sum + inv.tax, 0);

        setStats({
          totalBilled,
          totalTax,
          totalInvoices: invoicesRes.total,
          totalCustomers: customersRes.length,
        });

        setTopCustomers(topFiveRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxAmount = topCustomers.length > 0
    ? Math.max(...topCustomers.map((c) => c.totalAmount))
    : 1;

  if (loading) return <Spinner />;

  return (
    <div className="summary">
      <div className="summary__header">
        <h1 className="summary__title">Summary</h1>
        <button
          className="btn btn--secondary"
          onClick={() => navigate('/')}
        >
          ← Back to Invoices
        </button>
      </div>

      {/* Stat Cards */}
      <div className="summary__stats">
        <StatCard
          label="Total Billed"
          value={`₹${stats.totalBilled.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="Total Tax"
          value={`₹${stats.totalTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="# Invoices"
          value={stats.totalInvoices.toLocaleString()}
        />
        <StatCard
          label="# Customers"
          value={stats.totalCustomers}
        />
      </div>

      {/* Top Customers */}
      <div className="summary__top-customers">
        <h2 className="summary__section-title">Top Customers by Value</h2>
        <div className="top-customers">
          {topCustomers.map((customer) => (
            <div
              key={customer._id}
              className="top-customer-row"
              onClick={() => navigate(`/customers/${customer._id}`)}
            >
              <div className="top-customer-row__name">
                {customer.name}
              </div>
              <div className="top-customer-row__bar-wrapper">
                <div
                  className="top-customer-row__bar"
                  style={{
                    width: `${(customer.totalAmount / maxAmount) * 100}%`,
                  }}
                />
              </div>
              <div className="top-customer-row__amount">
                ₹{customer.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}