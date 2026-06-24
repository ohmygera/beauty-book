// ─── Service & Booking Types ──────────────────────────────────────────────────

export type ServiceCategory =
  | "hair"
  | "nails"
  | "skin"
  | "brows"
  | "lashes"
  | "body"
  | "massage";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;           // in cents
  durationMinutes: number;
  imageUrl?: string;
  isPopular?: boolean;
  isAvailable: boolean;
}

export interface CartItem {
  service: Service;
  quantity: number;
  addedAt: Date;
}

// ─── Cart State ───────────────────────────────────────────────────────────────

export interface ClientCartState {
  items: CartItem[];
  totalCostCents: number;
  totalDurationMinutes: number;
}

// ─── UI / Theme Types ─────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark";

export interface UIState {
  currentTheme: ThemeMode;
  cart: ClientCartState;
}

// ─── Store Action Types ───────────────────────────────────────────────────────

export interface UIActions {
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
}

export type UIStore = UIState & UIActions;

// ─── Supabase / Auth Types ────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  artistId: string;
  services: Service[];
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalCostCents: number;
  totalDurationMinutes: number;
  notes?: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  fullName: string;
  specialties: ServiceCategory[];
  bio?: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}