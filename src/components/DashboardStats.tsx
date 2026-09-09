import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const {
    currency,
    netBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    budgetSpent,
    budgetPercentage,
    budget,
  } = useExpense();

  const isBalancePositive = netBalance >= 0;
  const isBudgetWarning = budgetPercentage > 85;
  const isBudgetExceeded = budgetPercentage >= 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* 1. Net Balance Card */}
      <div className="relative group overflow-hidden rounded-3xl glass-panel p-6 hover:-translate-y-1 transition-all duration-300 shadow-glass-light dark:shadow-glass-dark">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all duration-500" />
        
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Total Balance
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(netBalance, currency)}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isBalancePositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            {isBalancePositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {isBalancePositive ? 'Surplus' : 'Deficit'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Overall net balance
          </span>
        </div>
      </div>

      {/* 2. Total Income Card */}
      <div className="relative group overflow-hidden rounded-3xl glass-panel p-6 hover:-translate-y-1 transition-all duration-300 shadow-glass-light dark:shadow-glass-dark">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition-all duration-500" />

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalIncome, currency)}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Inflow
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Accumulated earnings
          </span>
        </div>
      </div>

      {/* 3. Total Expenses Card */}
      <div className="relative group overflow-hidden rounded-3xl glass-panel p-6 hover:-translate-y-1 transition-all duration-300 shadow-glass-light dark:shadow-glass-dark">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl group-hover:bg-rose-500/25 transition-all duration-500" />

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-rose-600 dark:text-rose-400">
            -{formatCurrency(totalExpenses, currency)}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Outflow
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active expenditures
          </span>
        </div>
      </div>

      {/* 4. Savings Rate & Monthly Budget Gauge */}
      <div className="relative group overflow-hidden rounded-3xl glass-panel p-6 hover:-translate-y-1 transition-all duration-300 shadow-glass-light dark:shadow-glass-dark">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all duration-500" />

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Monthly Budget Meter
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {budgetPercentage}%
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {formatCurrency(budgetSpent, currency)} / {formatCurrency(budget.monthlyLimit, currency)}
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-3 w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isBudgetExceeded
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : isBudgetWarning
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
            }`}
            style={{ width: `${Math.min(100, budgetPercentage)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Savings: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{savingsRate}%</strong>
          </span>
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              isBudgetExceeded
                ? 'text-rose-500'
                : isBudgetWarning
                ? 'text-amber-500'
                : 'text-emerald-500'
            }`}
          >
            {isBudgetExceeded ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> Over Limit
              </>
            ) : isBudgetWarning ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> High Usage
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" /> On Target
              </>
            )}
          </span>
        </div>
      </div>

    </div>
  );
};
