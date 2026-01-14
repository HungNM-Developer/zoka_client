'use client';

import { useGameStore, RoomStatus, Element } from '@/store/useGameStore';
import CardComponent from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Play, SwatchBook, Trophy, Users, Star, ArrowUpRight, Clock, ShieldCheck, Loader2, Info, Swords, Zap, Activity, ArrowRight, Gavel, Share2, UserMinus, History, Flame, Droplets, Wind, Mountain, Snowflake, X } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { translations } from '@/i18n/translations';
import ElementalVFX from './ElementalVFX';

function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export default function GameView() {
   const router = useRouter();
   const {
      room, socket, leaveRoom, toggleReady, startGame,
      playCard, username, kickPlayer, backToLobby, language
   } = useGameStore();

   const t = (key: keyof typeof translations['en']) => translations[language][key];
   const [selectedCard, setSelectedCard] = useState<string | null>(null);
   const [timeLeft, setTimeLeft] = useState(20);
   const [showRoundOverlay, setShowRoundOverlay] = useState(false);
   const [countdown, setCountdown] = useState(3);
   const [lastRoundResults, setLastRoundResults] = useState<any>(null);
   const [showHistoryModal, setShowHistoryModal] = useState(false);

   const timerRef = useRef<NodeJS.Timeout | null>(null);
   const countdownRef = useRef<NodeJS.Timeout | null>(null);

   const me = room?.players[socket?.id || ''];
   const players = Object.values(room?.players || {});
   const isHost = room?.hostId === socket?.id;
   const myTurn = room?.turnOrder[room?.currentTurnIndex] === socket?.id;
   const currentTurnPlayer = room?.players[room?.turnOrder[room?.currentTurnIndex]];

   // Listen for ROUND_RESULT to trigger overlay
   useEffect(() => {
      if (!socket) return;

      const handleRoundResult = (result: any) => {
         setLastRoundResults(result);
         setShowRoundOverlay(true);
         setCountdown(3);

         if (countdownRef.current) clearInterval(countdownRef.current);
         countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
               if (prev <= 1) {
                  clearInterval(countdownRef.current!);
                  setTimeout(() => setShowRoundOverlay(false), 1000);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      };

      socket.on('ROUND_RESULT', handleRoundResult);
      return () => {
         socket.off('ROUND_RESULT', handleRoundResult);
      };
   }, [socket]);

   // Countdown timer logic for individual turns
   useEffect(() => {
      if (room?.status === RoomStatus.PLAYING && !showRoundOverlay) {
         setTimeLeft(20);
         if (timerRef.current) clearInterval(timerRef.current);

         timerRef.current = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
         }, 1000);
      } else {
         if (timerRef.current) clearInterval(timerRef.current);
      }

      return () => {
         if (timerRef.current) clearInterval(timerRef.current);
      };
   }, [room?.currentTurnIndex, room?.status, showRoundOverlay]);

   const handleLeave = () => {
      leaveRoom();
      router.push('/dashboard');
   };


   const getElementIcon = (element: Element, size = 10) => {
      switch (element) {
         case Element.FIRE: return <Flame size={size} className="text-red-500" />;
         case Element.WATER: return <Droplets size={size} className="text-blue-500" />;
         case Element.WIND: return <Wind size={size} className="text-emerald-500" />;
         case Element.EARTH: return <Mountain size={size} className="text-amber-700" />;
         case Element.ELECTRIC: return <Zap size={size} className="text-yellow-400" />;
         case Element.ICE: return <Snowflake size={size} className="text-cyan-400" />;
         default: return null;
      }
   };

   const copyInviteLink = () => {
      if (!room) return;
      const url = `${window.location.origin}/room/${room.code}`;
      navigator.clipboard.writeText(url);
      toast.success(t('link_copied'), { description: t('link_copied_desc') });
   };

   // Calculate merged element totals for the current round
   const elementTotals = useMemo(() => {
      if (!room) return {};
      const totals: Partial<Record<Element, number>> = {};
      Object.values(room.players).forEach(p => {
         if (p.hasPlayed && p.playedCard) {
            const el = p.playedCard.element;
            totals[el] = (totals[el] || 0) + p.playedCard.stars;
         }
      });
      return totals;
   }, [room]);

   if (!room) return null;

   return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden font-outfit">
         {/* Round Result Overlay */}
         <AnimatePresence>
            {showRoundOverlay && lastRoundResults && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
               >
                  <motion.div
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="text-center mb-12"
                  >
                     <h2 className="text-5xl font-black italic tracking-tighter text-glow mb-2 uppercase">{t('round_analysis')} {lastRoundResults.round}</h2>
                     <p className="text-white/20 font-black tracking-[0.5em] uppercase text-xs italic">{t('intel_report')}</p>
                  </motion.div>

                  <div className="w-full max-w-4xl space-y-6 mb-20 overflow-y-auto max-h-[60vh] px-4 custom-scrollbar">
                     {lastRoundResults.results.map((res: any, i: number) => {
                        const p = room.players[res.playerId];
                        return (
                           <motion.div
                              key={res.playerId}
                              initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                              className={cn(
                                 "relative border rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden transition-all duration-500",
                                 res.change > 0
                                    ? "bg-green-500/[0.03] border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
                                    : res.change < 0
                                       ? "bg-red-500/[0.03] border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                                       : "bg-white/[0.02] border-white/10"
                              )}
                           >
                              {/* Background Elemental VFX */}
                              <ElementalVFX
                                 element={res.cardElement}
                                 className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                              />

                              <div className="flex items-center gap-8 relative z-10">
                                 <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl transition-all",
                                    res.change > 0 ? "bg-green-500 text-white" : res.change < 0 ? "bg-red-500 text-white" : "bg-white/10"
                                 )}>
                                    {p?.username[0].toUpperCase()}
                                 </div>
                                 <div className="text-left">
                                    <p className="text-2xl font-black uppercase tracking-tighter leading-tight mb-1">{p?.username}</p>
                                    <div className="flex items-center gap-2">
                                       <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/5">{res.cardElement}</span>
                                       <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">{t('card_stars')}: {res.cardStars}★</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-12 relative z-10">
                                 <div className={cn(
                                    "text-5xl font-black italic tabular-nums flex items-center gap-3",
                                    res.change > 0 ? "text-green-400 text-glow" : res.change < 0 ? "text-red-400" : "text-white/20"
                                 )}>
                                    {res.change > 0 ? `+${res.change}` : res.change < 0 ? res.change : "±0"}
                                    <Star size={32} className={res.change > 0 ? "fill-green-400" : res.change < 0 ? "fill-red-400" : "fill-white/10"} />
                                 </div>
                                 <div className="h-16 w-px bg-white/10" />
                                 <div className="text-right">
                                    <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.4em] mb-1">{t('updated_rating')}</p>
                                    <p className="text-4xl font-black italic text-yellow-500 tabular-nums leading-none tracking-tighter">{res.newTotal}★</p>
                                 </div>
                              </div>
                           </motion.div>
                        );
                     })}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                     <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">{t('protocol_restarting')}</span>
                     <div className="text-8xl font-black italic text-glow animate-pulse">{countdown}</div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Dynamic Ambient Background */}
         <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[60%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
         </div>

         {/* Top Navigation HUD */}
         <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md z-50">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Star className="text-white fill-white" size={20} />
               </div>
               <div>
                  <h1 className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{t('warzone')} ARENA</h1>
                  <p className="text-[8px] font-black tracking-[0.4em] opacity-30 mt-0.5 uppercase">{t('sector_access')}: {room.code}</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black tracking-[0.3em] opacity-30 uppercase">{t('commander_rank')}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-xl font-black text-yellow-500 italic tabular-nums">{me?.stars}★</span>
                  </div>
               </div>
               <div className="h-8 w-px bg-white/10" />
               <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLeave}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 rounded-xl transition-all border border-white/10"
               >
                  <LogOut size={18} />
               </motion.button>
            </div>
         </header>

         {room.status === RoomStatus.WAITING ? (
            <div className="flex-grow flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">

               {/* Left Panel: Intelligence & Settings */}
               <aside className="lg:col-span-3 border-r border-white/5 bg-black/40 p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar">
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase italic">{t('room_settings')}</h3>
                        <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
                     </div>

                     <div className="space-y-4">
                        <div className="glass-premium p-5 rounded-2xl border-white/5 space-y-3">
                           <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase opacity-40">
                              <span>{t('units_limit')}</span>
                              <Users size={14} />
                           </div>
                           <p className="text-2xl font-black italic tabular-nums leading-none">{room.maxPlayers} <span className="text-[10px] opacity-20 not-italic">MAX</span></p>
                        </div>

                        <div className="glass-premium p-5 rounded-2xl border-white/5 space-y-3">
                           <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase opacity-40">
                              <span>Engagement</span>
                              <Clock size={14} />
                           </div>
                           <p className="text-2xl font-black italic tabular-nums leading-none">10 <span className="text-[10px] opacity-20 not-italic">ROUNDS</span></p>
                        </div>

                        <div className="glass-premium p-5 rounded-2xl border-white/5 space-y-3">
                           <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase opacity-40">
                              <span>Response Time</span>
                              <Activity size={14} />
                           </div>
                           <p className="text-2xl font-black italic tabular-nums leading-none">20s <span className="text-[10px] opacity-20 not-italic">TIMEOUT</span></p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-1">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-secondary/60 uppercase italic">{t('sector_access')}</h3>
                        <div className="h-px w-full bg-gradient-to-r from-secondary/20 to-transparent" />
                     </div>

                     <div className="glass-premium p-6 rounded-3xl border-white/5 text-center space-y-6">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">Transmission Code</p>
                           <p className="text-4xl font-black italic tracking-tighter text-white font-mono">{room.code}</p>
                        </div>
                        <button
                           onClick={copyInviteLink}
                           className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all group"
                        >
                           <Share2 size={14} className="group-hover:scale-110 transition-transform" /> {t('copy_invite')}
                        </button>
                        <p className="text-[9px] text-white/20 italic font-medium">{t('invite_friends')}</p>
                     </div>
                  </div>
               </aside>

               {/* Central Area: Combatant Grid */}
               <main className="lg:col-span-9 p-8 md:p-12 flex flex-col gap-10 overflow-y-auto no-scrollbar relative">
                  <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />

                  <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10 border-b border-white/5 pb-8">
                     <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                           <Activity size={12} className="text-primary animate-pulse" />
                           <span className="text-[9px] font-black tracking-[0.3em] text-primary uppercase">{t('recruitment_phase')}</span>
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase text-glow">{t('boarding_protocol')}</h2>
                     </div>

                     <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
                        <div className="text-right">
                           <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.3em] mb-1">Combatant Capacity</p>
                           <div className="flex items-center gap-3">
                              <span className="text-xl font-black italic tabular-nums">{players.length} / {room.maxPlayers}</span>
                              <div className="flex gap-1">
                                 {[...Array(room.maxPlayers)].map((_, i) => (
                                    <div key={i} className={cn("w-1.5 h-4 rounded-full", i < players.length ? "bg-primary" : "bg-white/10")} />
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
                     {players.map((p) => (
                        <motion.div
                           layout
                           key={p.id}
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className={cn(
                              "glass-premium p-8 rounded-[2.5rem] flex items-center gap-6 relative overflow-hidden transition-all duration-500 border group",
                              p.ready
                                 ? 'border-green-500/40 bg-green-500/[0.05] shadow-[0_0_50px_rgba(34,197,94,0.1)]'
                                 : 'border-white/5 hover:border-white/10'
                           )}
                        >
                           <div className="relative">
                              <div className={cn(
                                 "w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl transition-all duration-500 relative z-10",
                                 p.ready ? 'bg-green-500 text-white scale-105' : 'bg-white/5 text-white/20'
                              )}>
                                 {p.username[0].toUpperCase()}
                              </div>
                              {p.ready && (
                                 <motion.div
                                    layoutId={`ready-glow-${p.id}`}
                                    className="absolute -inset-2 bg-green-500/20 blur-xl rounded-full -z-10"
                                 />
                              )}
                              <div className={cn(
                                 "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#020617] flex items-center justify-center",
                                 p.ready ? "bg-green-500" : "bg-white/10"
                              )}>
                                 {p.ready ? <ShieldCheck size={12} className="text-white" /> : <Loader2 size={12} className="text-white/20 animate-spin" />}
                              </div>
                           </div>

                           <div className="flex-grow space-y-1">
                              <div className="flex items-center justify-between">
                                 <p className="font-black tracking-widest text-sm uppercase flex items-center gap-2">
                                    {p.username}
                                    {p.id === socket?.id && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-lg border border-primary/30 italic">YOU</span>}
                                 </p>
                                 {isHost && p.id !== socket?.id && (
                                    <button
                                       onClick={() => kickPlayer(p.id)}
                                       className="text-red-500 hover:scale-110 transition-transform p-1"
                                       title={t('kick_combatant')}
                                    >
                                       <UserMinus size={14} />
                                    </button>
                                 )}
                              </div>
                              <p className={cn(
                                 "text-[9px] font-black tracking-widest uppercase italic transition-colors",
                                 p.ready ? 'text-green-500' : 'text-white/10'
                              )}>
                                 {p.ready ? t('ready_to_strike') : t('preparing')}
                              </p>
                           </div>

                           <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                              <Swords size={60} />
                           </div>
                        </motion.div>
                     ))}

                     {/* Empty Slots */}
                     {[...Array(Math.max(0, room.maxPlayers - players.length))].slice(0, 6).map((_, i) => (
                        <div key={`empty-${i}`} className="border border-dashed border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 opacity-20 bg-white/[0.01]">
                           <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                              <Users size={24} className="text-white/20" />
                           </div>
                           <div className="space-y-2">
                              <div className="w-20 h-2 bg-white/10 rounded" />
                              <div className="w-12 h-1.5 bg-white/5 rounded" />
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Controls Anchor at Bottom */}
                  <div className="mt-auto pt-10 flex flex-col items-center gap-6 relative z-10">
                     <AnimatePresence mode="wait">
                        {players.length < 4 ? (
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-3 text-red-400/60 font-black text-[10px] tracking-widest uppercase italic bg-red-500/5 px-6 py-3 rounded-full border border-red-500/10"
                           >
                              <Info size={14} />
                              {t('min_players_warning')}
                           </motion.div>
                        ) : players.some(p => p.id !== room.hostId && !p.ready) ? (
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-3 text-yellow-500/60 font-black text-[10px] tracking-widest uppercase italic bg-yellow-500/5 px-6 py-3 rounded-full border border-yellow-500/10"
                           >
                              <Loader2 size={14} className="animate-spin" />
                              {t('waiting_for_all_ready')}
                           </motion.div>
                        ) : null}
                     </AnimatePresence>

                     <div className="flex flex-col md:flex-row gap-6 w-full max-w-xl">
                        {isHost ? (
                           <motion.button
                              onClick={startGame}
                              disabled={players.length < 4 || players.some(p => p.id !== room.hostId && !p.ready)}
                              className="flex-1 py-6 rounded-3xl bg-primary text-white font-black tracking-[0.4em] text-xs disabled:opacity-20 shadow-[0_0_50px_rgba(168,85,247,0.4)] border border-primary/50 uppercase italic relative group"
                           >
                              {t('initialize_battle')}
                           </motion.button>
                        ) : (
                           <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleReady(!me?.ready)}
                              className={cn(
                                 "flex-1 py-6 rounded-3xl font-black tracking-[0.4em] text-xs transition-all border uppercase italic relative overflow-hidden group",
                                 me?.ready
                                    ? 'bg-green-500 border-green-400 text-white shadow-[0_0_40px_rgba(34,197,94,0.3)]'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                              )}
                           >
                              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                              {me?.ready ? t('ready') : t('mark_ready')}
                           </motion.button>
                        )}
                     </div>
                  </div>
               </main>
            </div>
         ) : room.status === RoomStatus.PLAYING ? (
            <div className="flex-grow grid lg:grid-cols-12 gap-0 overflow-hidden">

               {/* Tactical Sidebar (Standings) */}
               <aside className="lg:col-span-2 border-r border-white/5 bg-black/40 p-4 flex flex-col gap-4 overflow-hidden relative">
                  <div className="flex items-center justify-between mb-2 px-1">
                     <div className="flex items-center gap-2">
                        <Activity size={12} className="text-primary" />
                        <h3 className="text-[9px] font-black tracking-[0.4em] opacity-30 uppercase">{t('standings')}</h3>
                     </div>
                     <button
                        onClick={() => setShowHistoryModal(true)}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 transition-all"
                     >
                        <History size={10} className="text-secondary" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-secondary">{t('logs')}</span>
                     </button>
                  </div>

                  <div className="flex-grow space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                     {players.sort((a, b) => b.stars - a.stars).map((p, idx) => (
                        <div
                           key={p.id}
                           className={cn(
                              "flex items-center justify-between p-1.5 rounded-lg border transition-all relative group",
                              p.id === socket?.id ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/5",
                              room.turnOrder[room.currentTurnIndex] === p.id && "ring-1 ring-primary/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                           )}
                        >
                           <div className="flex items-center gap-1.5 overflow-hidden">
                              <div className="text-[7px] font-black opacity-20 w-3 leading-none">{idx + 1}</div>
                              <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center font-black text-[9px] flex-shrink-0">
                                 {p.username[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col overflow-hidden leading-tight">
                                 <span className="text-[8px] font-black tracking-widest uppercase truncate max-w-[50px]">{p.username}</span>
                                 <span className="text-[7px] font-bold text-yellow-500 tabular-nums">{p.stars}★</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-1 flex-shrink-0">
                              {isHost && p.id !== socket?.id && (
                                 <button
                                    onClick={(e) => { e.stopPropagation(); kickPlayer(p.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all p-0.5"
                                 >
                                    <UserMinus size={9} />
                                 </button>
                              )}
                              {p.hasPlayed && <ShieldCheck size={9} className="text-green-500" />}
                              {room.turnOrder[room.currentTurnIndex] === p.id && <Loader2 size={9} className="animate-spin text-primary" />}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3 mt-auto">
                     <h4 className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase px-1">{t('element_clusters')}</h4>
                     <div className="grid grid-cols-2 gap-2">
                        {Object.entries(elementTotals).map(([el, total]) => (
                           <div key={el} className="bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col items-center">
                              <span className="text-[7px] font-black opacity-30 uppercase mb-0.5">{el.substring(0, 3)}</span>
                              <span className="text-xs font-black italic">{total}★</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </aside>

               {/* Warzone Central */}
               <main className="lg:col-span-7 flex flex-col overflow-hidden relative">
                  <div className="flex items-center justify-between px-8 py-4 bg-black/20 border-b border-white/5 z-20">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase">{t('engagement_round')}</span>
                           <span className="text-2xl font-black italic tracking-tighter text-primary">0{room.round} <span className="text-white/20">/ 10</span></span>
                        </div>
                        <div className="h-10 w-px bg-white/5" />
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase">{t('time_remaining')}</span>
                           <div className="flex items-center gap-2">
                              <Clock size={14} className={cn(timeLeft < 4 ? "text-red-500 animate-pulse" : "text-primary")} />
                              <span className={cn("text-2xl font-black italic tabular-nums tracking-tighter", timeLeft < 4 ? "text-red-500" : "text-white")}>
                                 {timeLeft}s
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="px-6 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", myTurn ? "bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-white/10")} />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">
                           {myTurn ? t('commander_authorized') : t('intel_uploading')}
                        </span>
                     </div>
                  </div>

                  {/* Tabletop */}
                  <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden arena-container bg-[#020617]">
                     {/* 3D Arena Surface */}
                     <div className="absolute inset-0 arena-surface pointer-events-none flex items-center justify-center">
                        {/* Dynamic Floor Grid */}
                        <div className="absolute w-[150%] h-[150%] cyber-grid opacity-[0.05] [mask-image:radial-gradient(circle_at_50%_50%,black_30%,transparent_70%)]" />

                        {/* Concentric Rings */}
                        <div className="absolute w-[300px] h-[300px] border border-primary/20 rounded-full animate-spin-slow" />
                        <div className="absolute w-[500px] h-[500px] border border-secondary/10 rounded-full animate-rotate-slow" />
                        <div className="absolute w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow duration-[30s]" />
                     </div>

                     {/* Arena Core (Central Energy Source) */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                        <div className="w-32 h-32 bg-primary/40 rounded-full blur-[60px] animate-core" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-16 h-16 cyber-ring rounded-full flex items-center justify-center opacity-30">
                              <Zap size={24} className="text-primary animate-pulse" />
                           </div>
                        </div>
                     </div>

                     {/* Cards Container - Now using calculated positions for visual interest */}
                     <div className="relative z-10 w-full h-full flex items-center justify-center py-20">
                        <AnimatePresence>
                           {players.filter(p => p.hasPlayed).map((p, i, filtered) => {
                              // Circular formation layout
                              const total = filtered.length;
                              const angle = (i / total) * (Math.PI * 2) - Math.PI / 2;
                              const radius = total > 1 ? 250 : 0;
                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * (radius * 0.4); // Tilted perspective adjustment

                              return (
                                 <motion.div
                                    key={p.id}
                                    initial={{ scale: 0, x: 0, y: -500, opacity: 0, rotateY: 90 }}
                                    animate={{ scale: 1, x, y, opacity: 1, rotateY: 0 }}
                                    transition={{
                                       type: 'spring',
                                       damping: 12,
                                       stiffness: 100,
                                       delay: i * 0.05
                                    }}
                                    className="absolute perspective-1000 group"
                                 >
                                    {/* Holographic Platform */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/10 blur-xl rounded-full scale-x-150 rotateX-90 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Landing Spark VFX */}
                                    <motion.div
                                       initial={{ scale: 0, opacity: 0 }}
                                       animate={{ scale: [0, 2], opacity: [1, 0] }}
                                       transition={{ duration: 0.6 }}
                                       className="absolute inset-0 border border-primary/40 rounded-[3rem] z-0 blur-md"
                                    />

                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                                       <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
                                          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">{p.username}</span>
                                       </div>
                                       <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: 40 }}
                                          className="h-0.5 bg-primary/40 rounded-full"
                                       />
                                    </div>

                                    <div className="relative group-hover:-translate-y-4 group-hover:rotate-x-[-10deg] transition-all duration-500">
                                       <CardComponent
                                          element={p.playedCard?.element || Element.FIRE}
                                          stars={p.playedCard?.stars || 0}
                                          disabled
                                          size="lg"
                                          className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border-white/10"
                                       />
                                       {/* Element Back-Glow */}
                                       <div className="absolute inset-0 -z-10 group-hover:opacity-100 opacity-0 transition-opacity blur-[50px]">
                                          <ElementalVFX element={p.playedCard?.element || Element.FIRE} className="scale-150" />
                                       </div>
                                    </div>
                                 </motion.div>
                              );
                           })}
                        </AnimatePresence>

                        {players.filter(p => p.hasPlayed).length === 0 && (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center justify-center gap-12 relative z-0"
                           >
                              <div className="relative">
                                 <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full animate-pulse-slow scale-150" />
                                 <Swords size={200} strokeWidth={0.5} className="text-white opacity-10 animate-pulse" />
                              </div>
                              <div className="flex flex-col items-center gap-4">
                                 <p className="text-4xl font-black tracking-[1.2em] italic uppercase text-white/10 ml-[1.2em]">{t('awaiting_clash')}</p>
                                 <div className="flex gap-4">
                                    {[...Array(3)].map((_, i) => (
                                       <motion.div
                                          key={i}
                                          animate={{ scaleY: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                          className="w-1 h-8 bg-primary rounded-full"
                                       />
                                    ))}
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </div>

                     {/* Matrix floating button */}
                     <div className="absolute bottom-8 left-8 z-20 group">
                        <div className="bg-black/60 border border-white/10 rounded-full p-4 flex items-center gap-4 hover:bg-black/80 transition-all cursor-help border-primary/20">
                           <Zap size={20} className="text-primary animate-pulse" />
                           <div className="absolute bottom-full left-0 mb-4 w-64 glass-premium p-6 rounded-[2rem] border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-2xl z-50">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/5 flex items-center gap-2">
                                 <Swords size={12} /> {t('tactical_guide')}
                              </p>
                              <div className="space-y-3 text-[10px] font-bold">
                                 <div className="flex items-center justify-between text-red-400/80">
                                    <span>FIRE</span> <ArrowRight size={10} /> <span>ICE</span>
                                 </div>
                                 <div className="flex items-center justify-between text-cyan-400/80">
                                    <span>ICE</span> <ArrowRight size={10} /> <span>WIND</span>
                                 </div>
                                 <div className="flex items-center justify-between text-emerald-400/80">
                                    <span>WIND</span> <ArrowRight size={10} /> <span>EARTH</span>
                                 </div>
                                 <div className="flex items-center justify-between text-amber-600/80">
                                    <span>EARTH</span> <ArrowRight size={10} /> <span>ELECTRIC</span>
                                 </div>
                                 <div className="flex items-center justify-between text-yellow-400/80">
                                    <span>ELECTRIC</span> <ArrowRight size={10} /> <span>WATER</span>
                                 </div>
                                 <div className="flex items-center justify-between text-blue-400/80">
                                    <span>WATER</span> <ArrowRight size={10} /> <span>FIRE</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </main>

               {/* Hand Control Center - Right Sidebar */}
               <aside className="lg:col-span-3 border-l border-white/5 bg-black/30 p-6 flex flex-col gap-6 overflow-hidden">
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-3">
                        <SwatchBook size={16} className="text-primary" />
                        <h3 className="text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">{t('my_inventory')}</h3>
                     </div>
                     <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <span className="text-[9px] font-black text-primary">{me?.hand.length} {t('modules')}</span>
                     </div>
                  </div>

                  {/* Execute Button - Now at the Top */}
                  <AnimatePresence>
                     {myTurn && selectedCard && (
                        <motion.div
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           className="pb-4 border-b border-white/5"
                        >
                           <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                 playCard(selectedCard);
                                 setSelectedCard(null);
                              }}
                              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl font-black italic tracking-[0.3em] shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-primary/50 text-sm flex items-center justify-center gap-3"
                           >
                              {t('execute_deployment')} <Gavel size={18} />
                           </motion.button>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="flex-grow overflow-y-auto pr-2 no-scrollbar">
                     <div className="grid grid-cols-3 gap-3">
                        <AnimatePresence>
                           {me?.hand.sort((a, b) => a.stars - b.stars).map((card, idx) => (
                              <motion.div
                                 key={card.id}
                                 initial={{ opacity: 0, scale: 0.8 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 transition={{ delay: idx * 0.03 }}
                                 className="relative"
                              >
                                 <CardComponent
                                    element={card.element}
                                    stars={card.stars}
                                    selected={selectedCard === card.id}
                                    onClick={() => setSelectedCard(card.id)}
                                    disabled={!myTurn}
                                    size="sm"
                                    className={cn(
                                       "w-full h-32",
                                       selectedCard === card.id ? "ring-2 ring-primary ring-offset-2 ring-offset-[#020617]" : "hover:border-white/20"
                                    )}
                                 />
                              </motion.div>
                           ))}
                        </AnimatePresence>
                     </div>
                  </div>

                  {!myTurn && currentTurnPlayer && (
                     <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-primary/30 mb-2" />
                        <p className="text-[9px] font-black tracking-[0.2em] opacity-40 uppercase">{t('waiting_for')} {currentTurnPlayer.username}</p>
                     </div>
                  )}
               </aside>
            </div>
         ) : (
            /* Results View */
            <div className="flex-grow flex flex-col items-center justify-center p-8 gap-12 text-center overflow-y-auto no-scrollbar">
               <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="relative"
               >
                  <Trophy size={140} className="text-yellow-500 drop-shadow-[0_0_50px_rgba(234,179,8,0.4)]" />
                  <div className="absolute inset-0 bg-yellow-400/10 blur-[100px] rounded-full -z-10" />
               </motion.div>

               <div className="space-y-4">
                  <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">{t('victory_tally')}</h2>
                  <p className="text-white/20 font-black tracking-[0.6em] uppercase text-xs italic">{t('protocol_terminated')}</p>
               </div>

               <div className="w-full max-w-2xl space-y-3">
                  {players.sort((a, b) => b.stars - a.stars).map((p, i) => (
                     <motion.div
                        key={p.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                           "flex items-center justify-between p-6 rounded-[2rem] border transition-all",
                           i === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'
                        )}
                     >
                        <div className="flex items-center gap-6">
                           <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl",
                              i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/40'
                           )}>
                              {i + 1}
                           </div>
                           <div className="text-left">
                              <p className="text-xl font-black uppercase tracking-widest leading-none mb-1">{p.username}</p>
                              <p className="text-[8px] font-black opacity-30 tracking-widest uppercase">{i === 0 ? t('arena_superior') : t('combatant')}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                           <span className="text-4xl font-black italic text-yellow-500 tabular-nums leading-none">{p.stars}★</span>
                        </div>
                     </motion.div>
                  ))}
               </div>

               <div className="flex flex-col md:flex-row gap-6 mt-6">
                  {isHost && (
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={backToLobby}
                        className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-sm tracking-[0.3em] shadow-2xl uppercase italic border border-primary/50"
                     >
                        {t('redeploy_lobby')}
                     </motion.button>
                  )}

                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleLeave}
                     className="bg-white/5 hover:bg-white/10 text-white px-12 py-5 rounded-2xl font-black text-sm tracking-[0.3em] shadow-2xl uppercase italic border border-white/10"
                  >
                     {t('exit_arena')}
                  </motion.button>
               </div>
            </div>
         )}

         {/* Battle Logs Modal */}
         <AnimatePresence>
            {showHistoryModal && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                  onClick={() => setShowHistoryModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     exit={{ scale: 0.9, y: 20 }}
                     className="glass-premium w-full max-w-2xl max-h-[80vh] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center border border-secondary/20 shadow-lg shadow-secondary/10">
                              <History size={24} className="text-secondary" />
                           </div>
                           <div>
                              <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{t('battle_archives')}</h2>
                              <p className="text-[10px] font-black tracking-[0.4em] opacity-30 uppercase mt-1">{t('full_history')}</p>
                           </div>
                        </div>
                        <button
                           onClick={() => setShowHistoryModal(false)}
                           className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
                        >
                           <X size={20} />
                        </button>
                     </div>

                     <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {room.history.length === 0 ? (
                           <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-10">
                              <History size={64} strokeWidth={1} />
                              <p className="text-sm font-black tracking-[0.3em] uppercase italic">{t('archives_empty')}</p>
                           </div>
                        ) : (
                           [...room.history].reverse().map((roundData, rIdx) => (
                              <div key={rIdx} className="space-y-4">
                                 <div className="flex items-center gap-4">
                                    <span className="text-xs font-black italic text-primary uppercase tracking-widest whitespace-nowrap">{t('engagement_round')} {roundData.round}</span>
                                    <div className="h-px w-full bg-gradient-to-r from-primary/30 to-transparent" />
                                 </div>

                                 <div className="grid md:grid-cols-2 gap-3">
                                    {roundData.results.map((res: any, pIdx: number) => {
                                       const p = room.players[res.playerId];
                                       if (!p) return null;
                                       return (
                                          <div key={pIdx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.07] transition-all">
                                             <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                   {getElementIcon(res.cardElement, 14)}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                   <span className="text-[10px] font-black uppercase tracking-widest truncate">{p.username}</span>
                                                   <span className="text-[8px] font-bold text-white/20 uppercase tabular-nums">{t('used')} {res.cardStars}★ {res.cardElement}</span>
                                                </div>
                                             </div>
                                             <div className="text-right">
                                                <p className={cn(
                                                   "text-sm font-black italic tabular-nums",
                                                   res.change > 0 ? "text-green-500" : res.change < 0 ? "text-red-500" : "text-white/40"
                                                )}>
                                                   {res.change > 0 ? `+${res.change}` : res.change < 0 ? res.change : "±0"}★
                                                </p>
                                                <p className="text-[8px] font-bold opacity-20 uppercase tracking-tighter">New: {res.newTotal}★</p>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
