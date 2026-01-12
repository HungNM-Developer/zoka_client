'use client';

import { Element } from '@/store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Droplets, Wind, Mountain, Zap, Snowflake } from 'lucide-react';

interface ElementalVFXProps {
  element: Element;
  active?: boolean;
  className?: string;
}

export default function ElementalVFX({ element, active = true, className }: ElementalVFXProps) {
  if (!active) return null;

  const renderEffect = () => {
    switch (element) {
      case Element.FIRE:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-red-600/40 via-orange-500/10 to-transparent animate-fire" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Flame size={120} className="text-red-500 blur-xl animate-pulse" />
            </div>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 100, x: Math.random() * 100, opacity: 0 }}
                animate={{ y: -100, opacity: [0, 1, 0] }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() }}
                className="absolute w-1 h-1 bg-orange-400 rounded-full blur-sm"
              />
            ))}
          </div>
        );
      case Element.WATER:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
            <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-ripple" />
            <div className="absolute inset-0 border-2 border-blue-400/10 rounded-full animate-ripple delay-700" />
            <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px]" />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 150, x: Math.random() * 100, scale: 0 }}
                animate={{ y: -50, scale: [0, 1, 0.5], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
                className="absolute w-2 h-2 border border-blue-300/40 rounded-full"
              />
            ))}
          </div>
        );
      case Element.ELECTRIC:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit bg-yellow-400/5 animate-bolt">
             <div className="absolute inset-0 opacity-30 flex items-center justify-center">
                <Zap size={140} className="text-yellow-400 blur-2xl" />
             </div>
             <svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d="M 50 0 L 70 40 L 30 60 L 50 100"
                  stroke="rgba(250, 204, 21, 0.8)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() }}
                  className="blur-sm"
                />
             </svg>
          </div>
        );
      case Element.ICE:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
            <div className="absolute inset-0 bg-cyan-400/10 backdrop-blur-sm animate-frost" />
            <div className="absolute inset-0 border-2 border-cyan-200/20" />
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotate: Math.random() * 360, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              >
                <Snowflake size={8} className="text-cyan-100/40" />
              </motion.div>
            ))}
          </div>
        );
      case Element.WIND:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
             <div className="absolute inset-0 flex items-center justify-center animate-wind">
                <div className="w-full h-full border-[10px] border-emerald-400/10 rounded-full blur-xl" />
             </div>
             {[...Array(5)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ x: -20, y: Math.random() * 100, opacity: 0 }}
                 animate={{ x: 120, opacity: [0, 0.4, 0] }}
                 transition={{ duration: 0.8 + Math.random(), repeat: Infinity, delay: Math.random() }}
                 className="absolute h-px w-20 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent rotate-[-15deg]"
               />
             ))}
          </div>
        );
      case Element.EARTH:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit animate-shake">
            <div className="absolute inset-0 bg-amber-900/10" />
            <div className="absolute bottom-0 inset-x-0 h-1/4 bg-amber-800/20 blur-md" />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 100, x: Math.random() * 100, scale: 0 }}
                animate={{ y: 80, scale: [0, 1, 0], rotate: Math.random() * 360 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() }}
                className="absolute w-3 h-3 bg-amber-700/40 rounded-sm"
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {renderEffect()}
    </div>
  );
}
