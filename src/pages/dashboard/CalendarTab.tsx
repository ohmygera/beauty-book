import { CalendarDays } from "lucide-react";

export function CalendarTab() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <CalendarDays className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Календарь</p>
        <p className="text-xs text-muted-foreground mt-1">Скоро появится расписание записей</p>
      </div>
    </div>
  );
}
