import { getAllPosts } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { Post } from "@/lib/types";
import { getLocale } from "@/lib/locale";

export const revalidate = 60;

const PER_PAGE = 12;

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const locale = await getLocale();

  let posts: Post[] = [];
  let hasNextPage = false;

  try {
    const result = await getAllPosts(currentPage * PER_PAGE);
    const allPosts = result.posts;
    const start = (currentPage - 1) * PER_PAGE;
    posts = allPosts.slice(start, start + PER_PAGE);
    hasNextPage = result.pageInfo.hasNextPage || allPosts.length > currentPage * PER_PAGE;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {posts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-xl mb-2">Nenhum post encontrado.</p>
          <p className="text-sm">Verifique a variável <code className="bg-slate-100 px-2 py-0.5 rounded">NEXT_PUBLIC_WORDPRESS_API_URL</code> no .env.local</p>
        </div>
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
            basePath="/"
            locale={locale}
          />
        </>
      )}
    </div>
  );
}
