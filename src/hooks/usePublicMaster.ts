import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";

export interface MasterProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  buffer_time_minutes: number;
  advance_notice_hours: number;
  is_active: boolean;
}

export function usePublicMaster(username: string | undefined) {
  return useQuery({
    queryKey: ["master", "public", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("masters")
        .select(
          "id, username, display_name, bio, avatar_url, buffer_time_minutes, advance_notice_hours, is_active"
        )
        .eq("username", username!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data as MasterProfile;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}