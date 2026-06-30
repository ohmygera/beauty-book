import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useMasterAppointments } from "@/hooks/useMasterAppointments";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

function toDateString(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

const STATUS_CONFIG = {
  confirmed: { label: "Запись", color: "bg-blue-50 text-blue-600 border-blue-200" },
  completed: { label: "Выполнено", color: "bg-sage/10 text-sage-dark border-sage/20" },
  cancelled: { label: "Отменено", color: "bg-muted text-muted-foreground border-border" },
};

export function CalendarTab() {
  const [date, setDate] = useState(new Date());
  const dateStr = toDateString(date);
  const { query, updateStatus } = useMasterAppointments(dateStr);
  const appointments = query.data ?? [];

  const today = new Date();
  const isToday = toDateString(date) === toDateString(today);

  const displayDate = date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const totalRevenue = appointments
    .filter((a) => a.status !== "cancelled")
    .reduce((sum, a) => sum + Number(a.total_cost), 0);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">Календарь</h2>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{displayDate}</p>
      </div>

      {/* Date switcher */}
      <div className="flex items-center gap-2 bg-white border border-border rounded-2xl p-1">
        <button
          onClick={() => setDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; })}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-foreground capitalize">
            {date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
          </p>
          {isToday && (
            <p className="text-[10px] text-sage font-semibold">Сегодня</p>
          )}
        </div>
        <button
          onClick={() => setDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; })}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors active:scale-90"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Stats */}
      {appointments.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-border rounded-2xl px-4 py-3">
            <p className="text-xs text-muted-foreground">Записей</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {appointments.filter((a) => a.status !== "cancelled").length}
            </p>
          </div>
          <div className="bg-white border border-border rounded-2xl px-4 py-3">
            <p className="text-xs text-muted-foreground">Выручка</p>
            <p className="text-xl font-bold text-sage mt-0.5">{formatPrice(totalRevenue)}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {query.isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 text-sage animate-spin" />
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">Не удалось загрузить записи.</p>
        </div>
      )}

      {/* Empty */}
      {!query.isLoading && appointments.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Записей нет</p>
            <p className="text-xs text-muted-foreground mt-1">На этот день ничего не запланировано</p>
          </div>
        </div>
      )}

      {/* Appointments list */}
      {appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.map((appt, i) => {
            const cfg = STATUS_CONFIG[appt.status];
            const serviceNames = appt.appointment_services
              .map((s) => s.services?.name)
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={appt.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className={cn(
                  "bg-white border border-border rounded-2xl p-4 animate-slide-up",
                  "transition-all duration-200 hover:shadow-sm",
                  appt.status === "cancelled" && "opacity-55"
                )}
              >
                {/* Time + status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-muted rounded-lg px-2.5 py-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground">
                        {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                      </span>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-semibold border px-2 py-0.5 rounded-full", cfg.color)}>
                    {cfg.label}
                  </span>
                </div>

                {/* Client + service */}
                <p className="text-sm font-semibold text-foreground">
                  {appt.clients?.full_name ?? "Клиент удалён"}
                </p>
                {serviceNames && (
                  <p className="text-xs text-muted-foreground mt-0.5">{serviceNames}</p>
                )}

                {/* Cost + actions */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(Number(appt.total_cost))}
                  </span>

                  {appt.status === "confirmed" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          updateStatus.mutate(
                            { id: appt.id, status: "completed" },
                            {
                              onSuccess: () => showSuccess("Отмечено выполненным"),
                              onError: () => showError("Не удалось обновить"),
                            }
                          )
                        }
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1 text-xs font-semibold text-sage bg-sage/10 hover:bg-sage/20 border border-sage/20 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Выполнено
                      </button>
                      <button
                        onClick={() =>
                          updateStatus.mutate(
                            { id: appt.id, status: "cancelled" },
                            {
                              onSuccess: () => showSuccess("Запись отменена"),
                              onError: () => showError("Не удалось обновить"),
                            }
                          )
                        }
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive bg-muted hover:bg-destructive/10 border border-border px-2.5 py-1.5 rounded-lg transition-colors active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Отменить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
