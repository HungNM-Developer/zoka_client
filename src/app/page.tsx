'use client';

import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import GameView from '@/components/Game';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { room, isConnected, connect, username, joinRoom, lastLeftRoomCode } = useGameStore();

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
      if (savedRoom && savedRoom !== lastLeftRoomCode) {
        joinRoom(savedRoom);
      }
    }
  }, [isConnected, username, room, joinRoom, lastLeftRoomCode]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Dashboard />

      {/* Ambient background particles/glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>
    </main>
  );
}
