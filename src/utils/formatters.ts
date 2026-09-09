import type { Currency, Transaction } from '../types';
import { CATEGORIES } from '../data/categories';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const convertedAmount = amount * (currency.rate || 1);
  return `${currency.symbol}${convertedAmount.toLocaleString(
    currency.code === 'INR' ? 'en-IN' : undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

export const formatDate = (dateStr: string): string => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

export const getCategoryById = (categoryId: string) => {
  return CATEGORIES.find((cat) => cat.id === categoryId) || {
    id: categoryId,
    name: 'General',
    type: 'expense',
    icon: 'Layers',
    color: 'from-gray-500 to-slate-500',
    bgLight: 'bg-gray-50',
    bgDark: 'dark:bg-gray-900',
    borderLight: 'border-gray-200',
    borderDark: 'dark:border-gray-750',
    textColor: 'text-gray-500',
  };
};

export const exportToCSV = (transactions: Transaction[], currency: Currency) => {
  const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Payment Method', 'Notes'];
  
  const rows = transactions.map((tx) => [
    `"${tx.id}"`,
    `"${tx.date}"`,
    `"${tx.type.toUpperCase()}"`,
    `"${getCategoryById(tx.category).name}"`,
    `"${tx.title.replace(/"/g, '""')}"`,
    `${(tx.amount * currency.rate).toFixed(2)}`,
    `"${tx.paymentMethod}"`,
    `"${(tx.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `expense_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
