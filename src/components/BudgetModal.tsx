import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { X, Target, Save } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { budget, updateBudget, currency } = useExpense();
  const rate = currency.rate || 1;
  
  const [monthlyLimit, setMonthlyLimit] = useState<number>(() => Math.round(budget.monthlyLimit * rate));
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>(() => {
    const res: Record<string, number> = {};
    for (const [k, v] of Object.entries(budget.categoryLimits)) {
      res[k] = Math.round(v * rate);
    }
    return res;
  });

  useEffect(() => {
    if (isOpen) {
      setMonthlyLimit(Math.round(budget.monthlyLimit * rate));
      const res: Record<string, number> = {};
      for (const [k, v] of Object.entries(budget.categoryLimits)) {
        res[k] = Math.round(v * rate);
      }
      setCategoryLimits(res);
    }
  }, [isOpen, budget, rate]);

  if (!isOpen) return null;

  const expenseCategories = CATEGORIES.filter((cat) => cat.type === 'expense');

  const handleCategoryChange = (catId: string, val: number) => {
    setCategoryLimits((prev) => ({
      ...prev,
      [catId]: Math.max(0, val),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const baseCategoryLimits: Record<string, number> = {};
    for (const [k, v] of Object.entries(categoryLimits)) {
      baseCategoryLimits[k] = Math.round((v / rate) * 100) / 100;
    }
    updateBudget({
      monthlyLimit: Math.round((Number(monthlyLimit) / rate) * 100) / 100,
      categoryLimits: baseCategoryLimits,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl glass-dropdown overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Monthly Budget Planner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set total and category-specific spending targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Overall Monthly Limit */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Overall Monthly Limit ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="10"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Category Budgets Grid */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 mb-3">
              Category Allocations
            </label>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${cat.color} text-white`}>
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {cat.name}
                    </span>
                  </div>

                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={categoryLimits[cat.id] || 0}
                      onChange={(e) => handleCategoryChange(cat.id, Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Budget</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
