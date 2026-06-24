import { useState, type FormEvent } from "react";
import {
  ChevronLeft,
  CalendarDays,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useCreateBooking, SLOT_TAKEN_ERROR } from "@/hooks/useCreateBooking";
import { validatePhone, validateFullName, sanitizePhone } from "@/lib/validation";
import type { MasterProfile } from "@/hooks/usePublicMaster";
import type { SelectedService } from "@/hooks/usePublicServices";
import { cn } from "@/lib/utils";

interface CheckoutCardProps {
  master: MasterProfile;
  selectedServices: SelectedService[];
  date: string;
  time: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function CheckoutCard({
  master,
  selectedServices,
  date,
  time,
  onBack,
  onSuccess,
}: CheckoutCardProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const createBooking = useCreateBooking();

  const totalCost = selectedServices.reduce((sum, s) => sum + s.price_amount, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T12:00:00").toLocaleDateString("ru-RU", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  const validateRuName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Введите имя";
    if (trimmed.length < 2) return "Имя должно содержать минимум 2 символа";
    return null;
  };

  const validateRuPhone = (value: string): string | null => {
    const cleaned = value.replace(/[\s()-]/g, "");
    if (!cleaned) return "Введите номер телефона";
    if (!/^\+?[1-9]\d{1,14}$/.test(cleaned)) {
      return "Введите номер в формате +79991234567";
    }
    return null;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 80);
    setFullName(val);
    if (nameError) setNameError(validateRuName(val));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhone(e.target.value).slice(0, 16);
    setPhoneNumber(sanitized);
    if (phoneError) setPhoneError(validateRuPhone(sanitized));
  };

  const handleNameBlur = () => setNameError(validateRuName(fullName));
  const handlePhoneBlur = () => setPhoneError(validateRuPhone(phoneNumber));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ne = validateRuName(fullName);
    const pe = validateRuPhone(phoneNumber);
    setNameError(ne);
    setPhoneError(pe);
    if (ne || pe) return;

    createBooking.mutate(
      {
        masterId: master.id,
        fullName: fullName.trim(),
        phoneNumber,
        appointmentDate: date,
        startTime: time,
        totalDurationMinutes: totalDuration,
        totalCost,
        services: selectedServices,
      },
      { onSuccess }
    );
  };

  const isSlotTaken =
    createBooking.isError &&
    createBooking.error instanceof Error &&
    createBooking.error.message === SLOT_TAKEN_ERROR;

  const genericError =
    createBooking.isError && !isSlotTaken
      ? "Что-то пошло не так. Попробуйте ещё раз."
      : null;

  const inputBase = cn(
    "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
    "bg-background border text-foreground",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
  );

  return (
    <div className="flex flex-col gap-5 pb-32 animate-fade-in">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Подтверждение записи
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Проверьте данные и введите контакты
        </p>
      </div>

      {/* Booking summary */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3 transition-all duration-300">
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="w-4 h-4 text-sage flex-shrink-0" />
          <span className="font-medium text-foreground capitalize">{formatDate(date)}</span>
          <span className="text-muted-foreground">в</span>
          <span className="font-semibold text-foreground">{time}</span>
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          {selectedServices.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage flex-shrink-0" />
                <span className="text-foreground">{s.name}</span>
              </div>
              <span className="text-muted-foreground">{formatPrice(s.price_amount)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{totalDuration} мин</span>
          </div>
          <span className="font-display font-semibold text-foreground">
            {formatPrice(totalCost)}
          </span>
        </div>
      </div>

      {isSlotTaken && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl px-4 py-3 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            Этот слот только что заняли. Пожалуйста, выберите другое время.
          </p>
        </div>
      )}

      {genericError && (
        <div className="flex items-start gap-3 bg-dusty-rose/10 border border-dusty-rose/30 rounded-2xl px-4 py-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-dusty-rose mt-0.5 flex-shrink-0" />
          <p className="text-sm text-dusty-rose">{genericError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Имя и фамилия
          </label>
          <input
            type="text"
            required
            maxLength={80}
            value={fullName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="Ваше имя"
            className={cn(
              inputBase,
              nameError ? "border-dusty-rose focus:ring-dusty-rose/40" : "border-input"
            )}
          />
          {nameError && (
            <p className="text-xs text-dusty-rose mt-1 animate-fade-in">{nameError}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Номер телефона
          </label>
          <input
            type="tel"
            required
            maxLength={16}
            value={phoneNumber}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            placeholder="+79991234567"
            className={cn(
              inputBase,
              phoneError ? "border-dusty-rose focus:ring-dusty-rose/40" : "border-input"
            )}
          />
          {phoneError ? (
            <p className="text-xs text-dusty-rose mt-1 animate-fade-in">{phoneError}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Международный формат — напр. +79991234567
            </p>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="submit"
              disabled={createBooking.isPending}
              className={cn(
                "flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                "bg-sage hover:bg-sage-dark active:scale-[0.98] text-white",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Оформляем…
                </>
              ) : (
                "Подтвердить запись"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}