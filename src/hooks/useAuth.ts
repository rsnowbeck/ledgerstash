import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Global auth state to prevent flicker on navigation
let globalSession: Session | null = null;
let globalUser: User | null = null;
let globalLoading = true;
let listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return { session: globalSession, user: globalUser, loading: globalLoading };
}

// Initialize auth listener once
let initialized = false;
function initializeAuth() {
  if (initialized) return;
  initialized = true;

  // Set up auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    globalSession = session;
    globalUser = session?.user ?? null;
    globalLoading = false;
    notifyListeners();
  });

  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    globalSession = session;
    globalUser = session?.user ?? null;
    globalLoading = false;
    notifyListeners();
  });
}

interface UseAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo = "/login", requireAuth = true } = options;
  const navigate = useNavigate();

  // Initialize on first use
  useEffect(() => {
    initializeAuth();
  }, []);

  // Subscribe to global auth state
  const authState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Handle redirect when auth is required but user is not logged in
  useEffect(() => {
    if (!authState.loading && requireAuth && !authState.user) {
      navigate(redirectTo);
    }
  }, [authState.loading, authState.user, navigate, redirectTo, requireAuth]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  return { 
    user: authState.user, 
    session: authState.session, 
    loading: authState.loading, 
    signOut 
  };
}
