'use client';

import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import GameView from '@/components/Game';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function RoomPage() {
  const { room, joinRoom, username, isConnected, connect, lastLeftRoomCode } = useGameStore();
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  // Persist room state across reloads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (room) {
        sessionStorage.setItem('zoka_current_room', room.code);
      } else {
        sessionStorage.removeItem('zoka_current_room');
      }
    }
  }, [room]);

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  useEffect(() => {
    if (isConnected && username && !room) {
      const savedRoom = sessionStorage.getItem('zoka_current_room');
      const targetRoom = (id as string) || savedRoom;

      // If we just left this room, don't try to re-join it.
      if (targetRoom && targetRoom === lastLeftRoomCode) {
        router.push('/dashboard');
        return;
      }

      if (targetRoom) {
        joinRoom(targetRoom);
      } else if (window.location.pathname !== '/') {
        router.push('/');
      }
    }
  }, [isConnected, username, room, id, joinRoom, router, lastLeftRoomCode]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={48} />
          <p className="text-white/40 font-black tracking-widest uppercase text-[10px]">Synchronizing Sector Data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="game"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <GameView />
        </motion.div>
      </AnimatePresence>

      {/* Ambient background particles/glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>
    </main>
  );
}
