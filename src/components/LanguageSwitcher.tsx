"use client";

import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n-config";

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const allLocales: string[] = ["pt", ...LOCALES];

  // Remove o prefixo de locale atual do pathname
  function stripLocale(path: string): string {
    for (const loc of LOCALES) {
      if (path.startsWith(`/${loc}/`)) return path.slice(loc.length + 1);
      if (path === `/${loc}`) return "/";
    }
    return path;
  }

  function buildUrl(locale: string) {
    const cleanPath = stripLocale(pathname || "/");
    if (locale === "pt") return cleanPath;
    return `/${locale}${cleanPath}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    window.location.href = buildUrl(e.target.value);
  }

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 cursor-pointer hover:border-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
      aria-label="Selecionar idioma"
    >
      {allLocales.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
