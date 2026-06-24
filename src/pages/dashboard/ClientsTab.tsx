import { useState } from "react";
import {
  Search,
  Shield,
  ShieldOff,
  Phone,
  Loader2,
  Users,
  AlertCircle,
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

export function ClientsTab() {
  const { query, toggleBlacklist } = useClients();
  const [search, setSearch] = useState("");

  const allClients = query.data ?? [];

  const clients = allClients.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) || c.phone_number.includes(q)
    );
  });

  const blacklistedCount = allClients.filter((c) => c.is_blacklisted).length;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
        <h2 className="font-display text-lg font-semibold text-foreground">
          Clients
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {allClients.length} total ·{" "}
          {blacklistedCount > 0 ? (
            <span className="text-dusty-rose font-medium">
              {blacklistedCount} blocked
            </span>
          ) : (
            "none blocked"
          )}
        </p>
      </div>

      {/* Search */}
      {allClients.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="flex items-start gap-3 bg-dusty-rose/10 border border-dusty-rose/30 rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-dusty-rose mt-0.5 flex-shrink-0" />
          <p className="text-sm text-dusty-rose">Failed to load clients.</p>
        </div>
      )}

      {/* Empty state */}
      {clients.length === 0 && !query.isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {search ? "No clients match" : "No clients yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {search
                ? "Try different keywords"
                : "Clients appear here after their first booking"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client, i) => (
            <div
              key={client.id}
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
              className={cn(
                "bg-card border rounded-2xl p-4 flex items-center gap-3",
                "opacity-0 animate-slide-up transition-all duration-200",
                client.is_blacklisted
                  ? "border-dusty-rose/30 bg-dusty-rose/5"
                  : "border-border hover:shadow-sm"
              )}
            >
              {/* Initial avatar */}
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  client.is_blacklisted
                    ? "bg-dusty-rose/15 text-dusty-rose"
                    : "bg-sage/15 text-sage"
                )}
              >
                {client.full_name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={cn(
                      "text-sm font-semibold truncate",
                      client.is_blacklisted
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    )}
                  >
                    {client.full_name}
                  </p>
                  {client.is_blacklisted && (
                    <span className="flex-shrink-0 text-[10px] font-bold text-dusty-rose bg-dusty-rose/10 px-1.5 py-0.5 rounded-full leading-none">
                      Blocked
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">
                    {client.phone_number}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  Since {formatDate(client.created_at)}
                </p>
              </div>

              {/* Blacklist toggle */}
              <button
                onClick={() =>
                  toggleBlacklist.mutate(
                    { id: client.id, isBlacklisted: !client.is_blacklisted },
                    {
                      onSuccess: () =>
                        showSuccess(
                          client.is_blacklisted
                            ? `${client.full_name} unblocked`
                            : `${client.full_name} blocked`
                        ),
                      onError: () => showError("Failed to update client"),
                    }
                  )
                }
                disabled={toggleBlacklist.isPending}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150 active:scale-90 flex-shrink-0",
                  client.is_blacklisted
                    ? "bg-sage/10 border-sage/30 hover:bg-sage/20 text-sage"
                    : "bg-dusty-rose/8 border-dusty-rose/25 hover:bg-dusty-rose/15 text-dusty-rose"
                )}
                title={
                  client.is_blacklisted ? "Unblock client" : "Block client"
                }
              >
                {client.is_blacklisted ? (
                  <ShieldOff className="w-4 h-4" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}