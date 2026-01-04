import { Button } from "@/components/ui/button";

const AccessDenied = ({ email }: { email?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 text-center space-y-4 bg-background shadow-sm">
        <h1 className="text-xl font-display text-foreground">Access Denied</h1>
        <p className="text-sm text-foreground">Family Members Only</p>
        {email ? (
          <p className="text-sm text-foreground">Signed in as {email}</p>
        ) : null}
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={async () => {
              const { supabase } = await import("@/lib/supabaseClient");
              await supabase.auth.signOut();
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
