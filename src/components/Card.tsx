'use client';

import { Element } from '@/store/useGameStore';
import { motion } from 'framer-motion';
import { Flame, Droplets, Wind, Mountain, Zap, Snowflake, Star, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  element: Element;
  stars: number;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isRevealed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const elementConfig = {
  [Element.FIRE]: {
    icon: Flame,
    color: 'from-orange-600 to-red-700',
    glow: 'shadow-red-500/40',
    text: 'text-red-400',
    border: 'border-red-500/30',
    accent: 'bg-red-500/10'
  },
  [Element.WATER]: {
    icon: Droplets,
    color: 'from-blue-600 to-indigo-700',
    glow: 'shadow-blue-500/40',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    accent: 'bg-blue-500/10'
  },
  [Element.WIND]: {
    icon: Wind,
    color: 'from-emerald-500 to-teal-700',
    glow: 'shadow-emerald-500/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    accent: 'bg-emerald-500/10'
  },
  [Element.EARTH]: {
    icon: Mountain,
    color: 'from-amber-700 to-yellow-900',
    glow: 'shadow-amber-500/40',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    accent: 'bg-amber-500/10'
  },
  [Element.ELECTRIC]: {
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    glow: 'shadow-yellow-400/40',
    text: 'text-yellow-400',
    border: 'border-yellow-400/30',
    accent: 'bg-yellow-400/10'
  },
  [Element.ICE]: {
    icon: Snowflake,
    color: 'from-cyan-400 to-blue-500',
    glow: 'shadow-cyan-400/40',
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
    accent: 'bg-cyan-400/10'
  },
};

export default function Card({ element, stars, selected, onClick, disabled, isRevealed = true, className, size = 'md' }: CardProps) {
  const config = elementConfig[element];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-24 h-36 p-3 rounded-xl',
    md: 'w-36 h-56 p-6 rounded-[2rem]',
    lg: 'w-48 h-72 p-8 rounded-[3rem]',
  };

  if (!isRevealed) {
    return (
      <div className={cn(
        "border-2 border-white/5 bg-[#0f172a] relative overflow-hidden flex items-center justify-center transition-all duration-500 select-none",
        sizeClasses[size],
        className
      )}>
         <div className="absolute inset-0 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[size:10px_10px] opacity-[0.03]" />
         <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
         <div className="w-full h-full border border-white/5 rounded-lg flex items-center justify-center bg-black/40 relative z-10 group">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
            <Sparkles size={size === 'sm' ? 24 : 40} className="text-primary/20 animate-pulse relative z-10" />
         </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={!disabled ? { y: -10, scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "border-2 flex flex-col items-center justify-between relative overflow-hidden transition-all duration-500 group select-none cursor-pointer",
        config.border,
        "glass-premium",
        sizeClasses[size],
        selected && "ring-4 ring-primary ring-offset-4 ring-offset-[#020617] !border-primary",
        disabled && !selected && "grayscale-[0.6] opacity-60 cursor-default",
        selected && config.glow,
        className
      )}
    >
      {/* Background Element Gradient */}
      <div className={cn("absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10", config.color)} />
      
      {/* Gloss Effect */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent skew-x-12 translate-x-1/2 pointer-events-none" />

      {/* Header: Element Type */}
      <div className="w-full flex justify-between items-center relative z-10">
         <span className={cn("font-black uppercase tracking-[0.2em] italic", size === 'sm' ? 'text-[7px]' : 'text-[9px]', config.text)}>
            {size === 'sm' ? element.substring(0, 3) : element}
         </span>
         <div className={cn("rounded-full", size === 'sm' ? 'w-1 h-1' : 'w-2 h-2', config.accent.replace('/10', ''))} />
      </div>

      {/* Center: Icon */}
      <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
         <div className={cn("absolute inset-0 blur-2xl opacity-40 animate-pulse", config.text)} />
         <Icon size={size === 'sm' ? 32 : 64} className={cn("drop-shadow-2xl relative z-10", config.text)} />
      </div>

      {/* Footer: Rating */}
      <div className="w-full relative z-10">
         {size !== 'sm' && (
           <div className="flex items-center justify-center gap-1.5 mb-1 opacity-20 group-hover:opacity-100 transition-opacity">
              {Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className={cn("w-1 h-1 rounded-full", config.accent.replace('/10', ''))} />
              ))}
           </div>
         )}
         <div className="flex items-center justify-center gap-2">
            <span className={cn("font-black italic tracking-tighter tabular-nums text-white group-hover:text-glow", size === 'sm' ? 'text-xl' : 'text-4xl')}>
               {stars}
            </span>
            <Star size={size === 'sm' ? 12 : 18} className="text-yellow-500 fill-yellow-500 drop-shadow-lg" />
         </div>
      </div>

      {/* Shine Sweep Animation */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12 transition-transform duration-1000 ease-in-out" />
    </motion.div>
  );
}
