import { apiClient } from './client';

export interface Customer {
  _id: string;
  name: string;
  company: string;
}

export interface CustomerProfile {
  customer: Customer;
  invoices: any[];
  summary: {
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    overdueAmount: number;
  };
}

export interface TopCustomer {
  _id: string;
  name: string;
  company: string;
  totalAmount: number;
  totalInvoices: number;
}

export const customersApi = {
  getAll: () => apiClient<Customer[]>('/customers'),
  getTopFive: () => apiClient<TopCustomer[]>('/customers/top-five'),
  getProfile: (id: string) => apiClient<CustomerProfile>(`/customers/${id}`),
};