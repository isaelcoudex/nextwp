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

  // Captura o host do site (SSR seguro)
  let siteHost = "";
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
      siteHost = url.host;
    } catch {}
  }

  // Aviso legal fixo em PT
  const legalNoticePT = `
Sob nenhuma circunstância vamos exigir que você pague para liberar qualquer tipo de produto, incluindo cartões de crédito, empréstimos ou qualquer outra oferta. Se isso acontecer, entre em contato conosco imediatamente. Sempre leia os termos e condições do provedor de serviços, seja uma instituição financeira, órgão privado ou público e outros, com o qual você está entrando em contato. Nós ganhamos dinheiro com publicidade e quando indicamos alguns dos produtos apresentados neste site, https://${siteHost}/ . Todas as publicações são baseadas em pesquisas quantitativas e qualitativas, e nossa equipe se esforça para ser a mais justa possível ao comparar opções concorrentes.

Informação sobre Anunciantes

Somos um site de conteúdo independente, objetivo e com suporte de publicidade. Para apoiar nossa capacidade de fornecer conteúdo gratuito aos nossos usuários, as recomendações que aparecem em nosso site podem ser de empresas das quais recebemos compensação de afiliado. Essa compensação pode afetar como, onde e em que ordem as ofertas aparecem em nosso site. Outros fatores, como nossos algoritmos proprietários e dados coletados, também podem afetar como e onde os produtos ou ofertas são colocados neste site. Nós não incluímos todas as ofertas financeiras ou de crédito disponíveis.

Nota Editorial

A compensação que recebemos de nossos parceiros afiliados não influencia as recomendações ou conselhos que nossa equipe de redatores fornece em nossos artigos nem afeta qualquer conteúdo do site. Embora trabalhemos arduamente para fornecer informações precisas e atualizadas que acreditamos que nossos usuários acharão relevantes, não garantimos que todas as informações fornecidas sejam completas e não fazemos representações ou garantias quanto à sua precisão ou aplicabilidade.`;

  // Traduz aviso legal conforme locale (DeepL)
  const translatedLegalNotice = await translateText(legalNoticePT, lang);

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

        {/* Aviso Legal */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mb-8 text-xs text-slate-600 text-left max-w-3xl mx-auto" style={{ whiteSpace: 'pre-line' }}>
          <strong>Aviso Legal</strong>
          {`\n` + translatedLegalNotice}
        </div>

        <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 text-center">
          <p>© {year} {siteName}. {t(locale, "allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}

