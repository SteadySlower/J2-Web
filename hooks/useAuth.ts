"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithOAuth = async (provider: "google" | "apple") => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      throw error;
    }
  };

  return {
    signInWithOAuth,
    signOut,
    isLoading,
  };
}
