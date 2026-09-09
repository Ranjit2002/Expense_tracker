import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import type { TransactionType, PaymentMethod } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { X, Sparkles, Calendar, FileText, Check } from 'lucide-react';

export const TransactionModal: React.FC = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    addTransaction,
    updateTransaction,
    editingTransaction,
    currency,
  } = useExpense();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [notes, setNotes] = useState('');

  // Sync state if editing
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      const rate = currency.rate || 1;
      const converted = Math.round(editingTransaction.amount * rate * 100) / 100;
      setAmount(converted.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes || '');
    } else {
      // Default to first category of current type
      const firstCat = CATEGORIES.find((c) => c.type === 'expense');
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory(firstCat ? firstCat.id : 'food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('credit_card');
      setNotes('');
    }
  }, [editingTransaction, isAddModalOpen, currency.rate]);

  // When type changes, ensure valid category selection
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const validCategory = CATEGORIES.find((c) => c.type === newType);
    if (validCategory) {
      setCategory(validCategory.id);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAddModal();
    };
    if (isAddModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, closeAddModal]);

  if (!isAddModalOpen) return null;

  const filteredCategories = CATEGORIES.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    const rate = currency.rate || 1;
    const baseAmount = numAmount / rate;

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        title: title.trim(),
        amount: baseAmount,
        type,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: baseAmount,
        type,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    }

    closeAddModal();
  };

  const isIncome = type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl glass-dropdown overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl text-white shadow-md ${
                isIncome
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/30'
                  : 'bg-gradient-to-tr from-rose-500 to-orange-500 shadow-rose-500/30'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isIncome ? 'Add money to your balance' : 'Track an expenditure'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAddModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          
          {/* Income vs Expense Segmented Control */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                !isIncome
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                isIncome
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-slate-400">
                {currency.symbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-2xl font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery Store, Coffee, Freelance Client"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
              {filteredCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg bg-gradient-to-tr ${cat.color} text-white shrink-0`}
                    >
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Add tags or additional context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-lg active:scale-95 transition-all ${
                isIncome
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-indigo-500/25'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingTransaction ? 'Update Record' : 'Save Transaction'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
