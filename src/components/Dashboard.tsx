'use client';

import { useGameStore, Element } from '@/store/useGameStore';
import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Users, Hash, ArrowRight, Loader2, Gamepad2, ShieldCheck, 
  Zap, X, ChevronRight, Swords, Sparkle, Info, LogOut, 
  Trophy, Activity, BookOpen, User, Flame, Snowflake, 
  Wind, Mountain, Zap as Electric, Droplets, Target, Award, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useParams, useRouter } from 'next/navigation';
import { translations } from '@/i18n/translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ELEMENT_ICONS: Record<Element, any> = {
  [Element.FIRE]: Flame,
  [Element.ICE]: Snowflake,
  [Element.WIND]: Wind,
  [Element.EARTH]: Mountain,
  [Element.ELECTRIC]: Electric,
  [Element.WATER]: Droplets,
};

const ELEMENT_COLORS: Record<Element, string> = {
  [Element.FIRE]: 'text-red-500',
  [Element.ICE]: 'text-cyan-400',
  [Element.WIND]: 'text-emerald-400',
  [Element.EARTH]: 'text-amber-600',
  [Element.ELECTRIC]: 'text-yellow-400',
  [Element.WATER]: 'text-blue-500',
};

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const { 
    username, setUsername, createRoom, joinRoom, 
    roomsList, getRooms, connect, isConnected, 
    room, logout, language, setLanguage
  } = useGameStore();

  const t = (key: keyof typeof translations['en']) => translations[language][key];

  const [nameInput, setNameInput] = useState(username);
  const [roomCode, setRoomCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [activeTab, setActiveTab] = useState<'lobby' | 'rules' | 'profile'>('lobby');

  useEffect(() => {
    connect();
    const interval = setInterval(getRooms, 3000);
    const roomParam = (params?.id as string) || new URLSearchParams(window.location.search).get('room');
    if (roomParam) setRoomCode(roomParam.toUpperCase());
    return () => clearInterval(interval);
  }, [connect, getRooms, params]);

  useEffect(() => {
    if (!username && window.location.pathname === '/dashboard') router.push('/');
  }, [username, router]);

  useEffect(() => {
    if (room && !window.location.pathname.startsWith('/room/')) router.push(`/room/${room.code}`);
  }, [room, router]);

  useEffect(() => {
    if (username && window.location.pathname === '/') router.push('/dashboard');
  }, [username, router]);

  const handleStart = () => {
    if (nameInput.trim()) {
      setUsername(nameInput);
      if (roomCode.length === 6) joinRoom(roomCode);
      else router.push('/dashboard');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="relative">
          <Loader2 className="animate-spin text-primary" size={80} strokeWidth={1} />
          <div className="absolute inset-0 blur-3xl bg-primary/30 animate-pulse" />
        </div>
        <div className="space-y-4 text-center relative z-10">
          <motion.p 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-black tracking-[0.4em] text-white uppercase italic"
          >
            {t('establishing_uplink')}
          </motion.p>
          <p className="text-[10px] font-black tracking-[0.5em] text-primary/60 uppercase">{t('syncing_arena')}</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#020617] font-outfit">
         {/* Background elements same as before but more optimized */}
         <div className="absolute inset-0 cyber-grid opacity-10 [transform:rotateX(60deg)_translateY(-100px)] h-[200%] pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] pointer-events-none" />
         
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ translateY: ['-100vh', '100vh'] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"
            />
         </div>

         <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 max-w-6xl w-full relative z-10">
            {/* Left Side: Lore / Branding */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex flex-col justify-center space-y-12"
            >
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                    <Sparkle size={12} className="text-yellow-500/60" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">{t('strategic_protocol')}</span>
                  </div>
                  <h1 className="text-8xl font-black tracking-tighter italic uppercase leading-none">
                    <span className="text-white block opacity-20">PROJECT</span>
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">ZOKA</span>
                  </h1>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: ShieldCheck, title: t('tactical_depth'), desc: t('tactical_desc') },
                    { icon: Zap, title: t('swift_rounds'), desc: t('swift_desc') },
                    { icon: Users, title: t('multiplayer'), desc: t('multiplayer_desc') },
                    { icon: Trophy, title: t('global_rank'), desc: t('global_desc') }
                  ].map((feat, i) => (
                    <motion.div 
                      key={feat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="glass-premium p-6 rounded-2xl border border-white/5 space-y-2 group hover:border-primary/30 transition-all"
                    >
                       <feat.icon className="text-primary group-hover:scale-110 transition-transform" size={24} />
                       <h3 className="font-black text-xs uppercase tracking-widest text-white/80">{feat.title}</h3>
                       <p className="text-[10px] text-white/30 uppercase tracking-tighter leading-relaxed">{feat.desc}</p>
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Right Side: Login Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center"
            >
               <div className="glass-premium p-8 md:p-12 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Swords size={120} />
                  </div>

                  <div className="relative z-10 space-y-12">
                     <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t('identity_auth')}</h2>
                        <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase">{t('init_profile')}</p>
                     </div>

                     <div className="space-y-8">
                        <div className="relative">
                           <p className="absolute -top-2.5 left-6 px-2 bg-[#020617] text-[9px] font-black tracking-[0.2em] text-white/20 z-10 uppercase italic">{t('operator_designation')}</p>
                           <input
                             type="text"
                             placeholder={t('callsign_placeholder')}
                             value={nameInput}
                             maxLength={15}
                             onChange={(e) => setNameInput(e.target.value)}
                             className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-2xl outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all text-xl font-bold tracking-[0.1em] uppercase placeholder:text-white/5 shadow-inner"
                           />
                           {nameInput && (
                             <motion.div 
                               initial={{ opacity: 0, x: 10 }}
                               animate={{ opacity: 1, x: 0 }}
                               className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/40"
                             >
                               <Sparkle className="animate-spin-slow" size={20} />
                             </motion.div>
                           )}
                        </div>

                        <div className="relative">
                           <p className="absolute -top-2.5 left-6 px-2 bg-[#020617] text-[9px] font-black tracking-[0.2em] text-white/20 z-10 uppercase italic">{t('quick_join_code')}</p>
                           <div className="flex gap-2">
                             <div className="relative flex-1">
                               <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                               <input
                                 type="text"
                                 placeholder="ABCDEF"
                                 value={roomCode}
                                 maxLength={6}
                                 onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                 className="w-full bg-white/[0.03] border border-white/10 p-6 pl-14 rounded-2xl outline-none focus:border-primary/40 transition-all font-mono tracking-[0.3em] text-xl uppercase placeholder:text-white/5"
                               />
                             </div>
                           </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStart}
                          disabled={!nameInput.trim()}
                          className="w-full bg-primary text-white p-6 rounded-2xl font-black text-sm tracking-[0.3em] transition-all shadow-xl shadow-primary/20 disabled:opacity-30 flex items-center justify-center gap-3 relative overflow-hidden italic uppercase"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] animate-shine pointer-events-none" />
                          <span>{t('authorize_deploy')}</span> 
                          <ArrowRight size={18} />
                        </motion.button>
                     </div>

                     <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[8px] font-black tracking-widest text-white/20 uppercase italic">
                        <span>{t('establishing_link')}</span>
                        <div className="flex gap-1">
                           {[...Array(3)].map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ opacity: [0.1, 1, 0.1] }}
                               transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                               className="w-1 h-1 bg-primary rounded-full"
                             />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10 relative font-outfit">
      {/* Background stays elegant */}
      <div className="fixed inset-0 cyber-grid opacity-5 pointer-events-none -z-10" />
      
      {/* Header Enhancement */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-premium p-6 rounded-[2rem] border-white/5 shadow-xl">
         <div className="flex items-center gap-6">
            <motion.div 
               whileHover={{ rotate: [0, -10, 10, 0] }}
               className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
            >
               <Swords size={28} className="text-white" />
            </motion.div>
            <div className="space-y-0.5">
               <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3 leading-none">
                 {t('warzone')}
                 <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono tracking-normal not-italic opacity-50">V5.2</span>
               </h2>
               <div className="flex items-center gap-3">
                 <p className="text-[9px] font-black tracking-[0.3em] text-primary uppercase">{t('identity')}: {username}</p>
                 <div className="w-1 h-1 bg-white/20 rounded-full" />
                 <p className="text-[9px] font-black tracking-[0.3em] text-green-500 uppercase">{t('status_connected')}</p>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
               onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
               className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-xs font-black uppercase tracking-widest"
            >
               {language.toUpperCase()}
            </button>
            <button 
              onClick={logout}
              className="p-4 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl border border-white/5 transition-all group"
            >
              <LogOut size={20} />
            </button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-primary/20 border border-primary/40 text-xs tracking-widest uppercase italic"
            >
              <Plus size={18} /> {t('initiate_sector')}
            </motion.button>
         </div>
      </header>

      {/* Main Content with Tabs */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
         
         {/* Sidebar Stats & Navigation */}
         <div className="lg:col-span-3 space-y-8 h-full">
            {/* Nav Tabs */}
            <nav className="glass-premium p-2 rounded-3xl border-white/5 flex lg:flex-col gap-1">
               {(['lobby', 'rules', 'profile'] as const).map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase italic transition-all relative group",
                     activeTab === tab ? "bg-white text-[#020617]" : "text-white/40 hover:text-white hover:bg-white/5"
                   )}
                 >
                   {tab === 'lobby' && <Activity size={16} />}
                   {tab === 'rules' && <BookOpen size={16} />}
                   {tab === 'profile' && <User size={16} />}
                   <span className="hidden md:inline">
                      {tab === 'lobby' && t('tab_lobby')}
                      {tab === 'rules' && t('tab_rules')}
                      {tab === 'profile' && t('tab_profile')}
                   </span>
                   {activeTab === tab && (
                     <motion.div layoutId="tab-glow" className="absolute inset-0 bg-primary/20 blur-md -z-10 rounded-2xl" />
                   )}
                 </button>
               ))}
            </nav>

            {/* Mock Stats */}
            <div className="glass-premium p-6 rounded-[2rem] border-white/5 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-[9px] font-black tracking-[0.3em] opacity-30 uppercase italic">{t('combat_stats')}</h3>
                  <Trophy size={14} className="text-yellow-500/50" />
               </div>
               
               <div className="space-y-4">
                  {[
                    { label: t('matches_won'), value: "24", color: "text-primary" },
                    { label: t('win_rate'), value: "68%", color: "text-green-500" },
                    { label: t('stars_earned'), value: "1.2k", color: "text-secondary" },
                    { label: t('global_rank'), value: "#421", color: "text-accent" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between items-end border-b border-white/[0.03] pb-2">
                       <span className="text-[8px] font-black tracking-widest uppercase opacity-20">{stat.label}</span>
                       <span className={cn("text-lg font-black italic font-mono leading-none", stat.color)}>{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Quick Infiltration */}
            <div className="glass-premium p-6 rounded-[2rem] border-white/5 space-y-4 group">
               <h3 className="text-[9px] font-black tracking-[0.3em] opacity-30 uppercase italic pl-1">{t('target_code')}</h3>
               <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={16} />
                  <input
                    type="text"
                    placeholder={t('place_code')}
                    value={roomCode}
                    maxLength={6}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 pl-10 rounded-xl outline-none focus:border-primary/30 transition-all font-mono tracking-[0.3em] text-sm uppercase"
                  />
               </div>
               <button
                 onClick={() => joinRoom(roomCode)}
                 disabled={roomCode.length !== 6}
                 className="w-full bg-white text-black p-4 rounded-xl font-black text-[10px] tracking-widest transition-all disabled:opacity-10 uppercase italic"
               >
                 {t('deploy_unit')}
               </button>
            </div>
         </div>

         {/* Content Area */}
         <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
               {activeTab === 'lobby' && (
                 <motion.div 
                   key="lobby"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-6"
                 >
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-3">
                          <Activity size={14} className="text-primary animate-pulse" />
                          <h3 className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase italic">Live Sectors</h3>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className="text-[8px] font-black text-primary/60 tracking-[0.2em] uppercase animate-pulse">Broadcasting Signal</span>
                       </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                       {roomsList.length === 0 ? (
                         <div className="col-span-full glass-premium p-32 rounded-[2.5rem] text-center border-dashed border border-white/10 flex flex-col items-center justify-center gap-6 group">
                            <div className="relative">
                               <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse-slow" />
                               <Users size={48} className="opacity-10 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-white/40 font-black tracking-[0.4em] uppercase text-xs italic leading-none">Awaiting Transmissions</p>
                               <p className="text-[9px] font-black tracking-[0.2em] text-white/10 uppercase">No active battle sectors detected on this frequency.</p>
                            </div>
                            <button 
                              onClick={() => setShowCreateModal(true)}
                              className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black tracking-widest text-white/40 hover:text-white hover:bg-primary/20 transition-all uppercase italic"
                            >
                              Initiate First Sector
                            </button>
                         </div>
                       ) : (
                         roomsList.map((r, i) => (
                           <motion.div 
                             initial={{ opacity: 0, x: 10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.05 }}
                             key={r.code}
                             className="glass-premium p-6 rounded-[2rem] flex flex-col gap-6 hover:bg-white/[0.04] transition-all cursor-pointer border border-white/5 group relative overflow-hidden"
                             onClick={() => joinRoom(r.code)}
                           >
                             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <Swords size={80} />
                             </div>

                             <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-1">
                                   <div className="flex items-center gap-3">
                                      <h4 className="text-4xl font-black tracking-tighter font-mono group-hover:text-primary transition-colors leading-none">{r.code}</h4>
                                      <div className={cn(
                                        "text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase border transition-all",
                                        r.status === 'PLAYING' 
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                                      )}>
                                         {r.status === 'PLAYING' ? 'ENGAGED' : 'OPEN'}
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3 text-[9px] font-black text-white/30 tracking-widest uppercase italic">
                                      <span className="flex items-center gap-2">
                                        <Users size={12} strokeWidth={3} className="text-primary/60" /> 
                                        {r.playerCount} / {r.maxPlayers} UNITS
                                      </span>
                                   </div>
                                </div>
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/40 transition-all">
                                   <ArrowRight size={20} className="text-white/20 group-hover:text-primary transition-colors" />
                                </div>
                             </div>

                             <div className="flex gap-1.5 h-1">
                                {[...Array(r.maxPlayers)].map((_, idx) => (
                                  <div 
                                    key={idx} 
                                    className={cn(
                                      "flex-1 rounded-full transition-colors",
                                      idx < r.playerCount ? "bg-primary" : "bg-white/5"
                                    )} 
                                  />
                                ))}
                             </div>
                           </motion.div>
                         ))
                       )}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'rules' && (
                 <motion.div 
                   key="rules"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="glass-premium p-8 rounded-[2.5rem] border-white/5 space-y-12"
                 >
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <BookOpen size={20} className="text-primary" />
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t('strategic_protocol')}</h2>
                      </div>
                      <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase">{t('strategic_briefing')}</p>
                   </div>

                   <section className="space-y-6">
                      <div className="flex items-center gap-3 border-l-2 border-primary pl-4">
                        <Target size={18} className="text-primary" />
                        <h3 className="text-lg font-black uppercase tracking-widest">{t('combat_objectives')}</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                         {[
                           { title: t('obj_survive'), desc: t('obj_survive_desc') },
                           { title: t('obj_dominance'), desc: t('obj_dominance_desc') },
                           { title: t('obj_attrition'), desc: t('obj_attrition_desc') }
                         ].map((obj, i) => (
                           <div key={i} className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 h-full">
                              <h4 className="font-black text-[10px] uppercase tracking-widest text-primary/80">{obj.title}</h4>
                              <p className="text-[11px] text-white/40 leading-relaxed font-medium">{obj.desc}</p>
                           </div>
                         ))}
                      </div>
                   </section>

                   <section className="space-y-8">
                      <div className="flex items-center gap-3 border-l-2 border-secondary pl-4">
                        <Flame size={18} className="text-secondary" />
                        <h3 className="text-lg font-black uppercase tracking-widest">{t('elemental_matrix')}</h3>
                      </div>
                      <div className="relative p-6 bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden group">
                         <div className="absolute inset-0 animate-rotate-slow opacity-[0.02] pointer-events-none">
                            <Sparkle size={400} className="mx-auto" />
                         </div>
                         
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                            {[
                              { el: Element.FIRE, counter: Element.ICE },
                              { el: Element.ICE, counter: Element.WIND },
                              { el: Element.WIND, counter: Element.EARTH },
                              { el: Element.EARTH, counter: Element.ELECTRIC },
                              { el: Element.ELECTRIC, counter: Element.WATER },
                              { el: Element.WATER, counter: Element.FIRE }
                            ].map(({ el, counter }) => {
                              const Icon = ELEMENT_ICONS[el];
                              const CounterIcon = ELEMENT_ICONS[counter];
                              return (
                                <div key={el} className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-[#020617]/50 border border-white/5 group/el hover:border-white/10 transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className={cn("p-3 rounded-xl bg-white/5", ELEMENT_COLORS[el])}>
                                         <Icon size={24} />
                                      </div>
                                      <ChevronRight size={14} className="opacity-20" />
                                      <div className={cn("p-3 rounded-xl bg-white/5 opacity-40 group-hover/el:opacity-100 transition-opacity", ELEMENT_COLORS[counter])}>
                                         <CounterIcon size={20} />
                                      </div>
                                   </div>
                                   <div className="text-center">
                                      <p className={cn("text-[9px] font-black tracking-widest uppercase italic", ELEMENT_COLORS[el])}>{el}</p>
                                      <p className="text-[8px] font-black tracking-[0.2em] text-white/20 uppercase">{t('countered_by')} {counter}</p>
                                   </div>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                   </section>

                   <section className="space-y-6">
                      <div className="flex items-center gap-3 border-l-2 border-accent pl-4">
                        <Award size={18} className="text-accent" />
                        <h3 className="text-lg font-black uppercase tracking-widest">{t('advanced_mechanics')}</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white/70">
                               <Sparkle size={14} className="text-accent" /> {t('scoring_breakdown')}
                            </h4>
                            <div className="space-y-3 pl-2 border-l border-white/10">
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-accent">{t('mech_standard_win')}</p>
                                <p className="text-[10px] text-white/40">{t('mech_standard_desc')}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-red-400">{t('mech_overpower')}</p>
                                <p className="text-[10px] text-white/40">{t('mech_overpower_desc')}</p>
                              </div>
                               <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-blue-400">{t('mech_draw')}</p>
                                <p className="text-[10px] text-white/40">{t('mech_draw_desc')}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-white/60">{t('mech_perfect_draw')}</p>
                                <p className="text-[10px] text-white/40">{t('mech_perfect_draw_desc')}</p>
                              </div>
                            </div>
                         </div>
                         <div className="glass-premium p-6 rounded-3xl border-white/5 space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white/70">
                               <Activity size={14} className="text-primary" /> {t('auto_deploy')}
                            </h4>
                            <p className="text-xs text-white/40 leading-relaxed italic">
                               {t('auto_deploy_desc')}
                            </p>
                         </div>
                      </div>
                   </section>
                 </motion.div>
               )}

               {activeTab === 'profile' && (
                 <motion.div 
                   key="profile"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="glass-premium p-12 rounded-[2.5rem] border-white/5 flex flex-col items-center gap-8 group"
                 >
                    <div className="relative">
                       <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse-slow" />
                       <div className="w-40 h-40 bg-white/5 rounded-full border-2 border-primary/40 flex items-center justify-center relative overflow-hidden">
                          <User size={80} className="text-primary/20" />
                           <div className="absolute bottom-0 inset-x-0 h-1/3 bg-primary/20 backdrop-blur-md flex items-center justify-center">
                             <span className="text-[10px] font-black tracking-widest uppercase">{t('rank_elite')}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                       <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{username}</h2>
                       <p className="text-[10px] font-black tracking-[0.5em] text-primary/60 uppercase">{t('registered_unit')}</p>
                    </div>

                    <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '74%' }}
                         className="h-full bg-gradient-to-r from-primary to-secondary"
                       />
                    </div>
                    <div className="flex justify-between w-full max-w-md text-[8px] font-black tracking-widest text-white/20 uppercase italic">
                       <span>Exp: 24,500 / 30,000</span>
                       <span>Level 42</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                       {[
                         { title: t('fav_element'), value: "Electric", icon: Electric, color: "text-yellow-400" },
                         { title: t('highest_stars'), value: "98 pts", icon: Star, color: "text-accent" },
                       ].map((stat, i) => {
                         const Icon = stat.icon;
                         return (
                           <div key={i} className="glass-premium p-6 rounded-3xl border-white/5 flex flex-col items-center gap-2 group-hover:scale-[1.02] transition-transform">
                              <Icon size={24} className={cn("opacity-50", stat.color)} />
                              <span className="text-[8px] font-black tracking-widest uppercase opacity-20">{stat.title}</span>
                              <span className="text-xl font-black italic uppercase leading-none">{stat.value}</span>
                           </div>
                         );
                       })}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* Simplified Selection Mode indicator / Global Status */}
      <footer className="mt-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[8px] font-black tracking-[0.4em] text-white/10 uppercase italic">
         <div className="flex items-center gap-4">
            <span className="animate-pulse text-primary/40">{t('broadcasting_status')}</span>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <span>{t('region')}</span>
         </div>
         <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Terminals</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Protocol v.5.0</a>
         </div>
      </footer>

      {/* Create Room Modal - Refined */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <motion.div
               layoutId="sector-modal"
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="glass-premium p-10 md:p-14 rounded-[3rem] w-full max-w-lg border border-white/10 relative shadow-[0_0_100px_rgba(168,85,247,0.1)]"
             >
               <button 
                 onClick={() => setShowCreateModal(false)}
                 className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
               >
                 <X size={28} />
               </button>

               <div className="text-center mb-12 space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mx-auto mb-6">
                     <Plus size={32} className="text-primary" />
                  </div>
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{t('initiate_sector_modal')}</h2>
                  <p className="text-primary/40 text-[10px] font-black tracking-[0.5em] uppercase">{t('configure_tactical')}</p>
               </div>

               <div className="space-y-12">
                 <div className="space-y-8 bg-white/[0.02] p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                       <Users size={120} />
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 italic">{t('units_limit')}</label>
                          <p className="text-[9px] font-black text-white/20 uppercase">{t('deployment_capacity')}</p>
                       </div>
                       <span className="text-7xl font-black text-primary italic font-mono tracking-tighter leading-none">{maxPlayers}</span>
                    </div>
                    
                    <div className="relative pt-4">
                       <input 
                        type="range" min="4" max="100" value={maxPlayers} 
                        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between mt-4 text-[9px] font-black tracking-widest text-white/20 uppercase italic">
                          <span>Min: 4</span>
                          <span>Max: 100</span>
                       </div>
                    </div>
                 </div>

                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => { createRoom(maxPlayers); setShowCreateModal(false); }}
                   className="w-full bg-primary text-white p-7 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 border border-primary/40 italic uppercase tracking-[0.2em] relative group"
                 >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                       {t('deploy_sector')} <ArrowRight size={24} />
                    </span>
                 </motion.button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


