import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const AccessDenied = ({ email }: { email?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 text-center space-y-4 bg-background/80 backdrop-blur">
        <h1 className="text-xl font-display">Access Denied</h1>
        <p className="text-sm text-muted-foreground">Family Members Only</p>
        {email ? (
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
        ) : null}
        <div className="space-y-2">
          <Button className="w-full" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
