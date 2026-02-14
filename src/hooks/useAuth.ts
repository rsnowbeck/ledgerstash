import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

// Global auth state to prevent flicker on navigation
let globalSession: Session | null = null;
let globalUser: User | null = null;
let globalLoading = true;
let listeners: Set<() => void> = new Set();

// Cache the snapshot object to prevent infinite re-renders
let cachedSnapshot = { session: globalSession, user: globalUser, loading: globalLoading };

function updateSnapshot() {
  cachedSnapshot = { session: globalSession, user: globalUser, loading: globalLoading };
}

function notifyListeners() {
  updateSnapshot();
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return cachedSnapshot;
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

  const { data: isAdmin = false } = useQuery({
    queryKey: ["user-is-admin", authState.user?.id],
    queryFn: async () => {
      if (!authState.user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: authState.user.id,
        _role: "admin",
      });
      return !!data;
    },
    enabled: !!authState.user,
    staleTime: 5 * 60 * 1000,
  });

  const { data: isOwner = false } = useQuery({
    queryKey: ["user-is-owner", authState.user?.id],
    queryFn: async () => {
      if (!authState.user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: authState.user.id,
        _role: "owner",
      });
      return !!data;
    },
    enabled: !!authState.user,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    user: authState.user, 
    session: authState.session, 
    loading: authState.loading, 
    isAdmin,
    isOwner,
    signOut 
  };
}
