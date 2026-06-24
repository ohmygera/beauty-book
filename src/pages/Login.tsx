import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/config/supabase";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === "login") {
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
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message.includes("already registered")
          ? "Этот email уже зарегистрирован. Войдите в систему."
          : "Не удалось зарегистрироваться. Попробуйте снова.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Аккаунт создан! Теперь войдите в систему.");
      setMode("login");
      setPassword("");
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
    setSuccessMessage(null);
    setPassword("");
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
              {mode === "login" ? "Вход в систему" : "Регистрация"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Войдите, чтобы управлять записями и услугами."
                : "Создайте аккаунт мастера AuraBook."}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-dusty-rose/10 border border-dusty-rose/30 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-dusty-rose mt-0.5 flex-shrink-0" />
              <p className="text-sm text-dusty-rose leading-relaxed">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-3 bg-sage/10 border border-sage/30 rounded-2xl px-4 py-3">
              <Sparkles className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <p className="text-sm text-sage leading-relaxed">{successMessage}</p>
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
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-10 pr-11 py-2.5 rounded-xl text-sm",
                    "bg-background border border-input text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "transition-colors"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {mode === "register" && (
                <p className="text-[11px] text-muted-foreground">
                  Минимум 6 символов
                </p>
              )}
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
                  {mode === "login" ? "Вход…" : "Регистрация…"}
                </>
              ) : mode === "login" ? (
                "Войти"
              ) : (
                "Зарегистрироваться"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            onClick={switchMode}
            className="text-sage font-medium hover:underline"
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}