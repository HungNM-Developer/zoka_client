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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GameView() {
  const router = useRouter();
  const { room, socket, leaveRoom, toggleReady, startGame, playCard, username, kickPlayer, backToLobby } = useGameStore();
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
    toast.success('LINK COPIED', { description: 'Invite link has been copied to clipboard.' });
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
                <h2 className="text-5xl font-black italic tracking-tighter text-glow mb-2 uppercase">Round {lastRoundResults.round} Analysis</h2>
                <p className="text-white/20 font-black tracking-[0.5em] uppercase text-xs italic">Intelligence Report Compiled</p>
             </motion.div>

             <div className="w-full max-w-3xl space-y-4 mb-20">
                {lastRoundResults.results.map((res: any, i: number) => {
                  const p = room.players[res.playerId];
                  return (
                    <motion.div 
                      key={res.playerId}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xl">{p?.username[0].toUpperCase()}</div>
                          <div className="text-left">
                             <p className="text-xl font-black uppercase tracking-widest">{p?.username}</p>
                             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Card: {res.cardStars}★</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className={cn(
                            "text-3xl font-black italic tabular-nums flex items-center gap-2",
                            res.change > 0 ? "text-green-500" : res.change < 0 ? "text-red-500" : "text-white/40"
                          )}>
                             {res.change > 0 ? `+${res.change}` : res.change < 0 ? res.change : "±0"}
                             <Star size={20} className={res.change > 0 ? "fill-green-500" : res.change < 0 ? "fill-red-500" : "fill-white/20"} />
                          </div>
                          <div className="h-10 w-px bg-white/10" />
                          <div className="text-right">
                             <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">Updated Rating</p>
                             <p className="text-2xl font-black italic text-yellow-500">{res.newTotal}★</p>
                          </div>
                       </div>
                    </motion.div>
                  );
                })}
             </div>

             <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Protocol Restarting In</span>
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
            <h1 className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">ZOKA ARENA</h1>
            <p className="text-[8px] font-black tracking-[0.4em] opacity-30 mt-0.5">SECTOR: {room.code}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[8px] font-black tracking-[0.3em] opacity-30 uppercase">Commander Rating</span>
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
        <div className="flex-grow flex flex-col items-center justify-center p-8 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Recruitment Phase</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-glow">Boarding Protocol</h2>
             <div className="flex items-center justify-center gap-4">
               <p className="text-white/20 text-xs font-bold tracking-[0.4em] uppercase">Sector Access: {room.code}</p>
               <button 
                 onClick={copyInviteLink}
                 className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all"
               >
                 <Share2 size={12} /> Copy Invite
               </button>
             </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {players.map((p) => (
              <motion.div 
                layout
                key={p.id} 
                className={cn(
                  "glass-premium p-8 rounded-[2.5rem] flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-500 border border-white/5",
                  p.ready ? 'border-green-500/30 bg-green-500/5' : 'opacity-60'
                )}
              >
                {isHost && p.id !== socket?.id && (
                  <button 
                    onClick={() => kickPlayer(p.id)}
                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all border border-red-500/20"
                    title="Kick Combatant"
                  >
                    <UserMinus size={14} />
                  </button>
                )}
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl relative",
                  p.ready ? 'bg-green-500 text-white' : 'bg-white/5 text-white/20'
                )}>
                   {p.username[0].toUpperCase()}
                </div>
                <div className="text-center space-y-1">
                  <p className="font-black tracking-widest text-xs uppercase">{p.username} {p.id === socket?.id && '(ME)'}</p>
                   <span className={cn(
                     "text-[8px] font-black tracking-widest uppercase",
                     p.ready ? 'text-green-500' : 'text-white/10'
                   )}>
                    {p.ready ? 'READY TO STRIKE' : 'PREPARING'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleReady(!me?.ready)}
              className={cn(
                "px-12 py-5 rounded-2xl font-black tracking-[0.3em] text-sm transition-all border",
                me?.ready ? 'bg-green-500 border-green-400 shadow-2xl shadow-green-500/20' : 'bg-white/5 border-white/10'
              )}
            >
              {me?.ready ? 'READY' : 'MARK READY'}
            </motion.button>
            
            {isHost && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                disabled={players.length < 4 || players.some(p => !p.ready)}
                className="px-12 py-5 rounded-2xl bg-primary text-white font-black tracking-[0.3em] text-sm disabled:opacity-20 shadow-2xl shadow-primary/40 border border-primary/50"
              >
                INITIALIZE BATTLE
              </motion.button>
            )}
          </div>
        </div>
      ) : room.status === RoomStatus.PLAYING ? (
        <div className="flex-grow grid lg:grid-cols-12 gap-0 overflow-hidden">
          
          {/* Tactical Sidebar (Standings) */}
          <aside className="lg:col-span-2 border-r border-white/5 bg-black/40 p-4 flex flex-col gap-4 overflow-hidden relative">
             <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                   <Activity size={12} className="text-primary" />
                   <h3 className="text-[9px] font-black tracking-[0.4em] opacity-30 uppercase">Standings</h3>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 transition-all"
                >
                   <History size={10} className="text-secondary" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-secondary">Logs</span>
                </button>
             </div>

             <div className="flex-grow space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                {players.sort((a,b) => b.stars - a.stars).map((p, idx) => (
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
                <h4 className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase px-1">Element Clusters</h4>
                <div className="grid grid-cols-2 gap-2">
                   {Object.entries(elementTotals).map(([el, total]) => (
                      <div key={el} className="bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col items-center">
                         <span className="text-[7px] font-black opacity-30 uppercase mb-0.5">{el.substring(0,3)}</span>
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
                     <span className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase">Engagement Round</span>
                     <span className="text-2xl font-black italic tracking-tighter text-primary">0{room.round} <span className="text-white/20">/ 10</span></span>
                  </div>
                  <div className="h-10 w-px bg-white/5" />
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase">Local Time Remaining</span>
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
                     {myTurn ? "COMMANDER AUTHORIZED" : "INTEL UPLOADING..."}
                  </span>
               </div>
            </div>

            {/* Tabletop */}
            <div className="flex-grow p-8 flex flex-col items-center justify-center relative bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_70%)] overflow-y-auto no-scrollbar">
               <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

               <div className="flex flex-wrap justify-center gap-8 relative z-10 max-w-4xl">
                  <AnimatePresence>
                    {players.filter(p => p.hasPlayed).map((p) => (
                       <motion.div
                        key={p.id}
                        initial={{ scale: 0, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="relative"
                       >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40">
                             <span className="text-[7px] font-black tracking-[0.3em] uppercase">{p.username}</span>
                          </div>
                          <CardComponent 
                            element={p.playedCard?.element || Element.FIRE} 
                            stars={p.playedCard?.stars || 0} 
                            disabled 
                            size="md"
                          />
                       </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {players.filter(p => p.hasPlayed).length === 0 && (
                     <div className="flex flex-col items-center justify-center gap-6 opacity-10">
                        <Swords size={120} strokeWidth={1} />
                        <p className="text-xl font-black tracking-[1em] italic uppercase">Awaiting Clash</p>
                     </div>
                  )}
               </div>

               {/* Matrix floating button */}
               <div className="absolute bottom-8 left-8 z-20 group">
                  <div className="bg-black/60 border border-white/10 rounded-full p-4 flex items-center gap-4 hover:bg-black/80 transition-all cursor-help border-primary/20">
                     <Zap size={20} className="text-primary animate-pulse" />
                     <div className="absolute bottom-full left-0 mb-4 w-64 glass-premium p-6 rounded-[2rem] border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-2xl z-50">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/5 flex items-center gap-2">
                           <Swords size={12} /> Tactical Guide
                        </p>
                        <div className="space-y-3 text-[10px] font-bold">
                           <div className="flex items-center justify-between text-red-400/80">
                              <span>FIRE</span> <ArrowRight size={10}/> <span>ICE</span>
                           </div>
                           <div className="flex items-center justify-between text-cyan-400/80">
                              <span>ICE</span> <ArrowRight size={10}/> <span>WIND</span>
                           </div>
                           <div className="flex items-center justify-between text-emerald-400/80">
                              <span>WIND</span> <ArrowRight size={10}/> <span>EARTH</span>
                           </div>
                           <div className="flex items-center justify-between text-amber-600/80">
                              <span>EARTH</span> <ArrowRight size={10}/> <span>ELECTRIC</span>
                           </div>
                           <div className="flex items-center justify-between text-yellow-400/80">
                              <span>ELECTRIC</span> <ArrowRight size={10}/> <span>WATER</span>
                           </div>
                           <div className="flex items-center justify-between text-blue-400/80">
                              <span>WATER</span> <ArrowRight size={10}/> <span>FIRE</span>
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
                   <h3 className="text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">My Inventory</h3>
                </div>
                <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                   <span className="text-[9px] font-black text-primary">{me?.hand.length} Modules</span>
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
                      EXECUTE DEPLOYMENT <Gavel size={18} />
                    </motion.button>
                  </motion.div>
                )}
             </AnimatePresence>

             <div className="flex-grow overflow-y-auto pr-2 no-scrollbar">
                <div className="grid grid-cols-3 gap-3">
                  <AnimatePresence>
                    {me?.hand.sort((a,b) => a.stars - b.stars).map((card, idx) => (
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
                   <p className="text-[9px] font-black tracking-[0.2em] opacity-40 uppercase">Waiting for {currentTurnPlayer.username}</p>
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
               <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Victory Tally</h2>
               <p className="text-white/20 font-black tracking-[0.6em] uppercase text-xs italic">Protocol Session Terminated</p>
            </div>
            
            <div className="w-full max-w-2xl space-y-3">
               {players.sort((a,b) => b.stars - a.stars).map((p, i) => (
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
                          <p className="text-[8px] font-black opacity-30 tracking-widest uppercase">{i === 0 ? 'Arena Superior' : 'Combatant'}</p>
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
                  REDEPLOY TO LOBBY
                </motion.button>
              )}
              
              <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={handleLeave}
                 className="bg-white/5 hover:bg-white/10 text-white px-12 py-5 rounded-2xl font-black text-sm tracking-[0.3em] shadow-2xl uppercase italic border border-white/10"
              >
                 EXIT ARENA
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
                         <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Battle Archives</h2>
                         <p className="text-[10px] font-black tracking-[0.4em] opacity-30 uppercase mt-1">Full Engagement History</p>
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
                         <p className="text-sm font-black tracking-[0.3em] uppercase italic">Archives Empty</p>
                      </div>
                   ) : (
                      [...room.history].reverse().map((roundData, rIdx) => (
                         <div key={rIdx} className="space-y-4">
                            <div className="flex items-center gap-4">
                               <span className="text-xs font-black italic text-primary uppercase tracking-widest whitespace-nowrap">Round {roundData.round}</span>
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
                                              <span className="text-[8px] font-bold text-white/20 uppercase tabular-nums">Used {res.cardStars}★ {res.cardElement}</span>
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
