import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

export const scrollToTop = () => {
  try {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } catch {
    window.scrollTo(0, 0);
  }
};

interface FloatingBackToTopProps {
  bottomButtonId?: string;
  threshold?: number;
  hideDelay?: number;
}

export const FloatingBackToTop: React.FC<FloatingBackToTopProps> = ({
  threshold = 60,
  hideDelay = 1500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  // Keep isHoveredRef in sync with state
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight || 0;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      // Check boundary conditions: at the top or scrolled till bottom
      const isAtTop = scrollY <= threshold;
      // Reached within 50px of the very bottom of the document
      const isAtBottom = windowHeight + scrollY >= docHeight - 50;

      // 1. Hide immediately if at the top or scrolled till bottom
      if (isAtTop || isAtBottom) {
        if (hideTimerRef.current) {
          window.clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
        setIsVisible(false);
        return;
      }

      // 2. While actively scrolling between top and bottom, show the button
      setIsVisible(true);

      // 3. Reset idle timer: hide button when scrolling stops
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = window.setTimeout(() => {
        // Do not hide if the user is currently hovering over the button
        if (!isHoveredRef.current) {
          setIsVisible(false);
        }
      }, hideDelay);
    };

    // Run initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [threshold, hideDelay]);

  // When mouse leaves, schedule auto-hide
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
    >
      <button
        onClick={scrollToTop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
