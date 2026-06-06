import { apiClient } from './client';

export const invoicesApi = {
  getAll: (filters: InvoiceFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    return apiClient<InvoiceListResponse>(`/invoices?${params.toString()}`);
  },

  getOne: (id: string) => apiClient<Invoice>(`/invoices/${id}`),

  create: (data: Partial<Invoice>) =>
    apiClient<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Invoice>) =>
    apiClient<Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiClient<{ message: string }>(`/invoices/${id}`, {
      method: 'DELETE',
    }),
};

export interface Invoice {
  _id: string;
  invoiceId: string;
  customer: { _id: string; name: string; company: string };
  amount: number;
  taxRate: number;
  tax: number;
  total: number;
  status: string;
  issueDate: string;
  dueDate: string;
}

export interface InvoiceListResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  customer?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
