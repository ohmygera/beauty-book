import { useState, useRef } from "react";
import { ChevronLeft, Loader2, CalendarX } from "lucide-react";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import type { MasterProfile } from "@/hooks/usePublicMaster";
import type { SelectedService } from "@/hooks/usePublicServices";
import { cn } from "@/lib/utils";

interface SchedulerMatrixProps {
  master: MasterProfile;
  selectedServices: SelectedService[];
  onBack: () => void;
  onNext: (date: string, time: string) => void;
}

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function toDateStr(d: Date): string {
  return d.toLocaleDateString("en-CA");
}

export function SchedulerMatrix({
  master,
  selectedServices,
  onBack,
  onNext,
}: SchedulerMatrixProps) {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState<string>(toDateStr(dates[0]));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const dateStripRef = useRef<HTMLDivElement>(null);

  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  const { data: slots, isLoading: slotsLoading } = useAvailableSlots({
    masterId: master.id,
    date: selectedDate,
    totalDurationMinutes: totalDuration,
    bufferMinutes: master.buffer_time_minutes,
    advanceNoticeHours: master.advance_notice_hours,
  });

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };

  return (
    <div className="flex flex-col gap-5 pb-32">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Choose a date & time
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} ·{" "}
          {totalDuration} min total
        </p>
      </div>

      {/* Horizontal date strip */}
      <div
        ref={dateStripRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {dates.map((d) => {
          const str = toDateStr(d);
          const isSelected = str === selectedDate;
          const isToday = str === toDateStr(new Date());
          return (
            <button
              key={str}
              onClick={() => handleDateSelect(str)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl border transition-all",
                isSelected
                  ? "bg-sage border-sage text-white"
                  : "bg-card border-border text-foreground hover:border-sage/40"
              )}
            >
              <span className={cn("text-[10px] font-semibold uppercase tracking-wide",
                isSelected ? "text-white/80" : "text-muted-foreground")}>
                {DAY_ABBR[d.getDay()]}
              </span>
              <span className="text-sm font-bold">{d.getDate()}</span>
              <span className={cn("text-[10px]",
                isSelected ? "text-white/70" : "text-muted-foreground")}>
                {MONTH_SHORT[d.getMonth()]}
              </span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-sage mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Available times
        </h3>

        {slotsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-sage animate-spin" />
          </div>
        ) : !slots?.length ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <CalendarX className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No availability</p>
            <p className="text-xs text-muted-foreground">
              Try a different date
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((time) => {
              const isSelected = time === selectedTime;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "py-2.5 rounded-xl border text-sm font-semibold transition-all",
                    isSelected
                      ? "bg-sage border-sage text-white"
                      : "bg-card border-border text-foreground hover:border-sage/40"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            disabled={!selectedTime}
            onClick={() => selectedTime && onNext(selectedDate, selectedTime)}
            className={cn(
              "flex-1 py-3 rounded-2xl text-sm font-semibold transition-all",
              selectedTime
                ? "bg-sage hover:bg-sage-dark text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {selectedTime
              ? `Continue with ${selectedTime}`
              : "Select a time"}
          </button>
        </div>
      </div>
    </div>
  );
}