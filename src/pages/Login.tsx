import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/config/supabase";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError("Неверный email или пароль. Попробуйте снова.");
      setIsLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="flex items-center gap-2 mb-10 animate-fade-in">
        <Sparkles className="w-6 h-6 text-sage" />
        <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
          AuraBook
        </span>
      </div>

      <div className="w-full max-w-sm animate-fade-in">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Вход в систему
            </h1>
            <p className="text-sm text-muted-foreground">
              Войдите, чтобы управлять записями и услугами.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-dusty-rose/10 border border-dusty-rose/30 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-dusty-rose mt-0.5 flex-shrink-0" />
              <p className="text-sm text-dusty-rose leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="вы@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                    "bg-background border border-input text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "transition-colors"
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                    "bg-background border border-input text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "transition-colors"
                  )}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2.5 rounded-xl text-sm font-semibold",
                "bg-sage hover:bg-sage-dark text-white",
                "transition-colors flex items-center justify-center gap-2",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Вход…
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Нет аккаунта?{" "}
          <span className="text-sage font-medium cursor-pointer hover:underline">
            Обратитесь в поддержку
          </span>
        </p>
      </div>
    </div>
  );
}