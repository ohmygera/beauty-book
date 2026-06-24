import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, CalendarX, Phone, Check, X } from "lucide-react";
import { useMasterAppointments } from "@/hooks/useMasterAppointments";
import type { AppointmentRow } from "@/hooks/useMasterAppointments";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 72; // px per hour
const START_HOUR = 8;
const END_HOUR = 21;
const TOTAL_HOURS = END_HOUR - START_HOUR;

function timeToMinutes(time: string): number {
  const parts = time.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function getTopPx(startTime: string): number {
  const mins = timeToMinutes(startTime);
  return ((mins - START_HOUR * 60) / 60) * HOUR_HEIGHT;
}

function getHeightPx(startTime: string, endTime: string): number {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  return Math.max(((endMins - startMins) / 60) * HOUR_HEIGHT, 48);
}

function toDateStr(d: Date) {
  return d.toLocaleDateString("en-CA");
}

function formatDisplayDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLES = {
  confirmed: "border-sage/40 bg-sage/10",
  completed: "border-border bg-muted/50",
  cancelled: "border-dusty-rose/30 bg-dusty-rose/5 opacity-60",
};

function AppointmentCard({
  apt,
  onStatusChange,
}: {
  apt: AppointmentRow;
  onStatusChange: (id: string, status: "completed" | "cancelled") => void;
}) {
  const serviceNames = apt.appointment_services
    .map((as) => as.services?.name)
    .filter(Boolean)
    .join(", ");

  const top = getTopPx(apt.start_time);
  const height = getHeightPx(apt.start_time, apt.end_time);
  const timeLabel = `${apt.start_time.slice(0, 5)} – ${apt.end_time.slice(0, 5)}`;

  return (
    <div
      className={cn(
        "absolute left-14 right-0 border rounded-xl px-3 py-2 overflow-hidden transition-all",
        STATUS_STYLES[apt.status]
      )}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <div className="flex items-start justify-between gap-1 h-full">
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-xs font-semibold text-foreground truncate">
            {apt.clients?.full_name ?? "Unknown"}
          </p>
          {serviceNames && (
            <p className="text-[10px] text-muted-foreground truncate">
              {serviceNames}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground">{timeLabel}</p>
        </div>

        {apt.status === "confirmed" && height >= 64 && (
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button
              onClick={() => onStatusChange(apt.id, "completed")}
              className="w-6 h-6 rounded-lg bg-sage/20 hover:bg-sage/40 flex items-center justify-center transition-colors"
              title="Mark complete"
            >
              <Check className="w-3 h-3 text-sage" />
            </button>
            <button
              onClick={() => onStatusChange(apt.id, "cancelled")}
              className="w-6 h-6 rounded-lg bg-dusty-rose/10 hover:bg-dusty-rose/30 flex items-center justify-center transition-colors"
              title="Cancel"
            >
              <X className="w-3 h-3 text-dusty-rose" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = toDateStr(currentDate);
  const { query: appointmentsQuery, updateStatus } = useMasterAppointments(dateStr);

  const appointments = appointmentsQuery.data ?? [];
  const isToday = dateStr === toDateStr(new Date());

  const navigate = (dir: -1 | 1) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir);
      return d;
    });
  };

  const handleStatusChange = (
    id: string,
    status: "completed" | "cancelled"
  ) => {
    updateStatus.mutate({ id, status });
  };

  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;

  return (
    <div className="space-y-4">
      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {formatDisplayDate(dateStr)}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isToday && (
              <span className="text-sage font-medium">Today · </span>
            )}
            {confirmedCount} confirmed appointment
            {confirmedCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-accent border border-border transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className={cn(
              "px-2.5 h-8 rounded-xl text-xs font-semibold border transition-colors",
              isToday
                ? "bg-sage text-white border-sage"
                : "bg-card text-muted-foreground border-border hover:bg-accent"
            )}
          >
            Today
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-accent border border-border transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      {appointmentsQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 text-sage animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <CalendarX className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              No appointments
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your schedule is clear for this day
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative border border-border rounded-2xl overflow-hidden bg-card"
          style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}
        >
          {/* Hour grid lines */}
          {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
            const hour = START_HOUR + i;
            return (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center"
                style={{ top: `${i * HOUR_HEIGHT}px` }}
              >
                <span className="w-12 text-[10px] text-muted-foreground text-right pr-2 flex-shrink-0 leading-none">
                  {hour < 12
                    ? `${hour}am`
                    : hour === 12
                    ? "12pm"
                    : `${hour - 12}pm`}
                </span>
                <div className="flex-1 border-t border-border/50" />
              </div>
            );
          })}

          {/* Appointment cards */}
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              apt={apt}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}