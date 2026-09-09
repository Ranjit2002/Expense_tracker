import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

interface FloatingBackToTopProps {
  bottomButtonId?: string;
}

export const FloatingBackToTop: React.FC<FloatingBackToTopProps> = ({
  bottomButtonId = 'footer-back-to-top',
}) => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);

  useEffect(() => {
    // 1. Scroll listener for top threshold (>80px) and bottom proximity
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // True when scrolled more than 80px down
      const passedTopThreshold = scrollY > 80;

      // True when scrolled to within 80px of the very bottom of the document
      const reachedDocumentBottom = windowHeight + scrollY >= docHeight - 80;

      setIsScrolledDown(passedTopThreshold);
      if (reachedDocumentBottom) {
        setIsBottomVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. IntersectionObserver to detect when the bottom button enters or exits the viewport
    let observer: IntersectionObserver | null = null;
    const targetElement = document.getElementById(bottomButtonId);

    if (targetElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsBottomVisible(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0.05, // Trigger as soon as 5% of bottom button is in view
        }
      );
      observer.observe(targetElement);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer && targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [bottomButtonId]);

  // Only show when scrolled past top (>80px) AND bottom button is NOT visible / not scrolled till bottom
  const shouldShow = isScrolledDown && !isBottomVisible;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
        shouldShow
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group relative flex items-center gap-2 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl hover:shadow-indigo-500/25 hover:border-indigo-500/50 hover:bg-gradient-to-tr hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:text-white active:scale-95 transition-all duration-300"
        aria-label="Back to top"
        title="Back to top"
      >
        {/* Greater-than symbol facing top (ChevronUp) */}
        <ChevronUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform duration-200" />

        {/* Expandable text label on hover for desktop */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-xs group-hover:pr-1">
          Back to top
        </span>

        {/* Ambient indicator glow */}
        <span className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />
      </button>
    </div>
  );
};
