import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface MasterSettings {
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

export function useMasterSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["master-settings", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("masters")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as MasterSettings | null;
    },
    enabled: !!user?.id,
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<MasterSettings>) => {
      const { error } = await supabase
        .from("masters")
        .upsert({ id: user!.id, ...updates }, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { query, updateSettings };
}