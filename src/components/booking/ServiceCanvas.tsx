import { useState } from "react";
import { CheckCircle2, Circle, Clock, ChevronRight, Loader2 } from "lucide-react";
import { usePublicServices } from "@/hooks/usePublicServices";
import type { MasterProfile } from "@/hooks/usePublicMaster";
import type { SelectedService } from "@/hooks/usePublicServices";
import { cn } from "@/lib/utils";

interface ServiceCanvasProps {
  master: MasterProfile;
  onNext: (selected: SelectedService[]) => void;
}

export function ServiceCanvas({ master, onNext }: ServiceCanvasProps) {
  const { data: services, isLoading } = usePublicServices(master.id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selected = (services ?? []).filter((s) => selectedIds.has(s.id));
  const totalPrice = selected.reduce((sum, s) => sum + s.price_amount, 0);
  const totalDuration = selected.reduce((sum, s) => sum + s.duration_minutes, 0);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDuration = (mins: number) =>
    mins >= 60
      ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60}m` : ""}`
      : `${mins}m`;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-sage animate-spin" />
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <p className="font-display text-lg text-foreground">No services available</p>
        <p className="text-sm text-muted-foreground">
          {master.display_name} hasn't listed any services yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0">
      <div className="space-y-3 pb-36">
        <div className="pt-2 pb-1">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Choose services
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select one or more services to book
          </p>
        </div>

        {services.map((svc, index) => {
          const isSelected = selectedIds.has(svc.id);
          return (
            <button
              key={svc.id}
              onClick={() => toggle(svc.id)}
              style={{ animationDelay: `${index * 55}ms` }}
              className={cn(
                "w-full text-left bg-card border rounded-2xl p-4 flex items-start gap-3",
                "opacity-0 animate-slide-up",
                "transition-all duration-200 ease-out",
                "active:scale-[0.98]",
                isSelected
                  ? "border-sage ring-1 ring-sage/30 bg-sage/5 shadow-sm"
                  : "border-border hover:border-sage/40 hover:shadow-sm"
              )}
            >
              {/* Checkbox */}
              <div className="mt-0.5 flex-shrink-0 transition-transform duration-150">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-sage scale-110" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">{svc.name}</p>
                {svc.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {svc.description}
                  </p>
                )}
                <div className="flex items-center gap-3 pt-0.5">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDuration(svc.duration_minutes)}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatPrice(svc.price_amount)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 transition-all duration-300">
        <div className="max-w-2xl mx-auto space-y-3">
          {selected.length > 0 && (
            <div className="flex items-center justify-between text-sm animate-fade-in">
              <span className="text-muted-foreground">
                {selected.length} service{selected.length > 1 ? "s" : ""} ·{" "}
                {formatDuration(totalDuration)}
              </span>
              <span className="font-semibold text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>
          )}
          <button
            disabled={selected.length === 0}
            onClick={() =>
              onNext(
                selected.map((s) => ({
                  id: s.id,
                  name: s.name,
                  price_amount: s.price_amount,
                  duration_minutes: s.duration_minutes,
                }))
              )
            }
            className={cn(
              "w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2",
              "transition-all duration-200 active:scale-[0.98]",
              selected.length > 0
                ? "bg-sage hover:bg-sage-dark text-white shadow-sm hover:shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Choose Time
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}