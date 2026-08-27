import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  // Bypasses opacity transition for admin routes to ensure zero blank white screen locks
  if (location.pathname.startsWith('/admin')) {
    return <div className="w-full flex-1">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1], // ease-out-expo curve
        }}
        aria-live="polite"
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

