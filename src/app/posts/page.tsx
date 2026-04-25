import { getAllPosts } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { Post } from "@/lib/types";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Posts | Blog",
  description: "Todos os posts do blog",
};

const PER_PAGE = 12;

interface PostsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  let posts: Post[] = [];
  let hasNextPage = false;

  try {
    // Busca (currentPage * PER_PAGE) posts e fatia para a página atual
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
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Todos os Posts</h1>
      <p className="text-slate-500 mb-10">Navegue por todo o conteúdo publicado.</p>

      {posts.length === 0 ? (
        <p className="text-slate-400 text-center py-12">Nenhum post encontrado.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            basePath="/posts"
          />
        </>
      )}
    </div>
  );
}
