import { supabase } from '$lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

let authState = $state<AuthState>({
  user: null,
  loading: true,
  initialized: false,
});

export const authStore = {
  get user() {
    return authState.user;
  },
  
  get loading() {
    return authState.loading;
  },
  
  get initialized() {
    return authState.initialized;
  },
  
  get isAuthenticated() {
    return !!authState.user;
  },

  async initialize(): Promise<(() => void) | undefined> {
    if (authState.initialized) return undefined;
    
    try {
      authState.loading = true;
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      authState.user = session?.user ?? null;
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        authState.user = session?.user ?? null;
      });
      
      authState.initialized = true;
      
      // Return cleanup function
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authState.user = null;
      return undefined;
    } finally {
      authState.loading = false;
    }
  },

  async signIn(email: string, password: string) {
    authState.loading = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      authState.user = data.user;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      authState.loading = false;
    }
  },

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    authState.loading = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) throw error;
      
      authState.user = data.user;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      authState.loading = false;
    }
  },

  async signOut() {
    authState.loading = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      authState.user = null;
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      authState.loading = false;
    }
  },

  async updateUser(updates: { email?: string; password?: string; data?: Record<string, any> }) {
    authState.loading = true;
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      
      if (error) throw error;
      
      authState.user = data.user;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      authState.loading = false;
    }
  },
};