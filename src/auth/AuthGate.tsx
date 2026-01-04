import { ReactNode, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ALLOWED_EMAILS } from "@/config/allowedEmails";
import AccessDenied from "@/pages/AccessDenied";
import { Button } from "@/components/ui/button";

interface Props { children: ReactNode }

const AuthGate = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const init = async () => {
      const { supabase } = await import("@/lib/supabaseClient");
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
      unsubscribe = () => sub.subscription.unsubscribe();
    };
    void init();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { supabase } = await import("@/lib/supabaseClient");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-xl border p-6 text-center space-y-4 bg-background shadow-sm">
          <h1 className="text-xl font-display text-foreground">Family Album</h1>
          <p className="text-sm text-foreground">Sign in to continue</p>
          <Button onClick={signInWithGoogle} className="w-full">Sign in with Google</Button>
        </div>
      </div>
    );
  }

  const email = session.user.email?.toLowerCase() ?? "";
  const allowed = ALLOWED_EMAILS.map((e) => e.toLowerCase().trim()).includes(email);

  if (!allowed) {
    return <AccessDenied email={email} />;
  }

  return <>{children}</>;
};

export default AuthGate;
