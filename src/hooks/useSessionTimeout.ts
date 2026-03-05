import { useEffect, useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const WARNING_BEFORE_MS = 2 * 60 * 1000; // Show warning 2 minutes before timeout

interface UseSessionTimeoutReturn {
  showWarning: boolean;
  remainingSeconds: number;
  extendSession: () => void;
}

export function useSessionTimeout(enabled: boolean = true, timeoutMinutes: number = 30): UseSessionTimeoutReturn {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();
  const countdownRef = useRef<ReturnType<typeof setInterval>>();
  const showWarningRef = useRef(false);

  const signOut = useCallback(async () => {
    setShowWarning(false);
    showWarningRef.current = false;
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, []);

  const resetTimers = useCallback(() => {
    setShowWarning(false);
    showWarningRef.current = false;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const warningDelay = Math.max(timeoutMs - WARNING_BEFORE_MS, 0);

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      showWarningRef.current = true;
      const warningSeconds = Math.min(Math.floor(WARNING_BEFORE_MS / 1000), Math.floor(timeoutMs / 1000));
      setRemainingSeconds(warningSeconds);

      countdownRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningDelay);

    timeoutRef.current = setTimeout(signOut, timeoutMs);
  }, [signOut, timeoutMs]);

  const extendSession = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    if (!enabled || timeoutMinutes <= 0) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        if (!showWarningRef.current) {
          resetTimers();
        }
      }, 1000);
    };

    events.forEach((event) => document.addEventListener(event, handleActivity, { passive: true }));
    resetTimers();

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [enabled, resetTimers, timeoutMinutes]);

  return { showWarning, remainingSeconds, extendSession };
}
