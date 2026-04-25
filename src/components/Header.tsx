import { getMenuByLocation, getSiteSettings, getSiteLogoUrl } from "@/lib/wordpress";
import HeaderClient from "@/components/HeaderClient";

export default async function Header() {
  const [menuItems, settings, logoUrl] = await Promise.all([
    getMenuByLocation("MENU_1").catch(() => []),
    getSiteSettings().catch(() => null),
    getSiteLogoUrl().catch(() => null),
  ]);

  const siteName = settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || "Meu Blog";

  return (
    <header className="bg-white border-b border-slate-100 md:sticky md:top-0 md:z-50 relative z-40">
      <HeaderClient siteName={siteName} menuItems={menuItems} logoUrl={logoUrl} />
    </header>
  );
}
