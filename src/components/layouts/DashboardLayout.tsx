import { useState } from "react";
import { CalendarDays, Scissors, Users, Settings, LogOut } from "lucide-react";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useEnsureMasterRecord } from "@/hooks/useEnsureMasterRecord";
import { ServicesTab } from "@/pages/dashboard/ServicesTab";
import { CalendarTab } from "@/pages/dashboard/CalendarTab";
import { ClientsTab } from "@/pages/dashboard/ClientsTab";
import { SettingsTab } from "@/pages/dashboard/SettingsTab";
import { cn } from "@/lib/utils";

type Tab = "calendar" | "services" | "clients" | "settings";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "calendar", label: "Календарь", icon: CalendarDays },
  { id: "services", label: "Услуги", icon: Scissors },
  { id: "clients", label: "Клиенты", icon: Users },
  { id: "settings", label: "Настройки", icon: Settings },
];

export function DashboardLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("services");
  useEnsureMasterRecord();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sage flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C9.58 4 6 7.58 6 12c0 3.54 2.29 6.53 5.47 7.59L14 24l2.53-4.41C19.71 18.53 22 15.54 22 12c0-4.42-3.58-8-8-8z" fill="white" opacity="0.9"/>
              <circle cx="14" cy="12" r="3" fill="white"/>
            </svg>
          </div>
          <span className="font-display font-bold text-sm text-foreground tracking-tight">BeautyBook</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[160px]">
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            title="Выйти"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-5 pb-24 max-w-lg mx-auto w-full">
        {activeTab === "calendar" && <CalendarTab />}
        {activeTab === "services" && <ServicesTab />}
        {activeTab === "clients" && <ClientsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-border">
        <div className="flex items-center max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 transition-colors duration-150",
                  active ? "text-sage" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform duration-150", active && "scale-110")} />
                <span className={cn("text-[10px] font-medium", active && "font-semibold")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
