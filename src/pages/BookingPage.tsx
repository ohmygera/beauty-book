import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { usePublicMaster } from "@/hooks/usePublicMaster";
import { ServiceCanvas } from "@/components/booking/ServiceCanvas";
import { SchedulerMatrix } from "@/components/booking/SchedulerMatrix";
import { CheckoutCard } from "@/components/booking/CheckoutCard";
import type { SelectedService } from "@/hooks/usePublicServices";

type Step = "services" | "schedule" | "checkout" | "success";

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
        <p className="font-display text-xl text-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground">
          This booking link may be invalid or inactive.
        </p>
      </div>
    );
  }

  const stepTitle: Record<Step, string> = {
    services: master.display_name,
    schedule: "Select Date & Time",
    checkout: "Checkout",
    success: "Booked!",
  };

  const showBackArrow = step === "services";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-5 py-3 flex items-center gap-3">
        {showBackArrow ? (
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
        ) : null}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage" />
          <span className="font-display text-lg font-semibold text-foreground">
            {stepTitle[step]}
          </span>
        </div>

        {/* Step indicator */}
        {step !== "success" && (
          <div className="ml-auto flex items-center gap-1.5">
            {(["services", "schedule", "checkout"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s === step
                    ? "bg-sage"
                    : i < ["services", "schedule", "checkout"].indexOf(step)
                    ? "bg-sage/40"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-sage/15 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-sage" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                You're all set!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Your appointment with{" "}
                <span className="font-medium text-foreground">
                  {master.display_name}
                </span>{" "}
                on{" "}
                <span className="font-medium text-foreground">
                  {selectedDate}
                </span>{" "}
                at{" "}
                <span className="font-medium text-foreground">
                  {selectedTime}
                </span>{" "}
                is confirmed.
              </p>
            </div>
            <button
              onClick={() => {
                setStep("services");
                setSelectedServices([]);
              }}
              className="mt-2 px-6 py-2.5 rounded-xl bg-sage hover:bg-sage-dark text-white text-sm font-semibold transition-colors"
            >
              Book Another
            </button>
            <p className="text-xs text-muted-foreground">
              Powered by{" "}
              <span className="text-sage font-medium">AuraBook</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}