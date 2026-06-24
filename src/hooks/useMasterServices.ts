import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface MasterService {
  id: string;
  master_id: string;
  name: string;
  description: string | null;
  price_amount: number;
  currency: string;
  duration_minutes: number;
  is_visible: boolean;
  sort_order: number;
}

export interface CreateServiceInput {
  name: string;
  description: string;
  price_amount: number;
  duration_minutes: number;
  is_visible: boolean;
}

export function useMasterServices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["master-services", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("master_id", user!.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as MasterService[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({
      id,
      isVisible,
    }: {
      id: string;
      isVisible: boolean;
    }) => {
      const { error } = await supabase
        .from("services")
        .update({ is_visible: isVisible })
        .eq("id", id)
        .eq("master_id", user!.id);
      if (error) throw error;
    },
    onMutate: async ({ id, isVisible }) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<MasterService[]>(queryKey);
      queryClient.setQueryData<MasterService[]>(queryKey, (old) =>
        old?.map((s) => (s.id === id ? { ...s, is_visible: isVisible } : s)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const createService = useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const currentCount = query.data?.length ?? 0;
      const { error } = await supabase.from("services").insert({
        master_id: user!.id,
        currency: "RUB",
        sort_order: currentCount + 1,
        ...input,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { query, toggleVisibility, createService };
}