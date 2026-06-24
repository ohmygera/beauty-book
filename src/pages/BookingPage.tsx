import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { usePublicMaster } from "@/hooks/usePublicMaster";
import { ServiceCanvas } from "@/components/booking/ServiceCanvas";
import { SchedulerMatrix } from "@/components/booking/SchedulerMatrix";
import { CheckoutCard } from "@/components/booking/CheckoutCard";
import type { SelectedService } from "@/hooks/usePublicServices";

type Step = "services" | "schedule" | "checkout" | "success";

const STEP_ORDER: Step[] = ["services", "schedule", "checkout"];

export default function BookingPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { data: master, isLoading, error } = usePublicMaster(username);

  const [step, setStep] = useState<Step>("services");
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sage animate-spin" />
      </div>
    );
  }

  if (error || !master) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display text-xl text-foreground">Страница не найдена</p>
        <p className="text-sm text-muted-foreground">
          Ссылка для записи недействительна или деактивирована.
        </p>
      </div>
    );
  }

  const stepTitle: Record<Step, string> = {
    services: master.display_name,
    schedule: "Дата и время",
    checkout: "Подтверждение",
    success: "Записано!",
  };

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-5 py-3 flex items-center gap-3">
        {step === "services" ? (
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
        ) : null}

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage" />
          <span className="font-display text-lg font-semibold text-foreground transition-all duration-300">
            {stepTitle[step]}
          </span>
        </div>

        {step !== "success" && (
          <div className="ml-auto flex items-center gap-1.5">
            {STEP_ORDER.map((s, i) => (
              <div
                key={s}
                className={`rounded-full transition-all duration-300 ${
                  s === step
                    ? "bg-sage w-4 h-2"
                    : i < stepIndex
                    ? "bg-sage/40 w-2 h-2"
                    : "bg-border w-2 h-2"
                }`}
              />
            ))}
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        <div key={step} className="animate-fade-in">
          {step === "services" && (
            <ServiceCanvas
              master={master}
              onNext={(services) => {
                setSelectedServices(services);
                setStep("schedule");
              }}
            />
          )}

          {step === "schedule" && (
            <SchedulerMatrix
              master={master}
              selectedServices={selectedServices}
              onBack={() => setStep("services")}
              onNext={(date, time) => {
                setSelectedDate(date);
                setSelectedTime(time);
                setStep("checkout");
              }}
            />
          )}

          {step === "checkout" && (
            <CheckoutCard
              master={master}
              selectedServices={selectedServices}
              date={selectedDate}
              time={selectedTime}
              onBack={() => setStep("schedule")}
              onSuccess={() => setStep("success")}
            />
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
              <div className="w-20 h-20 rounded-3xl bg-sage/15 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-sage" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Запись оформлена!
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  Ваша запись к{" "}
                  <span className="font-medium text-foreground">
                    {master.display_name}
                  </span>{" "}
                  на{" "}
                  <span className="font-medium text-foreground">{selectedDate}</span> в{" "}
                  <span className="font-medium text-foreground">{selectedTime}</span>{" "}
                  подтверждена.
                </p>
              </div>
              <button
                onClick={() => {
                  setStep("services");
                  setSelectedServices([]);
                }}
                className="mt-2 px-6 py-2.5 rounded-xl bg-sage hover:bg-sage-dark active:scale-95 text-white text-sm font-semibold transition-all duration-200"
              >
                Записаться ещё раз
              </button>
              <p className="text-xs text-muted-foreground">
                Работает на <span className="text-sage font-medium">AuraBook</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}