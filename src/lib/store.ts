import { create } from 'zustand';
import { AuthState, User, Tenant } from '../types';

interface AuthStore extends AuthState {
  login: (user: User, tenant: Tenant | null) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user, tenant) => set({ 
    user, 
    tenant, 
    isAuthenticated: true,
    isLoading: false
  }),
  logout: () => set({ 
    user: null, 
    tenant: null,
    isAuthenticated: false,
    isLoading: false
  }),
  setLoading: (isLoading) => set({ isLoading })
}));

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open })
}));