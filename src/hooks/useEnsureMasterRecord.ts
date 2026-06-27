import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/config/supabase";

const checkedUserIds = new Set<string>();

export function useEnsureMasterRecord() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (checkedUserIds.has(user.id)) return;

    const ensureMaster = async () => {
      checkedUserIds.add(user.id);

      const baseUsername = (user.email?.split("@")[0] ?? "master")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const username = `${baseUsername}_${user.id.slice(0, 6)}`;

      await supabase.from("masters").upsert(
        {
          id: user.id,
          username,
          display_name: user.email?.split("@")[0] ?? "Мастер",
          buffer_time_minutes: 15,
          advance_notice_hours: 2,
          is_active: true,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
    };

    ensureMaster();
  }, [user?.id]);
}
