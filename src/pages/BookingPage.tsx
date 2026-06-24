import { useParams } from "react-router-dom";
import { Sparkles, Clock, MapPin, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_MASTER = {
  displayName: "Alina Kovaleva",
  username: "alina.beauty",
  bio: "Certified aesthetic therapist with 7+ years of experience in skin care, brow design, and body treatments.",
  rating: 4.9,
  reviewCount: 134,
  location: "Moscow, Arbat district",
  avatarInitials: "AK",
};

const MOCK_PUBLIC_SERVICES = [
  { id: "s1", name: "Signature Facial", duration: 60, price: 9500, category: "Skin" },
  { id: "s2", name: "Gel Manicure", duration: 45, price: 4500, category: "Nails" },
  { id: "s3", name: "Brow Lamination", duration: 50, price: 6000, category: "Brows" },
];

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(cents / 100);

export default function BookingPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage" />
          <span className="font-display text-lg font-semibold text-foreground">AuraBook</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Master profile card */}
        <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center text-center gap-4 animate-fade-in">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-3xl bg-sage/20 flex items-center justify-center text-2xl font-display font-semibold text-sage">
            {MOCK_MASTER.avatarInitials}
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {MOCK_MASTER.displayName}
            </h1>
            <p className="text-sm text-muted-foreground">@{username ?? MOCK_MASTER.username}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-sage font-semibold">
              <Star className="w-3.5 h-3.5 fill-sage" />
              {MOCK_MASTER.rating}
              <span className="text-muted-foreground font-normal">
                ({MOCK_MASTER.reviewCount})
              </span>
            </div>
            <span className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {MOCK_MASTER.location}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {MOCK_MASTER.bio}
          </p>
        </div>

        {/* Services list */}
        <section className="space-y-4 animate-fade-in">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Choose a service
          </h2>
          <div className="space-y-3">
            {MOCK_PUBLIC_SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sage">
                    {svc.category}
                  </span>
                  <p className="text-sm font-semibold text-foreground">{svc.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {svc.duration} min
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(svc.price)}
                  </span>
                  <button className="bg-sage hover:bg-sage-dark text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Powered by <span className="text-sage font-medium">AuraBook</span>
        </p>
      </main>
    </div>
  );
}