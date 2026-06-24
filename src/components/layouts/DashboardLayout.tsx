import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  LogOut,
  Sparkles,
  CalendarDays,
  Scissors,
  Settings,
  Users,
} from "lucide-react";
import { supabase } from "@/config/supabase";
import { useUIStore } from "@/store/useUIStore";
import { CalendarTab } from "@/pages/dashboard/CalendarTab";
import { ServicesTab } from "@/pages/dashboard/ServicesTab";
import { SettingsTab } from "@/pages/dashboard/SettingsTab";
import { ClientsTab } from "@/pages/dashboard/ClientsTab";
import { cn } from "@/lib/utils";

type Tab = "calendar" | "clients" | "services" | "settings";

const NAV_ITEMS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "calendar", label: "Записи", Icon: CalendarDays },
  { id: "clients", label: "Клиенты", Icon: Users },
  { id: "services", label: "Услуги", Icon: Scissors },
  { id: "settings", label: "Настройки", Icon: Settings },
];

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const navigate = useNavigate();
  const { currentTheme, toggleTheme } = useUIStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-5 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sage" />
            <span className="font-display text-lg font-semibold text-foreground">
              AuraBook
            </span>
            <span className="hidden sm:inline-block text-xs text-muted-foreground ml-1 font-sans">
              Панель управления
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Сменить тему"
            >
              {currentTheme === "light" ? (
                <Moon className="w-3.5 h-3.5 text-foreground" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-foreground" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-dusty-rose/10 hover:border-dusty-rose/40 transition-colors"
              aria-label="Выйти"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground hover:text-dusty-rose transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-2xl mx-auto px-5 py-6">
          <div key={activeTab} className="animate-fade-in">
            {activeTab === "calendar" && <CalendarTab />}
            {activeTab === "clients" && <ClientsTab />}
            {activeTab === "services" && <ServicesTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="max-w-2xl mx-auto flex items-stretch">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-colors relative",
                  isActive
                    ? "text-sage"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={label}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-sage" />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-[10px] font-semibold tracking-wide">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}