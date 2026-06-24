import { useState } from "react";
import {
  Plus, Clock, Eye, EyeOff, GripVertical, Loader2, AlertCircle,
} from "lucide-react";
import { useMasterServices } from "@/hooks/useMasterServices";
import type { CreateServiceInput } from "@/hooks/useMasterServices";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

function AddServiceSheet({ onClose }: { onClose: () => void }) {
  const { createService } = useMasterServices();
  const [form, setForm] = useState<CreateServiceInput>({
    name: "",
    description: "",
    price_amount: 0,
    duration_minutes: 60,
    is_visible: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createService.mutate(form, {
      onSuccess: () => {
        showSuccess("Услуга создана");
        onClose();
      },
      onError: () => showError("Не удалось создать услугу"),
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Название *
        </label>
        <input
          required
          maxLength={80}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="напр. Авторский уход за лицом"
          className={inputClass}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Описание
        </label>
        <textarea
          maxLength={300}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Краткое описание для клиентов"
          rows={2}
          className={cn(inputClass, "resize-none")}
        />
        <p className="text-[11px] text-muted-foreground text-right">
          {form.description.length}/300
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Цена (₽)
          </label>
          <input
            type="number"
            required
            min={0}
            max={999999}
            value={form.price_amount || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                price_amount: parseFloat(e.target.value) || 0,
              }))
            }
            placeholder="2500"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Длительность (мин)
          </label>
          <input
            type="number"
            required
            min={5}
            max={480}
            value={form.duration_minutes || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                duration_minutes: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="60"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-foreground">Видно клиентам</span>
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, is_visible: !p.is_visible }))}
          className={cn(
            "relative w-10 h-6 rounded-full transition-colors duration-200",
            form.is_visible ? "bg-sage" : "bg-muted border border-border"
          )}
        >
          <span
            className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
              form.is_visible ? "left-5" : "left-1"
            )}
          />
        </button>
      </div>

      <button
        type="submit"
        disabled={createService.isPending}
        className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-dark active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
      >
        {createService.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Создать услугу"
        )}
      </button>
    </form>
  );
}

export function ServicesTab() {
  const { query, toggleVisibility } = useMasterServices();
  const services = query.data ?? [];
  const [sheetOpen, setSheetOpen] = useState(false);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Услуги</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {services.filter((s) => s.is_visible).length} активных · {services.length} всего
          </p>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-1.5 bg-sage hover:bg-sage-dark active:scale-95 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200">
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="font-display text-lg">Новая услуга</SheetTitle>
            </SheetHeader>
            <div className="px-1 pb-4">
              <AddServiceSheet onClose={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {query.isError && (
        <div className="flex items-start gap-3 bg-dusty-rose/10 border border-dusty-rose/30 rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-dusty-rose mt-0.5" />
          <p className="text-sm text-dusty-rose">Не удалось загрузить услуги.</p>
        </div>
      )}

      {services.length === 0 && !query.isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm font-semibold text-foreground">Услуг пока нет</p>
          <p className="text-xs text-muted-foreground">Нажмите «Добавить», чтобы создать первую услугу</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc, i) => (
            <div
              key={svc.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className={cn(
                "bg-card border rounded-2xl p-4 flex items-start gap-3",
                "opacity-0 animate-slide-up",
                "transition-all duration-200 hover:shadow-sm",
                svc.is_visible ? "border-border" : "border-border opacity-55"
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 cursor-grab" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{svc.name}</p>
                    {svc.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {svc.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      toggleVisibility.mutate(
                        { id: svc.id, isVisible: !svc.is_visible },
                        {
                          onSuccess: () =>
                            showSuccess(svc.is_visible ? "Услуга скрыта" : "Услуга активна"),
                          onError: () => showError("Не удалось обновить"),
                        }
                      )
                    }
                    disabled={toggleVisibility.isPending}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent border border-border transition-all duration-150 flex-shrink-0 active:scale-90"
                    title={svc.is_visible ? "Скрыть" : "Показать"}
                  >
                    {svc.is_visible ? (
                      <Eye className="w-3.5 h-3.5 text-sage" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {svc.duration_minutes} мин
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatPrice(svc.price_amount)}
                  </span>
                  {!svc.is_visible && (
                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Скрыта
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}