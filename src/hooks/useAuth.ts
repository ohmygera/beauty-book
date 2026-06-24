import { useState, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

// Cache session in module scope to avoid re-fetching on every component mount
let cachedSession: Session | null | undefined = undefined;

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(
    cachedSession !== undefined ? cachedSession : null
  );
  const [isLoading, setIsLoading] = useState(cachedSession === undefined);

  useEffect(() => {
    if (cachedSession !== undefined) {
      setSession(cachedSession);
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      cachedSession = data.session;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      cachedSession = session;
      setSession(session);
      setIsLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, isLoading };
}