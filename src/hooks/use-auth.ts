"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

export type AuthProfile = {
  id: string;
  email: string | null;
  avatarUrl: string | null;
  displayName: string | null;
};

function toProfile(user: User | null): AuthProfile | null {
  if (!user) return null;
  const metadata = user.user_metadata ?? {};
  const avatarUrl =
    typeof metadata.avatar_url === "string"
      ? metadata.avatar_url
      : typeof metadata.picture === "string"
        ? metadata.picture
        : null;
  const displayName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : null;

  return {
    id: user.id,
    email: user.email ?? null,
    avatarUrl,
    displayName,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(toProfile(data.session?.user ?? null));
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toProfile(session?.user ?? null));
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const supabase = getSupabase();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      throw new Error(error.message);
    }
  }

  async function signOut() {
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  return {
    user,
    authReady,
    signInWithGoogle,
    signOut,
  };
}
