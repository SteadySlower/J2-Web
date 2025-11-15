"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function DashBoard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return (
      <div>
        <button onClick={handleGoToLogin}>로그인하러 가기</button>
      </div>
    );
  }

  const username = user.user_metadata?.full_name || user.email || "사용자";

  return (
    <div>
      <p>hi {username}</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}
