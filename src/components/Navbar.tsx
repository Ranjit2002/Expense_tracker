import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useExpense } from '../context/ExpenseContext';
import { CURRENCIES } from '../data/categories';
import { exportToCSV } from '../utils/formatters';
import {
  Sun,
  Moon,
  Plus,
  Download,
  RotateCcw,
  Trash2,
  ChevronDown,
  Sparkles,
  Coins,
  Layers,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    currency,
    setCurrency,
    transactions,
    openAddModal,
    resetToDemoData,
    clearAllData,
  } = useExpense();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const dataMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close desktop popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setIsCurrencyOpen(false);
      }
      if (dataMenuRef.current && !dataMenuRef.current.contains(target)) {
        setIsDataMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !(event.target as HTMLElement).closest('#mobile-menu-toggle')
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            {/* Ambient indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                Apex<span className="gradient-text-primary">Flow</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden lg:block">
              Intelligent Financial Pulse & Analytics
            </p>
          </div>
        </div>

        {/* Right Action Controls (Desktop + Tablet) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Desktop Currency Selector Dropdown */}
          <div className="relative hidden md:block" ref={currencyRef}>
            <button
              onClick={() => setIsCurrencyOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl glass-panel-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-all duration-200"
              title="Change Currency"
            >
              <Coins className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">{currency.symbol}</span>
              <span className="hidden lg:inline">{currency.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-dropdown p-1.5 z-50 animate-scale-up">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Currency
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors ${
                        currency.code === curr.code
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 font-bold">{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400">{curr.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Data Controls Dropdown (Demo Data / Clear) */}
          <div className="relative hidden md:block" ref={dataMenuRef}>
            <button
              onClick={() => setIsDataMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-xl glass-panel-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-all duration-200"
              title="Data Options"
            >
              <Layers className="w-4 h-4" />
            </button>

            {isDataMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-dropdown p-1.5 z-50 animate-scale-up">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Manage Workspace
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      resetToDemoData();
                      setIsDataMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-indigo-500" />
                    <span>Restore Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      exportToCSV(transactions, currency);
                      setIsDataMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Download CSV Report</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all transactions?')) {
                        clearAllData();
                      }
                      setIsDataMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Clear All Records</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle Button (Visible on all screens) */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl glass-panel-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-all duration-300 group"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Quick Export CSV Button on Desktop */}
          <button
            onClick={() => exportToCSV(transactions, currency)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl glass-panel-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 transition-all duration-200"
            title="Export to CSV"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export</span>
          </button>

          {/* Primary Action Button: Add Transaction */}
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="hidden xs:inline sm:inline">Add Transaction</span>
            <span className="inline xs:hidden sm:hidden">Add</span>
          </button>

          {/* Mobile Hamburger Menu Toggle (< md) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl glass-panel-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-all duration-200"
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-indigo-500" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Collapsible Drawer (< md) */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 glass-dropdown px-4 py-4 space-y-4 animate-fade-in shadow-2xl"
        >
          {/* Currency Selection Grid in Mobile Menu */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-indigo-500" /> Currency
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                Active: {currency.code} ({currency.symbol})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {CURRENCIES.map((curr) => {
                const isSelected = currency.code === curr.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {curr.symbol} {curr.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace & Data Actions */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Workspace Actions
            </div>

            <button
              onClick={() => {
                exportToCSV(transactions, currency);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Export CSV Spreadsheet</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold">
                .CSV
              </span>
            </button>

            <button
              onClick={() => {
                resetToDemoData();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-indigo-500" />
              <span>Restore Demo Data Records</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all transactions?')) {
                  clearAllData();
                }
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Clear All Data Records</span>
            </button>
          </div>

          {/* Privacy footer in mobile menu */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Side Private
            </span>
            <span className="font-semibold text-indigo-500">ApexFlow PRO</span>
          </div>

        </div>
      )}
    </header>
  );
};
