"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RedirectCountdownProps {
  url: string;
}

export default function RedirectCountdown({ url }: RedirectCountdownProps) {
  const [seconds, setSeconds] = useState(5);
  const router = useRouter();

  // Valida URL básica
  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(url);
    // Só permite http e https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      parsedUrl = null;
    }
  } catch {
    parsedUrl = null;
  }

  useEffect(() => {
    if (!parsedUrl) return;

    if (seconds <= 0) {
      window.location.href = parsedUrl.href;
      return;
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, parsedUrl]);

  if (!parsedUrl) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold">Link inválido.</p>
      </div>
    );
  }

  const hostname = parsedUrl.hostname;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Ícone */}
      <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-2">
        Você está saindo do site
      </h1>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">
        Você será redirecionado para um site externo. Certifique-se de confiar no destino antes de continuar.
      </p>

      {/* Destino */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-8 max-w-sm w-full">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Destino</p>
        <p className="text-sm font-semibold text-slate-700 break-all">{hostname}</p>
      </div>

      {/* Countdown */}
      <div className="relative w-20 h-20 mb-6">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="#059669"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (seconds / 5)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">
          {seconds}
        </span>
      </div>

      <p className="text-sm text-slate-400 mb-6">
        Redirecionando em <strong className="text-slate-600">{seconds}</strong> segundo{seconds !== 1 ? "s" : ""}...
      </p>

      {/* Botões */}
      <div className="flex gap-3 flex-wrap justify-center">
        <a
          href={parsedUrl.href}
          className="px-6 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-colors"
        >
          Ir agora →
        </a>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
