import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type {
  UIStore,
  ThemeMode,
  Service,
  ClientCartState,
} from "@/types";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialCart: ClientCartState = {
  items: [],
  totalCostCents: 0,
  totalDurationMinutes: 0,
};

// ─── Theme DOM Helper ─────────────────────────────────────────────────────────

function applyThemeToDom(theme: ThemeMode): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
}

// ─── Cart Recalculator ────────────────────────────────────────────────────────

function recalcCart(
  items: ClientCartState["items"]
): Pick<ClientCartState, "totalCostCents" | "totalDurationMinutes"> {
  return items.reduce(
    (acc, item) => ({
      totalCostCents: acc.totalCostCents + item.service.price * item.quantity,
      totalDurationMinutes:
        acc.totalDurationMinutes + item.service.durationMinutes * item.quantity,
    }),
    { totalCostCents: 0, totalDurationMinutes: 0 }
  );
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ── State ──────────────────────────────────────────────────────────────
        currentTheme: "light" as ThemeMode,
        cart: initialCart,

        // ── Theme Actions ──────────────────────────────────────────────────────
        toggleTheme: () => {
          const next: ThemeMode =
            get().currentTheme === "light" ? "dark" : "light";
          applyThemeToDom(next);
          set({ currentTheme: next }, false, "toggleTheme");
        },

        setTheme: (theme: ThemeMode) => {
          applyThemeToDom(theme);
          set({ currentTheme: theme }, false, "setTheme");
        },

        // ── Cart Actions ───────────────────────────────────────────────────────
        addToCart: (service: Service) => {
          const { cart } = get();
          const existing = cart.items.find(
            (item) => item.service.id === service.id
          );

          let updatedItems: ClientCartState["items"];

          if (existing) {
            updatedItems = cart.items.map((item) =>
              item.service.id === service.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedItems = [
              ...cart.items,
              { service, quantity: 1, addedAt: new Date() },
            ];
          }

          const { totalCostCents, totalDurationMinutes } =
            recalcCart(updatedItems);

          set(
            {
              cart: {
                items: updatedItems,
                totalCostCents,
                totalDurationMinutes,
              },
            },
            false,
            "addToCart"
          );
        },

        removeFromCart: (serviceId: string) => {
          const { cart } = get();
          const updatedItems = cart.items
            .map((item) =>
              item.service.id === serviceId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0);

          const { totalCostCents, totalDurationMinutes } =
            recalcCart(updatedItems);

          set(
            {
              cart: {
                items: updatedItems,
                totalCostCents,
                totalDurationMinutes,
              },
            },
            false,
            "removeFromCart"
          );
        },

        clearCart: () => {
          set({ cart: initialCart }, false, "clearCart");
        },
      }),
      {
        name: "aurabook-ui-store",
        partialize: (state) => ({ currentTheme: state.currentTheme }),
        onRehydrateStorage: () => (state) => {
          if (state?.currentTheme) {
            applyThemeToDom(state.currentTheme);
          }
        },
      }
    ),
    { name: "AuraBook/UIStore" }
  )
);