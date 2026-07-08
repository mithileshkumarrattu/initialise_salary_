"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { window.location.href = "/login"; return; }
      setUser(user); setLoading(false);
    };
    fetchUser();
  }, []);
  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>;
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Finance</h1>
      <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <p className="text-sm text-muted-foreground">Rebuilt from scratch.</p>
      </div>
    </div>
  );
}
