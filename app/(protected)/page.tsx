import Schedule from "@/frontend/schedule/pages/schedule";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return <Schedule />;
  }

  redirect("/landing");
}
