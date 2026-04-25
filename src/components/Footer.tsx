import Link from "next/link";
import { getMenuByLocation, getSiteSettings } from "@/lib/wordpress";

export default async function Footer() {
  const year = new Date().getFullYear();

  const [footerItems, settings] = await Promise.all([
    getMenuByLocation("FOOTER").catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const siteName = settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || "Meu Blog";

  const rootItems = footerItems.filter((item) => !item.parentId);

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Marca */}
        <div className="text-center mb-8">
          <Link href="/" className="text-slate-900 font-bold text-lg hover:text-emerald-700 transition-colors">
            {siteName}
          </Link>
          {settings?.description && (
            <p className="text-sm text-slate-500 leading-relaxed mt-2 max-w-sm mx-auto">
              {settings.description}
            </p>
          )}
        </div>

        {/* Links do menu footer */}
        {rootItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
            {rootItems.map((item) => (
              <Link
                key={item.id}
                href={item.path || item.url}
                className="text-sm text-slate-500 hover:text-emerald-700 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 text-center">
          <p>© {year} {siteName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
