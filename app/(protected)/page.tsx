import DashBoard from "@/frontend/dashBoard/pages/DashBoard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(session?.access_token);

  if (session?.user) {
    return <DashBoard user={session.user} />;
  }

  redirect("/landing");
}
