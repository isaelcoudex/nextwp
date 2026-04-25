import { getMenuByLocation, getSiteSettings, getSiteLogoUrl } from "@/lib/wordpress";
import HeaderClient from "@/components/HeaderClient";
import { getLocale, toDeeplLang } from "@/lib/locale";
import { translateText } from "@/lib/translate";

export default async function Header() {
  const [menuItems, settings, logoUrl, locale] = await Promise.all([
    getMenuByLocation("MENU_1").catch(() => []),
    getSiteSettings().catch(() => null),
    getSiteLogoUrl().catch(() => null),
    getLocale(),
  ]);

  const lang = toDeeplLang(locale);

  // Traduz labels do menu se não for PT
  const translatedMenuItems = await Promise.all(
    menuItems.map(async (item) => ({
      ...item,
      label: await translateText(item.label, lang),
    }))
  );

  const siteName = settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || "Meu Blog";

  return (
    <header className="bg-white border-b border-slate-100 md:sticky md:top-0 md:z-50 relative z-40">
      <HeaderClient siteName={siteName} menuItems={translatedMenuItems} logoUrl={logoUrl} locale={locale} />
    </header>
  );
}
