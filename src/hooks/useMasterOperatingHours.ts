import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface OperatingHour {
  id: string;
  master_id: string;
  day_of_week: number;
  is_operational: boolean;
  start_time: string;
  end_time: string;
}

export function useMasterOperatingHours() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["master-operating-hours", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operating_hours")
        .select("*")
        .eq("master_id", user!.id)
        .order("day_of_week", { ascending: true });
      if (error) throw error;
      return data as OperatingHour[];
    },
    enabled: !!user?.id,
  });

  const saveHours = useMutation({
    mutationFn: async (
      hours: Array<{
        dow: number;
        is_operational: boolean;
        start_time: string;
        end_time: string;
      }>
    ) => {
      const existing = query.data ?? [];

      for (const h of hours) {
        const existingRow = existing.find((r) => r.day_of_week === h.dow);
        if (existingRow) {
          const { error } = await supabase
            .from("operating_hours")
            .update({
              is_operational: h.is_operational,
              start_time: h.start_time.length === 5 ? h.start_time + ":00" : h.start_time,
              end_time: h.end_time.length === 5 ? h.end_time + ":00" : h.end_time,
            })
            .eq("id", existingRow.id)
            .eq("master_id", user!.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("operating_hours").insert({
            master_id: user!.id,
            day_of_week: h.dow,
            is_operational: h.is_operational,
            start_time: h.start_time.length === 5 ? h.start_time + ":00" : h.start_time,
            end_time: h.end_time.length === 5 ? h.end_time + ":00" : h.end_time,
          });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { query, saveHours };
}