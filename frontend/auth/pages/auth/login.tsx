"use client";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { signInWithOAuth, isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithOAuth("google");
    } catch (error) {
      alert("로그인에 실패했습니다.");
      console.error(error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithOAuth("apple");
    } catch (error) {
      alert("로그인에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? "로그인 중..." : "Google로 로그인"}
      </button>
      <button onClick={handleAppleLogin} disabled={isLoading}>
        {isLoading ? "로그인 중..." : "Apple로 로그인"}
      </button>
    </div>
  );
}
