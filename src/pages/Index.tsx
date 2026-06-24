import { useEffect } from "react";
import { Sun, Moon, ShoppingBag, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import type { Service } from "@/types";

const DEMO_SERVICES: Service[] = [
  {
    id: "svc-001",
    name: "Signature Facial",
    description: "A deeply restorative treatment tailored to your skin's needs.",
    category: "skin",
    price: 9500,
    durationMinutes: 60,
    isPopular: true,
    isAvailable: true,
  },
  {
    id: "svc-002",
    name: "Gel Manicure",
    description: "Long-lasting gel polish with cuticle care and hand massage.",
    category: "nails",
    price: 4500,
    durationMinutes: 45,
    isAvailable: true,
  },
  {
    id: "svc-003",
    name: "Brow Lamination",
    description: "Lift, set, and define your natural brows for weeks.",
    category: "brows",
    price: 6000,
    durationMinutes: 50,
    isPopular: true,
    isAvailable: true,
  },
];

const ColorSwatch = ({
  color,
  label,
  textClass = "text-graphite",
}: {
  color: string;
  label: string;
  textClass?: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-14 h-14 rounded-2xl shadow-sm border border-border"
      style={{ backgroundColor: color }}
    />
    <span className={`text-xs font-medium ${textClass}`}>{label}</span>
    <span className="text-xs text-muted-foreground">{color}</span>
  </div>
);

export default function Index() {
  const { currentTheme, toggleTheme, cart, addToCart, removeFromCart } =
    useUIStore();

  useEffect(() => {
    // Sync theme on mount
    const root = document.documentElement;
    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [currentTheme]);

  const getItemCount = (serviceId: string) =>
    cart.items.find((i) => i.service.id === serviceId)?.quantity ?? 0;

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDuration = (mins: number) =>
    mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}`.trim() : `${mins}m`;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sage" />
            <span className="font-display text-xl font-semibold tracking-tight text-foreground">
              AuraBook
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Cart badge */}
            <div className="relative flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
              <ShoppingBag className="w-4 h-4 text-sage" />
              <span className="text-sm font-medium text-foreground">
                {formatPrice(cart.totalCostCents)}
              </span>
              {cart.items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-dusty-rose text-white text-[10px] font-bold flex items-center justify-center">
                  {cart.items.reduce((a, i) => a + i.quantity, 0)}
                </span>
              )}
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {currentTheme === "light" ? (
                <Moon className="w-4 h-4 text-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* ── Hero ── */}
        <section className="text-center space-y-4 animate-fade-in">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sage bg-sage/10 px-3 py-1 rounded-full">
            Phase 1 · Foundation
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            Beauty, <em className="not-italic text-dusty-rose">effortlessly</em> booked.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            AuraBook connects you with trusted beauty artists. Discover services,
            build your session, and book with confidence.
          </p>
        </section>

        {/* ── Brand Colors ── */}
        <section className="bg-card rounded-3xl border border-border p-6 md:p-8 space-y-5 animate-fade-in">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Brand Palette
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gentle pastel minimalism — active theme:{" "}
              <span className="font-medium text-sage capitalize">
                {currentTheme}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <ColorSwatch color="#FDFBF7" label="Milk White" />
            <ColorSwatch color="#F7F4EB" label="Cream" />
            <ColorSwatch color="#8A9A86" label="Sage" />
            <ColorSwatch color="#C6A49A" label="Dusty Rose" />
            <ColorSwatch color="#2C2C2C" label="Graphite" textClass="text-foreground" />
            <ColorSwatch color="#1E1E1F" label="Deep Charcoal" textClass="text-foreground" />
            <ColorSwatch color="#E5E5E5" label="Off-White" textClass="text-foreground" />
          </div>
        </section>

        {/* ── Demo Services / Cart ── */}
        <section className="space-y-5 animate-fade-in">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Services
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Interact with the Zustand cart store below.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_SERVICES.map((service) => {
              const count = getItemCount(service.id);
              return (
                <div
                  key={service.id}
                  className="bg-card rounded-2xl border border-border p-5 space-y-3 hover:shadow-md transition-shadow"
                >
                  {service.isPopular && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-dusty-rose bg-dusty-rose/10 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(service.durationMinutes)}
                    </span>
                    <span className="font-semibold text-foreground ml-auto">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {count === 0 ? (
                      <button
                        onClick={() => addToCart(service)}
                        className="w-full py-2 rounded-xl bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => removeFromCart(service.id)}
                          className="w-9 h-9 rounded-xl bg-muted hover:bg-accent border border-border flex items-center justify-center text-foreground font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center font-semibold text-foreground">
                          {count}
                        </span>
                        <button
                          onClick={() => addToCart(service)}
                          className="w-9 h-9 rounded-xl bg-sage hover:bg-sage-dark text-white flex items-center justify-center font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Cart Summary ── */}
        {cart.items.length > 0 && (
          <section className="bg-card rounded-3xl border border-border p-6 space-y-4 animate-fade-in">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Your Session
            </h2>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div
                  key={item.service.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0" />
                    <span className="text-foreground">
                      {item.service.name}{" "}
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground">
                          ×{item.quantity}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-foreground font-medium">
                    {formatPrice(item.service.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(cart.totalDurationMinutes)} total</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-display font-semibold text-foreground">
                  {formatPrice(cart.totalCostCents)}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Foundation Checklist ── */}
        <section className="bg-card rounded-3xl border border-border p-6 md:p-8 space-y-4 animate-fade-in">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Phase 1 Checklist
          </h2>
          {[
            "Vite + React 18 + TypeScript initialized",
            "Custom Tailwind theme with AuraBook brand tokens",
            "Dark/light mode with class toggling on <html>",
            "Supabase client configured via VITE_ env vars",
            "Zustand UIStore with theme & cart state",
            "Strict TypeScript interfaces across /types",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </section>
      </main>

      <footer className="text-center py-8 text-xs text-muted-foreground">
        AuraBook · Phase 1 Foundation · Built with Dyad
      </footer>
    </div>
  );
}