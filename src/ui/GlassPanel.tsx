import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'orange' | 'dark';
  glowOnHover?: boolean;
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'cyan',
  glowOnHover = false,
  onClick,
}) => {
  const borderStyle =
    variant === 'cyan'
      ? 'border-cyan-400/25 shadow-cyan-950/20'
      : variant === 'orange'
      ? 'border-orange-400/30 shadow-orange-950/20'
      : 'border-slate-700/40 shadow-slate-950/30';

  const hoverEffect = glowOnHover
    ? variant === 'cyan'
      ? 'hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:-translate-y-1'
      : 'hover:border-orange-400/60 hover:shadow-[0_0_25px_rgba(245,130,32,0.25)] hover:-translate-y-1'
    : '';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative bg-slate-900/75 backdrop-blur-xl border ${borderStyle} rounded-xl p-5 shadow-2xl transition-all duration-300 ${hoverEffect} ${className}`}
    >
      {/* Corner Tech Brackets */}
      <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm pointer-events-none" />
      <span className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-sm pointer-events-none" />
      <span className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-sm pointer-events-none" />
      <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm pointer-events-none" />

      {children}
    </motion.div>
  );
};
