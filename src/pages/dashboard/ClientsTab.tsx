import { Users } from "lucide-react";

export function ClientsTab() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Users className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Клиенты</p>
        <p className="text-xs text-muted-foreground mt-1">Здесь будет список ваших клиентов</p>
      </div>
    </div>
  );
}
