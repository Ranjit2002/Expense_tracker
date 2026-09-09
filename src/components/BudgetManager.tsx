import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getCategoryById } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { BudgetModal } from './BudgetModal';
import { Target, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';

export const BudgetManager: React.FC = () => {
  const { transactions, budget, currency, budgetSpent } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate current month's spending by category
  const categorySpending = useMemo(() => {
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();

    const spending: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type !== 'expense') return;
      const [y, m] = tx.date.split('-').map(Number);
      if (y === currYear && m === currMonth + 1) {
        spending[tx.category] = (spending[tx.category] || 0) + tx.amount;
      }
    });

    return spending;
  }, [transactions]);

  // Categories that have a budget limit configured (> 0)
  const budgetedCategories = useMemo(() => {
    return Object.entries(budget.categoryLimits)
      .filter(([_, limit]) => limit > 0)
      .map(([catId, limit]) => {
        const spent = categorySpending[catId] || 0;
        const percent = Math.min(200, Math.round((spent / limit) * 100));
        const cat = getCategoryById(catId);
        return {
          catId,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          limit,
          spent,
          percent,
        };
      })
      .sort((a, b) => b.percent - a.percent); // highest percent first
  }, [budget.categoryLimits, categorySpending]);

  const remainingMonthly = Math.max(0, budget.monthlyLimit - budgetSpent);

  return (
    <div className="rounded-3xl glass-panel p-6 shadow-glass-light dark:shadow-glass-dark">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Budgets & Spending Goals
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                This Month
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Remaining to spend:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-bold">
                {formatCurrency(remainingMonthly, currency)}
              </strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors"
        >
          <Settings2 className="w-4 h-4 text-indigo-500" />
          <span>Adjust Budget Limits</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {budgetedCategories.map((item) => {
          const isOver = item.percent >= 100;
          const isNear = item.percent >= 80 && item.percent < 100;

          return (
            <div
              key={item.catId}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${item.color} text-white shrink-0`}>
                    <CategoryIcon name={item.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.name}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isOver
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : isNear
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isOver ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {item.percent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? 'bg-rose-500'
                      : isNear
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, item.percent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>Spent: {formatCurrency(item.spent, currency)}</span>
                <span>Limit: {formatCurrency(item.limit, currency)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
