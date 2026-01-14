import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

export enum Element {
  FIRE = 'Fire',
  ICE = 'Ice',
  WIND = 'Wind',
  EARTH = 'Earth',
  ELECTRIC = 'Electric',
  WATER = 'Water',
}

export interface Card {
  stars: number;
  element: Element;
  id: string;
}

export interface Player {
  id: string;
  username: string;
  hand: Card[];
  stars: number;
  ready: boolean;
  playedCard?: Card;
  hasPlayed: boolean;
}

export enum RoomStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export interface Room {
  code: string;
  maxPlayers: number;
  status: RoomStatus;
  players: Record<string, Player>;
  hostId: string;
  round: number;
  turnOrder: string[];
  currentTurnIndex: number;
  history: any[];
}

interface GameState {
  socket: Socket | null;
  username: string;
  room: Room | null;
  roomsList: any[];
  isConnected: boolean;
  lastLeftRoomCode: string | null;

  connect: () => void;
  setUsername: (username: string) => void;
  createRoom: (maxPlayers: number) => void;
  joinRoom: (code: string) => void;
  leaveRoom: () => void;
  toggleReady: (ready: boolean) => void;
  startGame: () => void;
  playCard: (cardId: string) => void;
  kickPlayer: (targetId: string) => void;
  getRooms: () => void;
  backToLobby: () => void;
  logout: () => void;

  // I18n
  language: 'en' | 'vi';
  setLanguage: (lang: 'en' | 'vi') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  socket: null,
  username: typeof window !== 'undefined' ? sessionStorage.getItem('zoka_username') || '' : '',
  room: null,
  roomsList: [],
  isConnected: false,
  lastLeftRoomCode: null,

  language: 'vi',
  setLanguage: (lang) => set({ language: lang }),

  connect: () => {
    if (get().socket) return;
    const socket = io('http://localhost:3001');

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    socket.on('ROOM_UPDATED', (room) => set({ room }));
    socket.on('ROOM_LIST', (roomsList) => set({ roomsList }));
    socket.on('GAME_STARTED', (room) => set({ room }));
    socket.on('ROUND_STARTED', (room) => set({ room }));
    socket.on('CARD_PLAYED', ({ playerId }) => {
      // Small optimization: if we need to show who played
    });
    socket.on('ROUND_RESULT', (result) => {
      // Handle round result display
      console.log('Round Result:', result);
    });
    socket.on('GAME_ENDED', (room) => {
      set({ room });
      toast.success('BATTLE CONCLUDED!', { description: 'The match has finished.' });
    });
    socket.on('KICKED', () => {
      set({ room: null });
      toast.error('ACCESS REVOKED', { description: 'You have been kicked from the arena.' });
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    });

    set({ socket });
  },

  setUsername: (username: string) => {
    set({ username });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('zoka_username', username);
    }
    get().socket?.emit('ENTER_USERNAME', { username });
  },

  createRoom: (maxPlayers: number) => {
    const { socket, username } = get();
    socket?.emit('CREATE_ROOM', { username, maxPlayers }, (room: Room) => {
      set({ room });
    });
  },

  joinRoom: (code: string) => {
    const { socket, username } = get();
    socket?.emit('JOIN_ROOM', { username, code }, (response: any) => {
      if (response.error) {
        toast.error('DEPLOYMENT FAILED', { description: response.error });
      } else {
        set({ room: response });
        toast.success('SYNC SUCCESSFUL', { description: `Joined sector ${code}` });
      }
    });
  },

  leaveRoom: () => {
    const currentRoom = get().room;
    if (currentRoom) {
      get().socket?.emit('LEAVE_ROOM');
      set({ room: null, lastLeftRoomCode: currentRoom.code });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('zoka_current_room');
      }
      // Reset the flag after 2 seconds to allow re-joining the same room later if desired
      setTimeout(() => set({ lastLeftRoomCode: null }), 2000);
    } else {
      set({ room: null });
    }
  },

  toggleReady: (ready: boolean) => {
    get().socket?.emit('READY', { ready });
  },

  startGame: () => {
    get().socket?.emit('START_GAME');
  },

  playCard: (cardId: string) => {
    get().socket?.emit('PLAY_CARD', { cardId });
  },

  kickPlayer: (targetId: string) => {
    get().socket?.emit('KICK_PLAYER', { targetId });
  },

  getRooms: () => {
    get().socket?.emit('GET_ROOMS', (rooms: any[]) => {
      set({ roomsList: rooms });
    });
  },

  backToLobby: () => {
    get().socket?.emit('BACK_TO_LOBBY');
  },

  logout: () => {
    set({ username: '', room: null });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('zoka_username');
      sessionStorage.removeItem('zoka_current_room');
    }
  },
}));
