"use client";

import { useAuth } from "@/frontend/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type DashBoardProps = {
  user: User;
};

export default function DashBoard({ user }: DashBoardProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const username = user.user_metadata?.full_name || user.email || "사용자";

  return (
    <div>
      <p>hi {username}</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}
