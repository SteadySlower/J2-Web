import LandingPage from "@/frontend/landing-page/LandingPage";
import DashBoard from "@/frontend/dashBoard/DashBoard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return <DashBoard user={session.user} />;
  }

  return <LandingPage />;
}
