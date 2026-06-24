import { useState, useEffect } from "react";
import { Clock, Loader2 } from "lucide-react";
import { useMasterOperatingHours } from "@/hooks/useMasterOperatingHours";
import { useAuth } from "@/hooks/useAuth";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

const DAYS = [
  { dow: 1, short: "Mon", label: "Monday" },
  { dow: 2, short: "Tue", label: "Tuesday" },
  { dow: 3, short: "Wed", label: "Wednesday" },
  { dow: 4, short: "Thu", label: "Thursday" },
  { dow: 5, short: "Fri", label: "Friday" },
  { dow: 6, short: "Sat", label: "Saturday" },
  { dow: 0, short: "Sun", label: "Sunday" },
];

interface DraftHour {
  dow: number;
  is_operational: boolean;
  start_time: string;
  end_time: string;
}

const DEFAULT_DRAFT = (dow: number): DraftHour => ({
  dow,
  is_operational: dow !== 0,
  start_time: "09:00",
  end_time: "18:00",
});

export function OperatingHoursSection() {
  const { user } = useAuth();
  const { query, saveHours } = useMasterOperatingHours();
  const [drafts, setDrafts] = useState<DraftHour[]>(
    DAYS.map((d) => DEFAULT_DRAFT(d.dow))
  );

  useEffect(() => {
    if (!query.data) return;
    setDrafts(
      DAYS.map((d) => {
        const row = query.data.find((r) => r.day_of_week === d.dow);
        return {
          dow: d.dow,
          is_operational: row?.is_operational ?? (d.dow !== 0),
          start_time: row?.start_time?.slice(0, 5) ?? "09:00",
          end_time: row?.end_time?.slice(0, 5) ?? "18:00",
        };
      })
    );
  }, [query.data]);

  const update = (dow: number, patch: Partial<DraftHour>) => {
    setDrafts((prev) =>
      prev.map((d) => (d.dow === dow ? { ...d, ...patch } : d))
    );
  };

  const handleSave = () => {
    saveHours.mutate(drafts, {
      onSuccess: () => showSuccess("Operating hours saved"),
      onError: () => showError("Failed to save operating hours"),
    });
  };

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-4 h-4 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-4 space-y-4 transition-all duration-200">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Operating Hours
      </p>

      <div className="space-y-1.5">
        {DAYS.map((day) => {
          const draft = drafts.find((d) => d.dow === day.dow)!;
          return (
            <div
              key={day.dow}
              className={cn(
                "flex items-center gap-3 py-2.5 px-3 rounded-xl border transition-colors duration-150",
                draft.is_operational
                  ? "bg-sage/5 border-sage/20"
                  : "border-transparent"
              )}
            >
              {/* Toggle + day label */}
              <button
                type="button"
                onClick={() =>
                  update(day.dow, { is_operational: !draft.is_operational })
                }
                className="flex items-center gap-2.5 flex-shrink-0"
              >
                <div
                  className={cn(
                    "relative w-8 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
                    draft.is_operational
                      ? "bg-sage"
                      : "bg-muted border border-border"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                      draft.is_operational ? "left-3.5" : "left-0.5"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold w-8 text-left",
                    draft.is_operational
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {day.short}
                </span>
              </button>

              {/* Time inputs */}
              {draft.is_operational ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="time"
                    value={draft.start_time}
                    onChange={(e) =>
                      update(day.dow, { start_time: e.target.value })
                    }
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg text-sm bg-background border border-input text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    –
                  </span>
                  <input
                    type="time"
                    value={draft.end_time}
                    onChange={(e) =>
                      update(day.dow, { end_time: e.target.value })
                    }
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg text-sm bg-background border border-input text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Day off
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saveHours.isPending}
        className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-dark active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
      >
        {saveHours.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Clock className="w-4 h-4" />
            Save Hours
          </>
        )}
      </button>
    </section>
  );
}