import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface AppointmentRow {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  total_cost: number;
  status: "confirmed" | "cancelled" | "completed";
  clients: { full_name: string; phone_number: string } | null;
  appointment_services: Array<{
    price_snapshot: number;
    duration_snapshot: number;
    services: { name: string } | null;
  }>;
}

export function useMasterAppointments(date: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["master-appointments", user?.id, date];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `id, appointment_date, start_time, end_time, total_cost, status,
           clients(full_name, phone_number),
           appointment_services(price_snapshot, duration_snapshot, services(name))`
        )
        .eq("master_id", user!.id)
        .eq("appointment_date", date)
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data as AppointmentRow[];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "confirmed" | "completed" | "cancelled";
    }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .eq("master_id", user!.id);
      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<AppointmentRow[]>(queryKey);
      queryClient.setQueryData<AppointmentRow[]>(queryKey, (old) =>
        old?.map((a) => (a.id === id ? { ...a, status } : a)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { query, updateStatus };
}