import { Plus, Clock, DollarSign, Eye, EyeOff, GripVertical } from "lucide-react";

const MOCK_SERVICES = [
  {
    id: "svc-1",
    name: "Signature Facial",
    description: "Deeply restorative skin treatment",
    price: 9500,
    duration: 60,
    isVisible: true,
    category: "Skin",
  },
  {
    id: "svc-2",
    name: "Gel Manicure",
    description: "Long-lasting gel polish with cuticle care",
    price: 4500,
    duration: 45,
    isVisible: true,
    category: "Nails",
  },
  {
    id: "svc-3",
    name: "Brow Lamination",
    description: "Lift, set and define your natural brows",
    price: 6000,
    duration: 50,
    isVisible: true,
    category: "Brows",
  },
  {
    id: "svc-4",
    name: "Deep Tissue Massage",
    description: "Full-body restorative massage session",
    price: 12000,
    duration: 90,
    isVisible: false,
    category: "Body",
  },
];

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(cents / 100);

export function ServicesTab() {
  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Services</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {MOCK_SERVICES.filter((s) => s.isVisible).length} visible · {MOCK_SERVICES.length} total
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-sage hover:bg-sage-dark text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Service cards */}
      <div className="space-y-3">
        {MOCK_SERVICES.map((svc) => (
          <div
            key={svc.id}
            className={`bg-card border rounded-2xl p-4 flex items-start gap-3 transition-opacity ${
              svc.isVisible ? "border-border" : "border-border opacity-60"
            }`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 cursor-grab" />

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sage">
                    {svc.category}
                  </span>
                  <p className="text-sm font-semibold text-foreground">{svc.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                </div>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0">
                  {svc.isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-sage" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {svc.duration}m
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  <DollarSign className="w-3 h-3 text-sage" />
                  {formatPrice(svc.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}