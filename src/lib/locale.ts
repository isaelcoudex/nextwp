import { headers } from "next/headers";
import type { Locale } from "@/lib/i18n-config";

export { LOCALES, DEFAULT_LOCALE, LOCALE_LABELS } from "@/lib/i18n-config";
export type { Locale };

/**
 * Lê o locale atual a partir do header x-locale setado pelo middleware.
 * Usar apenas em Server Components.
 */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const locale = h.get("x-locale") as Locale | null;
  return locale ?? "pt";
}

/**
 * Converte locale (ex: "en") para código DeepL (ex: "EN")
 */
export function toDeeplLang(locale: Locale | string): string {
  return locale.toUpperCase();
}
