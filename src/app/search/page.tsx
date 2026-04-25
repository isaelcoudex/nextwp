import { getAllPosts } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import { Post } from "@/lib/types";
import { Metadata } from "next";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Busca: ${q} | Blog` : "Busca | Blog",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let results: Post[] = [];

  if (query) {
    try {
      // Busca todos os posts e filtra pelo termo no título ou excerpt
      const { posts } = await getAllPosts(100);
      const lower = query.toLowerCase();
      results = posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(lower) ||
          post.excerpt?.toLowerCase().includes(lower)
      );
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {query ? `Resultados para "${query}"` : "Busca"}
        </h1>
        {query && (
          <p className="text-slate-500 text-sm">
            {results.length} {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
          </p>
        )}
      </div>

      {!query && (
        <p className="text-slate-400 text-center py-12">Digite um termo para buscar artigos.</p>
      )}

      {query && results.length === 0 && (
        <p className="text-slate-400 text-center py-12">
          Nenhum artigo encontrado para <strong className="text-slate-600">{query}</strong>.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
