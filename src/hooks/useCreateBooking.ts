import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import type { SelectedService } from "@/hooks/usePublicServices";

interface BookingPayload {
  masterId: string;
  fullName: string;
  phoneNumber: string;
  appointmentDate: string;
  startTime: string;
  totalDurationMinutes: number;
  totalCost: number;
  services: SelectedService[];
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${Math.floor(total / 60).toString().padStart(2, "0")}:${(
    total % 60
  )
    .toString()
    .padStart(2, "0")}:00`;
}

export const SLOT_TAKEN_ERROR = "SLOT_TAKEN";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: BookingPayload) => {
      const {
        masterId,
        fullName,
        phoneNumber,
        appointmentDate,
        startTime,
        totalDurationMinutes,
        totalCost,
        services,
      } = payload;

      const cleanedPhone = phoneNumber.replace(/[\s()\-]/g, "");

      // ── Blacklist pre-check ────────────────────────────────────────────────
      // Silently reject blacklisted numbers with a generic slot-taken message
      // so the client has no signal they are blocked.
      const { data: existingRecord } = await supabase
        .from("clients")
        .select("id, is_blacklisted")
        .eq("master_id", masterId)
        .eq("phone_number", cleanedPhone)
        .maybeSingle();

      if (existingRecord?.is_blacklisted === true) {
        throw new Error(SLOT_TAKEN_ERROR);
      }

      // ── Upsert client ─────────────────────────────────────────────────────
      let clientId: string;
      if (existingRecord) {
        clientId = existingRecord.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({
            master_id: masterId,
            full_name: fullName,
            phone_number: cleanedPhone,
          })
          .select("id")
          .single();
        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // ── Create appointment ────────────────────────────────────────────────
      const endTime = addMinutes(startTime, totalDurationMinutes);
      const startTimeFull = `${startTime}:00`;

      const { data: appointment, error: aptError } = await supabase
        .from("appointments")
        .insert({
          master_id: masterId,
          client_id: clientId,
          appointment_date: appointmentDate,
          start_time: startTimeFull,
          end_time: endTime,
          total_cost: totalCost,
          status: "confirmed",
        })
        .select("id")
        .single();
      if (aptError) throw aptError;

      // ── Link services ─────────────────────────────────────────────────────
      const { error: asError } = await supabase
        .from("appointment_services")
        .insert(
          services.map((s) => ({
            appointment_id: appointment.id,
            service_id: s.id,
            price_snapshot: s.price_amount,
            duration_snapshot: s.duration_minutes,
          }))
        );
      if (asError) throw asError;

      return appointment;
    },
  });
}