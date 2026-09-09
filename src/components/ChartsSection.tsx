import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getCategoryById } from '../utils/formatters';
import { PieChart as PieIcon, BarChart3, TrendingUp, Info } from 'lucide-react';

export const ChartsSection: React.FC = () => {
  const { transactions, currency } = useExpense();
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'all' | 'this_month'>('all');

  // Filter transactions for charts based on timeframe
  const filteredForChart = useMemo(() => {
    if (chartTimeframe === 'all') return transactions;
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();

    return transactions.filter((tx) => {
      const [y, m] = tx.date.split('-').map(Number);
      return y === currYear && m === currMonth + 1;
    });
  }, [transactions, chartTimeframe]);

  // Group expenses by category for Donut Chart
  const categoryData = useMemo(() => {
    const expenseTx = filteredForChart.filter((tx) => tx.type === 'expense');
    const totalExp = expenseTx.reduce((sum, tx) => sum + tx.amount, 0);

    const map = new Map<string, number>();
    expenseTx.forEach((tx) => {
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
    });

    const entries = Array.from(map.entries()).map(([catId, amount]) => {
      const cat = getCategoryById(catId);
      const percentage = totalExp > 0 ? (amount / totalExp) * 100 : 0;
      return {
        id: catId,
        name: cat.name,
        icon: cat.icon,
        amount,
        percentage,
        color: cat.color,
      };
    });

    // Sort descending by amount
    entries.sort((a, b) => b.amount - a.amount);
    return { items: entries, total: totalExp };
  }, [filteredForChart]);

  // Group last 6 months for Cash Flow Bar Chart
  const monthlyCashflow = useMemo(() => {
    const months: { label: string; income: number; expense: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthLabel = d.toLocaleString(undefined, { month: 'short' });

      let income = 0;
      let expense = 0;

      transactions.forEach((tx) => {
        const [y, m] = tx.date.split('-').map(Number);
        if (y === year && m === month + 1) {
          if (tx.type === 'income') income += tx.amount;
          if (tx.type === 'expense') expense += tx.amount;
        }
      });

      months.push({ label: monthLabel, income, expense });
    }

    return months;
  }, [transactions]);

  // Calculate SVG Pie/Donut slice paths
  const donutSlices = useMemo(() => {
    const total = categoryData.total;
    if (total === 0) return [];

    let accumulatedAngle = 0;
    const radius = 70;
    const strokeWidth = 26;
    const center = 100;
    const circumference = 2 * Math.PI * radius;

    // Standard vibrant SVG colors matching categories
    const sliceColors = [
      '#f97316', // orange
      '#f43f5e', // rose
      '#6366f1', // indigo
      '#06b6d4', // cyan
      '#a855f7', // purple
      '#10b981', // emerald
      '#eab308', // amber
      '#ec4899', // pink
      '#64748b', // slate
    ];

    return categoryData.items.map((item, index) => {
      const strokeDashoffset = -circumference * (accumulatedAngle / 360);
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      accumulatedAngle += (item.percentage / 100) * 360;

      return {
        ...item,
        colorHex: sliceColors[index % sliceColors.length],
        strokeDasharray,
        strokeDashoffset,
        radius,
        strokeWidth,
        center,
      };
    });
  }, [categoryData]);

  // Max value for bar chart height scaling
  const maxBarValue = useMemo(() => {
    const maxVal = Math.max(
      ...monthlyCashflow.map((m) => Math.max(m.income, m.expense)),
      1000
    );
    return maxVal * 1.15; // with top headroom
  }, [monthlyCashflow]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Category Spending Donut Chart */}
      <div className="lg:col-span-5 rounded-3xl glass-panel p-6 shadow-glass-light dark:shadow-glass-dark flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <PieIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Spending Breakdown
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  By expense category
                </p>
              </div>
            </div>

            {/* Timeframe switch */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold">
              <button
                onClick={() => setChartTimeframe('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  chartTimeframe === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChartTimeframe('this_month')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  chartTimeframe === 'this_month'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          {/* SVG Donut Visual */}
          {categoryData.items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <Info className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No expense records found for this period.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
              <div className="relative w-48 h-48 shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                  {/* Background Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="24"
                    className="text-slate-100 dark:text-slate-800/50"
                  />
                  {/* Segments */}
                  {donutSlices.map((slice, idx) => {
                    const isHovered = activeSlice === idx;
                    return (
                      <circle
                        key={slice.id}
                        cx={slice.center}
                        cy={slice.center}
                        r={slice.radius}
                        fill="transparent"
                        stroke={slice.colorHex}
                        strokeWidth={isHovered ? 28 : 24}
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer hover:opacity-95"
                        onMouseEnter={() => setActiveSlice(idx)}
                        onMouseLeave={() => setActiveSlice(null)}
                      />
                    );
                  })}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  {activeSlice !== null && donutSlices[activeSlice] ? (
                    <>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {donutSlices[activeSlice].name}
                      </span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(donutSlices[activeSlice].amount, currency)}
                      </span>
                      <span className="text-xs font-semibold text-indigo-500">
                        {donutSlices[activeSlice].percentage.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Total Spent
                      </span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(categoryData.total, currency)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {categoryData.items.length} categories
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Mini Legend List */}
              <div className="w-full space-y-2 max-h-48 overflow-y-auto pr-1">
                {categoryData.items.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveSlice(idx)}
                    onMouseLeave={() => setActiveSlice(null)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      activeSlice === idx
                        ? 'bg-slate-100 dark:bg-slate-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: donutSlices[idx]?.colorHex || '#6366f1' }} />
                      <span className="font-medium truncate text-slate-700 dark:text-slate-300">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <span className="text-[11px] text-slate-400 w-9 text-right font-medium">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Highest category:</span>
          <span className="font-semibold text-indigo-500">
            {categoryData.items[0]?.name || 'N/A'} ({categoryData.items[0]?.percentage.toFixed(0) || 0}%)
          </span>
        </div>
      </div>

      {/* 2. Monthly Cash Flow Bar Chart */}
      <div className="lg:col-span-7 rounded-3xl glass-panel p-6 shadow-glass-light dark:shadow-glass-dark flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Cash Flow Activity
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Income vs Expenses (Last 6 Months)
                </p>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-emerald-500 to-teal-400" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-rose-500 to-orange-400" />
                Expense
              </span>
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            {monthlyCashflow.map((month) => {
              const incomeHeight = maxBarValue > 0 ? (month.income / maxBarValue) * 100 : 0;
              const expenseHeight = maxBarValue > 0 ? (month.expense / maxBarValue) * 100 : 0;

              return (
                <div
                  key={month.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900/95 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-xl backdrop-blur-md pointer-events-none whitespace-nowrap animate-fade-in border border-slate-700">
                    <span className="font-semibold text-emerald-400">
                      +{formatCurrency(month.income, currency)}
                    </span>
                    <span className="font-semibold text-rose-400">
                      -{formatCurrency(month.expense, currency)}
                    </span>
                  </div>

                  {/* Dual Bars Container */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Income Bar */}
                    <div
                      className="w-full max-w-[18px] bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-700 group-hover:brightness-110 shadow-sm"
                      style={{ height: `${Math.max(6, incomeHeight)}%` }}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-full max-w-[18px] bg-gradient-to-t from-rose-500 to-orange-400 rounded-t-lg transition-all duration-700 group-hover:brightness-110 shadow-sm"
                      style={{ height: `${Math.max(6, expenseHeight)}%` }}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                    {month.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Insight row */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Interactive analytics update live with every transaction</span>
          </div>
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            Hover over bars to see breakdown
          </span>
        </div>
      </div>

    </div>
  );
};
