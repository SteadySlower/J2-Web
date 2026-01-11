import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SideBar from "@/frontend/core/components/SideBar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
