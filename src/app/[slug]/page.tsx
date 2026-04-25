import { getPageBySlug, getAllPages } from "@/lib/wordpress";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLocale, toDeeplLang } from "@/lib/locale";
import { translateText, translateHtml } from "@/lib/translate";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const pages = await getAllPages();
    return pages.map((page) => ({ slug: page.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);

  if (!page) return { title: "Página não encontrada" };

  return {
    title: page.title,
    openGraph: {
      images: page.featuredImage?.node?.sourceUrl
        ? [page.featuredImage.node.sourceUrl]
        : [],
    },
  };
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);

  if (!page) notFound();

  const locale = await getLocale();
  const lang = toDeeplLang(locale);

  const [translatedTitle, translatedContent] = await Promise.all([
    translateText(page.title, lang),
    translateHtml(page.content || "", lang),
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {page.featuredImage?.node?.sourceUrl && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={page.featuredImage.node.sourceUrl}
            alt={page.featuredImage.node.altText || translatedTitle}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
        {translatedTitle}
      </h1>

      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: translatedContent }}
      />
    </article>
  );
}

