import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { ChartsSection } from './components/ChartsSection';
import { BudgetManager } from './components/BudgetManager';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { ToastContainer } from './components/Toast';
import { FloatingBackToTop, scrollToTop } from './components/BackToTop';
import { Sparkles, Plus, ShieldCheck, Zap, ChevronUp } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { openAddModal } = useExpense();

  // Keyboard shortcut: Press 'N' to open Add Transaction modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        openAddModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAddModal]);

  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-slate-800/80 shadow-glass-light dark:shadow-glass-dark">
          {/* Subtle linear decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>{currentDateFormatted}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
                {getGreeting()}, <span className="gradient-text-primary">Financial Explorer</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Stay in control of your wealth with dynamic cashflow forecasts, categorized budget tracking, and real-time analytics.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel-subtle text-xs font-medium text-slate-600 dark:text-slate-300">
                <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                  N
                </kbd>
                <span>Quick Record</span>
              </div>

              <button
                onClick={() => openAddModal()}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-xl shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Record New Entry</span>
              </button>
            </div>
          </div>
        </section>

        {/* 1. Dashboard Metrics Summary */}
        <section aria-label="Key Financial Metrics">
          <DashboardStats />
        </section>

        {/* 2. Visual Analytics & Charts */}
        <section aria-label="Financial Charts and Analytics">
          <ChartsSection />
        </section>

        {/* 3. Budget Goals & Category Meters */}
        <section aria-label="Budget Goals">
          <BudgetManager />
        </section>

        {/* 4. Transactions List Feed */}
        <section aria-label="Transactions Feed">
          <TransactionList />
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 mt-16 py-8 glass-panel-subtle text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white font-display">ApexFlow Finance</span>
            <span>•</span>
            <span>Local & Private Storage</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1 text-indigo-500">
              <Zap className="w-3.5 h-3.5" /> Real-time Analytics
            </span>
          </div>

          {/* Dedicated Back to top Button */}
          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-200/80 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-800/80 shadow-sm active:scale-95 transition-all"
            title="Scroll to top of the page"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            <span>Back to top</span>
          </button>
        </div>
      </footer>

      {/* Floating Back to Top Button on right side (visible when scrolling > 80px) */}
      <FloatingBackToTop />

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal />

      {/* Toast Feedback Alerts */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <DashboardContent />
      </ExpenseProvider>
    </ThemeProvider>
  );
}
