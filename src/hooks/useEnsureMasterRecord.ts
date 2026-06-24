import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/config/supabase";

export function useEnsureMasterRecord() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ensureMaster = async () => {
      const { data: existing } = await supabase
        .from("masters")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (existing) return;

      const baseUsername = (user.email?.split("@")[0] ?? "master")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const username = `${baseUsername}_${user.id.slice(0, 6)}`;

      await supabase.from("masters").insert({
        id: user.id,
        username,
        display_name: user.email?.split("@")[0] ?? "Мастер",
        buffer_time_minutes: 15,
        advance_notice_hours: 2,
        is_active: true,
      });
    };

    ensureMaster();
  }, [user?.id]);
}