import { getPostsByCategory } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { Post } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, toDeeplLang } from "@/lib/locale";
import { translateText } from "@/lib/translate";
import { localePath, t } from "@/lib/i18n-config";

export const revalidate = 60;

const PER_PAGE = 12;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getPostsByCategory(slug, 1);
  const name = category?.name ?? slug;
  return {
    title: `${name} | Blog`,
    description: category?.description ?? `Posts sobre ${name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const locale = await getLocale();
  const lang = toDeeplLang(locale);

  let posts: Post[] = [];
  let hasNextPage = false;
  let categoryName = slug;

  try {
    const result = await getPostsByCategory(slug, currentPage * PER_PAGE);
    const allPosts = result.posts;
    const start = (currentPage - 1) * PER_PAGE;
    posts = allPosts.slice(start, start + PER_PAGE);
    hasNextPage = result.pageInfo.hasNextPage || allPosts.length > currentPage * PER_PAGE;
    categoryName = result.category?.name ?? slug;

    if (allPosts.length === 0 && currentPage === 1) {
      notFound();
    }
  } catch (error) {
    console.error("Erro ao buscar posts da categoria:", error);
    notFound();
  }

  const translatedCategoryName = await translateText(categoryName, lang);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
          {t(locale, "category")}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{translatedCategoryName}</h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-400 text-center py-12">{t(locale, "noPostsCategory")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            basePath={`/category/${slug}`}
            locale={locale}
          />
        </>
      )}
    </div>
  );
}

