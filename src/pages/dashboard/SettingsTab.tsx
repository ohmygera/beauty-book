import { useState, useEffect } from "react";
import { User, Clock, Bell, Link, Copy, Check, Loader2, Shield } from "lucide-react";
import { useMasterSettings } from "@/hooks/useMasterSettings";
import { OperatingHoursSection } from "@/pages/dashboard/OperatingHoursSection";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

export function SettingsTab() {
  const { query, updateSettings } = useMasterSettings();
  const master = query.data;

  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    bio: "",
    phone_number: "",
  });
  const [scheduling, setScheduling] = useState({
    buffer_time_minutes: 15,
    advance_notice_hours: 2,
  });

  useEffect(() => {
    if (!master) return;
    setProfile({
      display_name: master.display_name ?? "",
      bio: master.bio ?? "",
      phone_number: master.phone_number ?? "",
    });
    setScheduling({
      buffer_time_minutes: master.buffer_time_minutes,
      advance_notice_hours: master.advance_notice_hours,
    });
  }, [master]);

  const bookingUrl = master
    ? `${window.location.origin}/b/${master.username}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    showSuccess("Ссылка скопирована!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = () => {
    updateSettings.mutate(profile, {
      onSuccess: () => showSuccess("Профиль сохранён"),
      onError: () => showError("Не удалось сохранить профиль"),
    });
  };

  const handleSaveScheduling = () => {
    updateSettings.mutate(scheduling, {
      onSuccess: () => showSuccess("Настройки записи сохранены"),
      onError: () => showError("Не удалось сохранить настройки"),
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200";

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-sage animate-spin" />
      </div>
    );
  }

  if (!master) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
        <Shield className="w-8 h-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Профиль ещё не настроен.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile summary */}
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 transition-all duration-200">
        <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-sage" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{master.display_name}</p>
          <p className="text-sm text-muted-foreground">@{master.username}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full">
            <Shield className="w-2.5 h-2.5" /> Активен
          </span>
        </div>
      </div>

      {/* Booking URL */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3 transition-all duration-200">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-sage" />
          <p className="text-sm font-semibold text-foreground">
            Ваша ссылка для записи
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-xl bg-background border border-input">
            <p className="text-xs text-muted-foreground truncate">{bookingUrl}</p>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border active:scale-90",
              copied
                ? "bg-sage/15 border-sage/40 text-sage"
                : "bg-card border-border text-muted-foreground hover:bg-accent"
            )}
            title="Скопировать"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Profile settings */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-4 transition-all duration-200">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Профиль
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Имя / Название
          </label>
          <input
            value={profile.display_name}
            maxLength={60}
            onChange={(e) =>
              setProfile((p) => ({ ...p, display_name: e.target.value }))
            }
            placeholder="Ваше имя для клиентов"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            О себе
          </label>
          <textarea
            value={profile.bio}
            maxLength={400}
            onChange={(e) =>
              setProfile((p) => ({ ...p, bio: e.target.value }))
            }
            placeholder="Краткое описание для клиентов"
            rows={3}
            className={cn(inputClass, "resize-none")}
          />
          <p className="text-[11px] text-muted-foreground text-right">
            {(profile.bio ?? "").length}/400
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Номер телефона
          </label>
          <input
            type="tel"
            maxLength={16}
            value={profile.phone_number}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                phone_number: e.target.value.replace(/[^\d+\s()\-]/g, ""),
              }))
            }
            placeholder="+7 999 000 00 00"
            className={inputClass}
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={updateSettings.isPending}
          className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-dark active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Сохранить профиль"
          )}
        </button>
      </section>

      {/* Operating Hours */}
      <OperatingHoursSection />

      {/* Scheduling */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-4 transition-all duration-200">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Настройки записи
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Буферное время (минуты)
            </span>
          </label>
          <input
            type="number"
            min={0}
            max={120}
            value={scheduling.buffer_time_minutes}
            onChange={(e) =>
              setScheduling((p) => ({
                ...p,
                buffer_time_minutes: Math.min(
                  120,
                  Math.max(0, parseInt(e.target.value) || 0)
                ),
              }))
            }
            className={inputClass}
          />
          <p className="text-[11px] text-muted-foreground">
            Пауза между записями · сейчас{" "}
            <span className="font-medium text-foreground">
              {scheduling.buffer_time_minutes} мин
            </span>
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3 h-3" /> Предварительное уведомление (часы)
            </span>
          </label>
          <input
            type="number"
            min={0}
            max={72}
            value={scheduling.advance_notice_hours}
            onChange={(e) =>
              setScheduling((p) => ({
                ...p,
                advance_notice_hours: Math.min(
                  72,
                  Math.max(0, parseInt(e.target.value) || 0)
                ),
              }))
            }
            className={inputClass}
          />
          <p className="text-[11px] text-muted-foreground">
            Минимальное время до записи · сейчас{" "}
            <span className="font-medium text-foreground">
              {scheduling.advance_notice_hours} ч
            </span>
          </p>
        </div>

        <button
          onClick={handleSaveScheduling}
          disabled={updateSettings.isPending}
          className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-dark active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Сохранить настройки"
          )}
        </button>
      </section>
    </div>
  );
}