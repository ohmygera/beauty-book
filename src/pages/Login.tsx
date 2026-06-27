import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-6 h-6 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C9.58 4 6 7.58 6 12c0 3.54 2.29 6.53 5.47 7.59L14 24l2.53-4.41C19.71 18.53 22 15.54 22 12c0-4.42-3.58-8-8-8z" fill="white" opacity="0.9"/>
              <circle cx="14" cy="12" r="3" fill="white"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">BeautyBook</h1>
          <p className="text-sm text-muted-foreground mt-1">Кабинет мастера</p>
        </div>

        {/* Auth form */}
        <div className="bg-white rounded-3xl shadow-sm border border-border p-6">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#7C9A7E",
                    brandAccent: "#5e7d60",
                    inputBackground: "white",
                    inputBorder: "hsl(35 15% 88%)",
                    inputBorderFocus: "#7C9A7E",
                    inputText: "hsl(25 15% 15%)",
                  },
                  radii: {
                    borderRadiusButton: "12px",
                    buttonBorderRadius: "12px",
                    inputBorderRadius: "12px",
                  },
                  fontSizes: {
                    baseBodySize: "14px",
                    baseLabelSize: "13px",
                  },
                },
              },
              style: {
                button: { fontWeight: "600" },
                anchor: { color: "#7C9A7E" },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Пароль",
                  email_input_placeholder: "you@example.com",
                  password_input_placeholder: "Ваш пароль",
                  button_label: "Войти",
                  link_text: "Уже есть аккаунт? Войти",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Пароль",
                  email_input_placeholder: "you@example.com",
                  password_input_placeholder: "Минимум 6 символов",
                  button_label: "Создать аккаунт",
                  link_text: "Нет аккаунта? Зарегистрироваться",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
