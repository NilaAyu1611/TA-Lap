"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

import { redirectAfterLogin } from "@/lib/authRedirect";
import { storeToken, storeUser } from "@/lib/auth";
import { getGoogleAuthConfig, loginWithGoogle } from "@/services/auth.service";

type Props = {
  onError?: (message: string) => void;
  disabled?: boolean;
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GoogleLoginInner({ onError, disabled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const googleHostRef = useRef<HTMLDivElement>(null);

  const handleSuccess = useCallback(
    async (credentialResponse: { credential?: string }) => {
      if (!credentialResponse.credential) {
        onError?.("Login Google gagal. Coba lagi.");
        return;
      }

      try {
        setLoading(true);
        const data = await loginWithGoogle(credentialResponse.credential);
        storeToken(data.token);
        storeUser(data.user);
        redirectAfterLogin(router, data.user);
      } catch (err: unknown) {
        const message =
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data &&
          typeof err.response.data.message === "string"
            ? err.response.data.message
            : "Login Google gagal";
        onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [onError, router]
  );

  const triggerGoogleLogin = () => {
    if (disabled || loading) return;
    const googleBtn = googleHostRef.current?.querySelector(
      '[role="button"]'
    ) as HTMLElement | null;
    googleBtn?.click();
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={triggerGoogleLogin}
        disabled={disabled || loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-100 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 dark:shadow-none dark:hover:border-cyan-500/40 dark:hover:bg-white/[0.08]"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin text-cyan-500" />
        ) : (
          <GoogleIcon />
        )}
        Lanjutkan dengan Google
      </button>

      <div
        ref={googleHostRef}
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.01]"
        aria-hidden
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError?.("Login Google dibatalkan atau gagal")}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
          width="400"
          useOneTap={false}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 cursor-wait rounded-xl bg-white/50 dark:bg-[#060b14]/50" />
      )}
    </div>
  );
}

export default function GoogleSignInButton({ onError, disabled }: Props) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

    if (envClientId) {
      setClientId(envClientId);
      setChecking(false);
      return;
    }

    getGoogleAuthConfig()
      .then((config) => {
        if (config.enabled && config.clientId) {
          setClientId(config.clientId);
        }
      })
      .catch(() => {
        /* Google login optional */
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex h-11 items-center justify-center rounded-xl border border-cyan-100 dark:border-white/10">
        <Loader2 size={18} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!clientId) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 px-3 py-2 text-center text-xs text-gray-500 dark:border-white/15 dark:text-gray-400">
        Login Google belum aktif. Isi GOOGLE_CLIENT_ID di backend .env dan
        NEXT_PUBLIC_GOOGLE_CLIENT_ID di frontend.
      </p>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLoginInner onError={onError} disabled={disabled} />
    </GoogleOAuthProvider>
  );
}
