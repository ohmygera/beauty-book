import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type Mode = "sign_in" | "sign_up";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);

    try {
      if (mode === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Письмо с подтверждением отправлено на вашу почту. Проверьте входящие.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      if (msg.includes("Invalid login credentials")) {
        setError("Неверный email или пароль");
      } else if (msg.includes("User already registered")) {
        setError("Пользователь с таким email уже существует");
      } else if (msg.includes("Password should be at least")) {
        setError("Пароль должен содержать минимум 6 символов");
      } else {
        setError(msg);
      }
    } finally {
      setPending(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "sign_in" ? "sign_up" : "sign_in"));
    setError(null);
    setInfo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-6 h-6 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage mb-4 shadow-sm">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 4C9.58 4 6 7.58 6 12c0 3.54 2.29 6.53 5.47 7.59L14 24l2.53-4.41C19.71 18.53 22 15.54 22 12c0-4.42-3.58-8-8-8z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="14" cy="12" r="3" fill="white" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            BeautyBook
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Кабинет мастера</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-border p-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              {mode === "sign_in" ? "Вход в аккаунт" : "Создать аккаунт"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "sign_in"
                ? "Введите email и пароль для входа"
                : "Зарегистрируйтесь, чтобы начать работу"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className={cn(inputClass, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/25 text-destructive text-sm rounded-xl px-3.5 py-2.5">
                {error}
              </div>
            )}

            {/* Info */}
            {info && (
              <div className="bg-sage/10 border border-sage/25 text-sage-dark text-sm rounded-xl px-3.5 py-2.5">
                {info}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-dark active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 mt-1"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "sign_in" ? (
                "Войти"
              ) : (
                "Создать аккаунт"
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "sign_in" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              onClick={switchMode}
              className="font-semibold text-sage hover:text-sage-dark transition-colors"
            >
              {mode === "sign_in" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
