import Link from "next/link";
import { getMenuByLocation, getSiteSettings } from "@/lib/wordpress";
import { getLocale, toDeeplLang } from "@/lib/locale";
import { translateText } from "@/lib/translate";
import { localePath, t } from "@/lib/i18n-config";

export default async function Footer() {
  const year = new Date().getFullYear();

  const [footerItems, settings, locale] = await Promise.all([
    getMenuByLocation("FOOTER").catch(() => []),
    getSiteSettings().catch(() => null),
    getLocale(),
  ]);

  const lang = toDeeplLang(locale);
  const siteName = settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || "Meu Blog";

  // Traduz labels + descrição
  const [translatedDescription, translatedItems] = await Promise.all([
    settings?.description ? translateText(settings.description, lang) : Promise.resolve(""),
    Promise.all(
      footerItems
        .filter((item) => !item.parentId)
        .map(async (item) => ({
          ...item,
          label: await translateText(item.label, lang),
        }))
    ),
  ]);

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Marca */}
        <div className="text-center mb-8">
          <Link href={localePath(locale, "/")} className="text-slate-900 font-bold text-lg hover:text-emerald-700 transition-colors">
            {siteName}
          </Link>
          {translatedDescription && (
            <p className="text-sm text-slate-500 leading-relaxed mt-2 max-w-sm mx-auto">
              {translatedDescription}
            </p>
          )}
        </div>

        {/* Links do menu footer */}
        {translatedItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
            {translatedItems.map((item) => (
              <Link
                key={item.id}
                href={localePath(locale, item.path || item.url)}
                className="text-sm text-slate-500 hover:text-emerald-700 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 text-center">
          <p>© {year} {siteName}. {t(locale, "allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}

