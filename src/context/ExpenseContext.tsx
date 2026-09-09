import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  Transaction,
  BudgetSettings,
  Currency,
  FilterOptions,
  ToastMessage,
} from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGET } from '../data/initialData';
import { CURRENCIES } from '../data/categories';
import confetti from 'canvas-confetti';

interface ExpenseContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  budget: BudgetSettings;
  currency: Currency;
  filter: FilterOptions;
  isAddModalOpen: boolean;
  editingTransaction: Transaction | null;
  toasts: ToastMessage[];
  
  // Analytics
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  budgetSpent: number;
  budgetPercentage: number;
  
  // Actions
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (newBudget: Partial<BudgetSettings>) => void;
  setCurrency: (curr: Currency) => void;
  setFilter: (newFilter: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  openAddModal: (tx?: Transaction) => void;
  closeAddModal: () => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  triggerCelebration: () => void;
}

const defaultFilter: FilterOptions = {
  search: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
  sortBy: 'date_desc',
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('apex_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // 2. Budget state
  const [budget, setBudget] = useState<BudgetSettings>(() => {
    try {
      const saved = localStorage.getItem('apex_budget');
      return saved ? JSON.parse(saved) : INITIAL_BUDGET;
    } catch {
      return INITIAL_BUDGET;
    }
  });

  // 3. Currency state (default: INR)
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const hasInitDefault = localStorage.getItem('apex_default_currency_inr_v1');
      if (!hasInitDefault) {
        localStorage.setItem('apex_default_currency_inr_v1', 'true');
        localStorage.setItem('apex_currency_code', 'INR');
        return CURRENCIES.find((c) => c.code === 'INR') || CURRENCIES[0];
      }
      const savedCode = localStorage.getItem('apex_currency_code');
      return (
        CURRENCIES.find((c) => c.code === savedCode) ||
        CURRENCIES.find((c) => c.code === 'INR') ||
        CURRENCIES[0]
      );
    } catch {
      return CURRENCIES.find((c) => c.code === 'INR') || CURRENCIES[0];
    }
  });

  // 4. Modal and Filter state
  const [filter, setFilterState] = useState<FilterOptions>(defaultFilter);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('apex_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('apex_budget', JSON.stringify(budget));
  }, [budget]);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('apex_currency_code', curr.code);
    addToast({
      type: 'info',
      title: `Currency switched to ${curr.name} (${curr.symbol})`,
    });
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f43f5e', '#38bdf8', '#fbbf24'],
    });
  };

  // Add Transaction
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: 'tx-' + Date.now(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    addToast({
      type: 'success',
      title: `${data.type === 'income' ? 'Income' : 'Expense'} recorded`,
      description: `"${data.title}" was successfully added.`,
    });

    if (data.type === 'income' && data.amount >= 1000) {
      triggerCelebration();
    }
  };

  // Update Transaction
  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );
    addToast({
      type: 'success',
      title: 'Transaction updated',
      description: 'Changes have been saved.',
    });
  };

  // Delete Transaction
  const deleteTransaction = (id: string) => {
    const target = transactions.find((tx) => tx.id === id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    addToast({
      type: 'info',
      title: 'Transaction removed',
      description: target ? `"${target.title}" was deleted.` : undefined,
    });
  };

  // Update Budget
  const updateBudget = (newBudget: Partial<BudgetSettings>) => {
    setBudget((prev) => ({
      ...prev,
      ...newBudget,
      categoryLimits: {
        ...prev.categoryLimits,
        ...(newBudget.categoryLimits || {}),
      },
    }));
    addToast({
      type: 'success',
      title: 'Budget updated',
      description: 'Your monthly financial limits have been adjusted.',
    });
  };

  // Filter modifiers
  const setFilter = (newFilter: Partial<FilterOptions>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  };

  const resetFilters = () => {
    setFilterState(defaultFilter);
  };

  // Modal Handlers
  const openAddModal = (tx?: Transaction) => {
    setEditingTransaction(tx || null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  // Reset to initial demo data
  const resetToDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudget(INITIAL_BUDGET);
    const inr = CURRENCIES.find((c) => c.code === 'INR') || CURRENCIES[0];
    setCurrencyState(inr);
    localStorage.setItem('apex_currency_code', inr.code);
    addToast({
      type: 'info',
      title: 'Demo data restored',
      description: 'Restored sample records with default INR (₹) currency.',
    });
  };

  // Clear all data
  const clearAllData = () => {
    setTransactions([]);
    addToast({
      type: 'warning',
      title: 'All records cleared',
      description: 'Starting with a clean slate.',
    });
  };

  // Analytics calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpenses;

  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    const rate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    return Math.max(-100, Math.min(100, Math.round(rate)));
  }, [totalIncome, totalExpenses]);

  // Current Month's spending against budget
  const budgetSpent = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions
      .filter((tx) => {
        if (tx.type !== 'expense') return false;
        const [y, m] = tx.date.split('-').map(Number);
        return y === currentYear && m === currentMonth + 1;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const budgetPercentage = useMemo(() => {
    if (budget.monthlyLimit === 0) return 0;
    return Math.min(200, Math.round((budgetSpent / budget.monthlyLimit) * 100));
  }, [budgetSpent, budget.monthlyLimit]);

  // Filtered transactions for display
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search filter
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase();
          const matchTitle = tx.title.toLowerCase().includes(q);
          const matchNotes = tx.notes ? tx.notes.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchNotes) return false;
        }

        // Type filter
        if (filter.type !== 'all' && tx.type !== filter.type) {
          return false;
        }

        // Category filter
        if (filter.category !== 'all' && tx.category !== filter.category) {
          return false;
        }

        // Date Range
        if (filter.dateRange !== 'all') {
          const now = new Date();
          const txDate = new Date(tx.date + 'T00:00:00');

          if (filter.dateRange === 'this_week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            if (txDate < oneWeekAgo || txDate > now) return false;
          } else if (filter.dateRange === 'this_month') {
            if (
              txDate.getFullYear() !== now.getFullYear() ||
              txDate.getMonth() !== now.getMonth()
            ) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'date_desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filter.sortBy === 'date_asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filter.sortBy === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (filter.sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, filter]);

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        filteredTransactions,
        budget,
        currency,
        filter,
        isAddModalOpen,
        editingTransaction,
        toasts,
        totalIncome,
        totalExpenses,
        netBalance,
        savingsRate,
        budgetSpent,
        budgetPercentage,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        setCurrency,
        setFilter,
        resetFilters,
        openAddModal,
        closeAddModal,
        resetToDemoData,
        clearAllData,
        addToast,
        removeToast,
        triggerCelebration,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
