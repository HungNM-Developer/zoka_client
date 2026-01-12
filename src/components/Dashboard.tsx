'use client';

import { useGameStore } from '@/store/useGameStore';
import { useState, useEffect } from 'react';
import { Plus, Users, Hash, ArrowRight, Loader2, Gamepad2, ShieldCheck, Zap, X, ChevronRight, Swords, Sparkle, Info, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useParams, useRouter } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const { username, setUsername, createRoom, joinRoom, roomsList, getRooms, connect, isConnected, room, logout } = useGameStore();
  const [nameInput, setNameInput] = useState(username);
  const [roomCode, setRoomCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(8);

  useEffect(() => {
    connect();
    const interval = setInterval(getRooms, 3000);
    
    // Auto-fill room code from URL params or search
    const roomParam = (params?.id as string) || new URLSearchParams(window.location.search).get('room');
    if (roomParam) {
      setRoomCode(roomParam.toUpperCase());
    }

    return () => clearInterval(interval);
  }, [connect, getRooms, params]);

  // Redirect to "/" if accessing /dashboard without username
  useEffect(() => {
    if (!username && window.location.pathname === '/dashboard') {
      router.push('/');
    }
  }, [username, router]);

  // Sync route with room state
  useEffect(() => {
    if (room && !window.location.pathname.startsWith('/room/')) {
      router.push(`/room/${room.code}`);
    }
  }, [room, router]);

  // If on "/" and have username, go to "/dashboard"
  useEffect(() => {
    if (username && window.location.pathname === '/') {
      router.push('/dashboard');
    }
  }, [username, router]);

  const handleStart = () => {
    if (nameInput.trim()) {
      setUsername(nameInput);
      if (roomCode.length === 6) {
        joinRoom(roomCode);
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#020617]">
        <div className="relative">
          <Loader2 className="animate-spin text-primary" size={80} strokeWidth={1} />
          <div className="absolute inset-0 blur-3xl bg-primary/30 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-2xl font-black tracking-[0.4em] text-white/80 uppercase italic">Re-aligning Reality</p>
          <p className="text-[10px] font-black tracking-[0.5em] text-primary/40 uppercase">Connecting to Arena Hub...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617] font-outfit">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 perspective-1000 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_translateY(-100px)] opacity-10" />
         </div>
         
         {/* Moving Scanline */}
         <motion.div 
           animate={{ translateY: ['-100vh', '100vh'] }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent z-0 opacity-30"
         />

         {/* Ambient Glows */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
         
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-premium p-8 md:p-12 rounded-3xl w-full max-w-lg flex flex-col items-center gap-10 relative z-10 border border-white/5 shadow-2xl overflow-hidden"
         >
            <div className="relative group">
               <div className="absolute -inset-8 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000 animate-pulse" />
               <motion.div 
                animate={{ rotate: [1, -1, 1], y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent p-[1px] rounded-2xl shadow-xl relative z-10"
               >
                  <div className="w-full h-full bg-[#020617] rounded-[0.95rem] flex items-center justify-center">
                    <Swords size={40} className="text-white opacity-80" />
                  </div>
               </motion.div>
            </div>

            <div className="text-center space-y-1 relative">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 mb-2 backdrop-blur-md"
               >
                  <Sparkle size={10} className="text-yellow-500/60" />
                  <span className="text-[8px] font-black tracking-[0.4em] text-white/30 uppercase italic">v4.2 PROTOTYPE</span>
               </motion.div>
               
               <div className="relative">
                 <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent italic leading-none uppercase">
                    ZOKA
                 </h1>
               </div>

               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="flex items-center justify-center gap-4"
               >
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/30" />
                  <span className="text-sm font-black tracking-[0.6em] text-primary/60 uppercase italic">ARENA</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/30" />
               </motion.div>
            </div>
            
            <div className="w-full space-y-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6 }}
                 className="relative group"
               >
                  <p className="absolute -top-2 left-5 px-2 bg-[#0a0a1a] text-[8px] font-black tracking-[0.2em] text-primary/60 z-10 uppercase italic">COMS ID</p>
                  <input
                    type="text"
                    placeholder="Enter designation..."
                    value={nameInput}
                    maxLength={15}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all text-center text-xl font-bold tracking-[0.1em] uppercase placeholder:text-white/10 shadow-inner"
                  />
               </motion.div>

               <motion.button
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleStart}
                 disabled={!nameInput.trim()}
                 className="w-full bg-white text-black p-5 rounded-2xl font-black text-sm tracking-[0.3em] transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3 group relative overflow-hidden italic uppercase"
               >
                 <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                 <span className="relative z-10">AUTHORIZE ACCESS</span> 
                 <Zap size={16} className="relative z-10 fill-black" />
               </motion.button>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto flex flex-col gap-16 relative font-outfit">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
         {[...Array(8)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               y: [0, -60, 0],
               opacity: [0.05, 0.15, 0.05],
             }}
             transition={{ duration: 12 + i * 2, repeat: Infinity }}
             className="absolute w-[1px] h-[1px] bg-primary/30 rounded-full"
             style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
           />
         ))}
      </div>

      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-white/5 pb-10">
         <div className="space-y-4">
            <motion.div 
               initial={{ x: -10, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-4"
            >
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Swords size={24} className="text-primary" />
               </div>
               <div className="space-y-0.5">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">WARZONE</h2>
                  <p className="text-[8px] font-black tracking-[0.5em] text-primary/50 uppercase">Network Command</p>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="flex items-center gap-4 text-white/40 text-[9px] font-black tracking-[0.3em] uppercase bg-white/[0.02] px-4 py-2 rounded-full border border-white/5"
            >
               <div className="flex items-center gap-2">
                  <span className="opacity-30 italic">ID:</span>
                  <span className="text-white/80 font-mono tracking-widest">{username}</span>
               </div>
               <div className="w-[1px] h-2 bg-white/10" />
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                  <span className="text-green-500/60">ONLINE</span>
               </div>
               <div className="w-[1px] h-2 bg-white/10" />
               <button onClick={logout} className="hover:text-red-500 transition-colors">
                 <LogOut size={12} />
               </button>
            </motion.div>
         </div>
         
         <motion.button
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           whileHover={{ scale: 1.02, y: -2 }}
           whileTap={{ scale: 0.98 }}
           onClick={() => setShowCreateModal(true)}
           className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-primary/20 border border-primary/40 group relative italic text-sm tracking-widest uppercase"
         >
           <Plus size={18} /> INITIATE SECTOR
         </motion.button>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
         {/* Sidebar */}
         <div className="lg:col-span-4 flex flex-col gap-10">
            <section className="space-y-4">
               <div className="flex items-center gap-2 pl-1 opacity-30">
                  <h3 className="text-[9px] font-black tracking-[0.4em] uppercase italic">Infiltration</h3>
               </div>
               <motion.div className="glass-premium p-6 rounded-3xl flex flex-col gap-6 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="space-y-3">
                     <p className="text-[8px] font-black tracking-[0.3em] text-primary/60 uppercase pl-1">Target Code</p>
                     <div className="relative">
                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                        <input
                          type="text"
                          placeholder="ABCDEF"
                          value={roomCode}
                          maxLength={6}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                          className="w-full bg-white/[0.02] border border-white/10 p-5 pl-12 rounded-xl outline-none focus:border-primary/30 transition-all font-mono tracking-[0.4em] text-2xl uppercase"
                        />
                     </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => joinRoom(roomCode)}
                    disabled={roomCode.length !== 6}
                    className="w-full bg-white text-black p-5 rounded-xl font-black text-xs tracking-widest transition-all disabled:opacity-10 uppercase italic"
                  >
                    DEPLOY UNIT
                  </motion.button>
               </motion.div>
            </section>
         </div>

         {/* Main List */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[9px] font-black tracking-[0.4em] opacity-30 uppercase italic">Active Sectors</h3>
               <div className="text-[8px] font-black text-primary/60 tracking-[0.2em] uppercase">Status: Broadcasting</div>
            </div>
            
            <div className="grid gap-4">
               <AnimatePresence mode="popLayout">
                  {roomsList.length === 0 ? (
                    <motion.div className="glass-premium p-24 rounded-3xl text-center border-dashed border border-white/5 flex flex-col items-center justify-center gap-6">
                       <Users size={40} className="opacity-5" />
                       <p className="text-white/20 font-black tracking-[0.3em] uppercase text-[10px] italic">Scouring Perimeter for signals...</p>
                    </motion.div>
                  ) : (
                    roomsList.map((r, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        layout
                        key={r.code}
                        className="glass-premium p-6 rounded-2xl flex items-center justify-between hover:bg-white/[0.03] transition-all cursor-pointer border border-white/5 group"
                        onClick={() => joinRoom(r.code)}
                      >
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                              <span className="font-mono font-black text-xl text-white/10 group-hover:text-primary">#</span>
                           </div>
                           <div className="space-y-1.5">
                              <div className="flex items-center gap-4">
                                 <h4 className="text-3xl font-black tracking-tight font-mono leading-none group-hover:text-primary transition-colors">{r.code}</h4>
                                 <div className={cn(
                                   "text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase border transition-all",
                                   r.status === 'PLAYING' 
                                   ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                   : 'bg-green-500/10 text-green-500 border-green-500/20'
                                 )}>
                                    {r.status === 'PLAYING' ? 'ENGAGED' : 'OPEN'}
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 text-[9px] font-black text-white/20 tracking-widest uppercase italic">
                                 <span className="flex items-center gap-2"><Users size={12} strokeWidth={3} /> {r.playerCount} / {r.maxPlayers} UNITS</span>
                              </div>
                           </div>
                        </div>
                        <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                      </motion.div>
                    ))
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Simplified Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-premium p-10 rounded-3xl w-full max-w-md border border-white/10 relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10 space-y-2">
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase">SECTOR SETUP</h2>
                 <p className="text-primary/40 text-[9px] font-black tracking-[0.4em] uppercase">Configure Battle Scale</p>
              </div>

              <div className="space-y-10">
                <div className="space-y-6 bg-white/[0.02] p-8 rounded-2xl border border-white/5 shadow-inner">
                   <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black tracking-widest uppercase opacity-40 italic">UNITS LIMIT</label>
                      <span className="text-5xl font-black text-primary italic font-mono tracking-tighter">{maxPlayers}</span>
                   </div>
                   
                   <input 
                    type="range" min="4" max="100" value={maxPlayers} 
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    className="w-full accent-primary h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                   />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { createRoom(maxPlayers); setShowCreateModal(false); }}
                  className="w-full bg-primary text-white p-6 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 border border-primary/40 italic uppercase tracking-widest"
                >
                  DEPLOY SECTOR
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
