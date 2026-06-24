import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";

export interface PublicService {
  id: string;
  name: string;
  description: string | null;
  price_amount: number;
  currency: string;
  duration_minutes: number;
  is_visible: boolean;
  sort_order: number;
}

export type SelectedService = Pick<
  PublicService,
  "id" | "name" | "price_amount" | "duration_minutes"
>;

export function usePublicServices(masterId: string | undefined) {
  return useQuery({
    queryKey: ["services", "public", masterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(
          "id, name, description, price_amount, currency, duration_minutes, is_visible, sort_order"
        )
        .eq("master_id", masterId!)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as PublicService[];
    },
    enabled: !!masterId,
    staleTime: 5 * 60 * 1000,
  });
}