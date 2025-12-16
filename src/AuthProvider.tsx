import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase/client';

type User = any;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);

      // When user signs in (either with password or OAuth), ensure profile exists
      if (event === 'SIGNED_IN' && session?.user) {
        await ensureProfileExists(session.user);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    return supabase.auth.signUp({ email, password, options: { data: metadata } });
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
  };

  const ensureProfileExists = async (authUser: any) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      // If profile already exists, do nothing
      if (existingProfile) {
        console.log('[AUTH] Profile already exists for user:', authUser.id);
        return;
      }

      // Create profile for new user (from OAuth or email signup)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
          email: authUser.email,
          // Add other default fields as needed
        });

      if (profileError) {
        console.error('[AUTH] Error creating profile:', profileError);
      } else {
        console.log('[AUTH] Profile created successfully for user:', authUser.id);
      }
    } catch (error) {
      console.error('[AUTH] Error ensuring profile exists:', error);
    }
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthProvider;
