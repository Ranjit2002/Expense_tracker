import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDate, getCategoryById } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  FileQuestion,
  X,
  CreditCard,
  Plus,
} from 'lucide-react';

export const TransactionList: React.FC = () => {
  const {
    filteredTransactions,
    currency,
    filter,
    setFilter,
    resetFilters,
    deleteTransaction,
    openAddModal,
  } = useExpense();

  const isFiltered =
    filter.search !== '' ||
    filter.type !== 'all' ||
    filter.category !== 'all' ||
    filter.dateRange !== 'all';

  const getPaymentMethodName = (id: string) => {
    return PAYMENT_METHODS.find((p) => p.id === id)?.name || id;
  };

  return (
    <div className="rounded-3xl glass-panel p-6 shadow-glass-light dark:shadow-glass-dark">
      
      {/* Header with Title and Quick Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Recent Transactions
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              {filteredTransactions.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, sort, and manage all your inflows and outflows
          </p>
        </div>

        {/* Type Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 self-start lg:self-auto">
          <button
            onClick={() => setFilter({ type: 'all' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter.type === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter({ type: 'expense' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter.type === 'expense'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setFilter({ type: 'income' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter.type === 'income'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or note..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {filter.search && (
            <button
              onClick={() => setFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filter.category}
            onChange={(e) => setFilter({ category: e.target.value })}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filter.dateRange}
            onChange={(e) => setFilter({ dateRange: e.target.value as any })}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="this_month">This Month</option>
            <option value="this_week">Past 7 Days</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value as any })}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="amount_desc">Amount: Highest First</option>
            <option value="amount_asc">Amount: Lowest First</option>
          </select>
        </div>

      </div>

      {/* Active Filter Bar & Reset */}
      {isFiltered && (
        <div className="flex items-center justify-between p-2.5 mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-400">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Active filters are restricting the transaction list.</span>
          </div>
          <button
            onClick={resetFilters}
            className="font-bold underline hover:opacity-80 transition-opacity"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Transaction Records List */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h5 className="text-base font-bold text-slate-900 dark:text-white">
            No transactions found
          </h5>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
            {isFiltered
              ? 'Try changing your search query or reset the filters to see more results.'
              : 'You have not added any transactions yet. Record your first expense or income.'}
          </p>
          {isFiltered ? (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white hover:opacity-80 transition-opacity"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Record First Transaction</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => {
            const cat = getCategoryById(tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700/80 hover:shadow-md transition-all duration-200"
              >
                {/* Left Side: Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shrink-0 shadow-sm`}
                  >
                    <CategoryIcon name={cat.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.title}
                      </h5>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {cat.name}
                      </span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        {getPaymentMethodName(tx.paymentMethod)}
                      </span>
                    </div>

                    {tx.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-md mt-1 italic">
                        "{tx.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
                  <span
                    className={`text-base font-extrabold font-display ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, currency)}
                  </span>

                  {/* Actions (Edit & Delete) */}
                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openAddModal(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      title="Edit Transaction"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
