import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";

function timeToMinutes(time: string): number {
  const parts = time.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function minutesToTime(mins: number): string {
  return `${Math.floor(mins / 60).toString().padStart(2, "0")}:${(
    mins % 60
  )
    .toString()
    .padStart(2, "0")}`;
}

interface UseAvailableSlotsParams {
  masterId: string | undefined;
  date: string | undefined; // YYYY-MM-DD
  totalDurationMinutes: number;
  bufferMinutes: number;
  advanceNoticeHours: number;
}

export function useAvailableSlots({
  masterId,
  date,
  totalDurationMinutes,
  bufferMinutes,
  advanceNoticeHours,
}: UseAvailableSlotsParams) {
  return useQuery({
    queryKey: [
      "slots",
      masterId,
      date,
      totalDurationMinutes,
      bufferMinutes,
      advanceNoticeHours,
    ],
    queryFn: async () => {
      const [year, month, day] = date!.split("-").map(Number);
      const dayOfWeek = new Date(year, month - 1, day).getDay();

      const { data: oh } = await supabase
        .from("operating_hours")
        .select("is_operational, start_time, end_time")
        .eq("master_id", masterId!)
        .eq("day_of_week", dayOfWeek)
        .maybeSingle();

      if (!oh || !oh.is_operational) return [];

      const { data: apts } = await supabase
        .from("appointments")
        .select("start_time, end_time")
        .eq("master_id", masterId!)
        .eq("appointment_date", date!)
        .neq("status", "cancelled");

      const existingApts = apts ?? [];
      const startTotal = timeToMinutes(oh.start_time);
      const endTotal = timeToMinutes(oh.end_time);

      const todayStr = new Date().toLocaleDateString("en-CA");
      const isToday = date === todayStr;
      const nowMins =
        new Date().getHours() * 60 + new Date().getMinutes();
      const cutoff = isToday
        ? nowMins + advanceNoticeHours * 60
        : -Infinity;

      const slots: string[] = [];

      for (
        let t = startTotal;
        t + totalDurationMinutes <= endTotal;
        t += 30
      ) {
        if (t < cutoff) continue;

        const slotEnd = t + totalDurationMinutes + bufferMinutes;

        const overlaps = existingApts.some((apt) => {
          const aStart = timeToMinutes(apt.start_time);
          const aEnd = timeToMinutes(apt.end_time);
          return t < aEnd + bufferMinutes && slotEnd > aStart;
        });

        if (!overlaps) slots.push(minutesToTime(t));
      }

      return slots;
    },
    enabled: !!masterId && !!date && totalDurationMinutes > 0,
  });
}