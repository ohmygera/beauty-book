import { useState } from "react";
import { Users, Ban, CheckCircle, Phone, Loader2, AlertCircle, Search } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

export function ClientsTab() {
  const { query, toggleBlacklist } = useClients();
  const [search, setSearch] = useState("");

  const clients = (query.data ?? []).filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_number.includes(search)
  );

  const total = query.data?.length ?? 0;
  const blacklisted = query.data?.filter((c) => c.is_blacklisted).length ?? 0;

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">Клиенты</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total} всего · {blacklisted} в чёрном списке
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени или телефону…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Error */}
      {query.isError && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">Не удалось загрузить клиентов.</p>
        </div>
      )}

      {/* Empty */}
      {total === 0 && !query.isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Клиентов пока нет</p>
            <p className="text-xs text-muted-foreground mt-1">Они появятся после первых записей</p>
          </div>
        </div>
      ) : clients.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-10">Ничего не найдено</p>
      ) : (
        <div className="space-y-2.5">
          {clients.map((client, i) => (
            <div
              key={client.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn(
                "bg-white border rounded-2xl px-4 py-3.5 flex items-center gap-3 animate-slide-up",
                "transition-all duration-200 hover:shadow-sm",
                client.is_blacklisted && "opacity-60"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold",
                client.is_blacklisted ? "bg-muted text-muted-foreground" : "bg-sage/15 text-sage-dark"
              )}>
                {client.full_name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground truncate">{client.full_name}</p>
                  {client.is_blacklisted && (
                    <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      Блок
                    </span>
                  )}
                </div>
                <a
                  href={`tel:${client.phone_number}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-sage transition-colors mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  {client.phone_number}
                </a>
              </div>

              {/* Toggle blacklist */}
              <button
                onClick={() =>
                  toggleBlacklist.mutate(
                    { id: client.id, isBlacklisted: !client.is_blacklisted },
                    {
                      onSuccess: () =>
                        showSuccess(client.is_blacklisted ? "Клиент разблокирован" : "Клиент заблокирован"),
                      onError: () => showError("Не удалось обновить"),
                    }
                  )
                }
                disabled={toggleBlacklist.isPending}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150 active:scale-90 flex-shrink-0",
                  client.is_blacklisted
                    ? "border-sage/30 hover:bg-sage/10"
                    : "border-border hover:bg-destructive/10"
                )}
                title={client.is_blacklisted ? "Разблокировать" : "Заблокировать"}
              >
                {client.is_blacklisted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-sage" />
                ) : (
                  <Ban className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
