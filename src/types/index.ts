export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'cash' 
  | 'bank_transfer' 
  | 'digital_wallet';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string; // Lucide icon name
  color: string; // tailwind gradient or color
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textColor: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: number;
}

export interface BudgetSettings {
  monthlyLimit: number;
  categoryLimits: Record<string, number>;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // vs USD base
}

export interface FilterOptions {
  search: string;
  type: 'all' | 'expense' | 'income';
  category: string;
  dateRange: 'all' | 'this_month' | 'this_week' | 'custom';
  startDate?: string;
  endDate?: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}
