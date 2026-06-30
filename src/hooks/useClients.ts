import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface Client {
  id: string;
  master_id: string;
  full_name: string;
  phone_number: string;
  is_blacklisted: boolean;
  created_at: string;
}

export function useClients() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["clients", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, master_id, full_name, phone_number, is_blacklisted, created_at")
        .eq("master_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user?.id,
  });

  const toggleBlacklist = useMutation({
    mutationFn: async ({ id, isBlacklisted }: { id: string; isBlacklisted: boolean }) => {
      const { error } = await supabase
        .from("clients")
        .update({ is_blacklisted: isBlacklisted })
        .eq("id", id)
        .eq("master_id", user!.id);
      if (error) throw error;
    },
    onMutate: async ({ id, isBlacklisted }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Client[]>(queryKey);
      queryClient.setQueryData<Client[]>(queryKey, (old) =>
        old?.map((c) => (c.id === id ? { ...c, is_blacklisted: isBlacklisted } : c)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { query, toggleBlacklist };
}
