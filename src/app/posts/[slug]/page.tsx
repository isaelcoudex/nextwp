import { getPostBySlug, getAllPosts, getPostsByCategory } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import PostContent from "@/components/PostContent";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { posts } = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) return { title: "Post não encontrado" };

  return {
    title: post.title,
    description: post.excerpt?.replace(/<[^>]+>/g, ""),
    openGraph: {
      images: post.featuredImage?.node?.sourceUrl
        ? [post.featuredImage.node.sourceUrl]
        : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Posts recomendados: mesma categoria, excluindo o atual
  const firstCategory = post.categories?.nodes?.[0]?.slug;
  let recommended: import("@/lib/types").Post[] = [];
  try {
    if (firstCategory) {
      const { posts: catPosts } = await getPostsByCategory(firstCategory, 7);
      recommended = catPosts.filter((p) => p.slug !== slug).slice(0, 3);
    }
    if (recommended.length < 3) {
      const { posts: recent } = await getAllPosts(10);
      const extra = recent.filter(
        (p) => p.slug !== slug && !recommended.find((r) => r.slug === p.slug)
      );
      recommended = [...recommended, ...extra].slice(0, 3);
    }
  } catch {
    recommended = [];
  }

  const author = post.author?.node;

  return (
    <article className="max-w-3xl mx-auto px-4 pt-2 pb-16">
      {/* ── Título ── */}
      <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-5 leading-snug tracking-tight">
        {post.title}
      </h1>

      {/* ── Anúncio após o título ── */}
      <AdSlot slot="after-title" />

      {/* ── Imagem destacada ── */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative w-full h-56 md:h-96 mb-8 rounded-2xl overflow-hidden">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* ── Conteúdo ── */}
      <PostContent
        html={post.content || ""}
        className="prose prose-slate prose-base max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-lg prose-h3:text-base prose-p:leading-relaxed prose-p:text-slate-600 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
      />

      {/* ── Informações do post ── */}
      <div className="mt-10 pt-6 border-t border-slate-100 space-y-4">
        {/* Categorias */}
        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.nodes.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags?.nodes && post.tags.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.nodes.map((tag) => (
              <span
                key={tag.slug}
                className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Data */}
        <p className="text-sm text-slate-400">{date}</p>
      </div>

      {/* ── Bio do autor ── */}
      {author && (
        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start">
          {author.avatar?.url && (
            <div className="shrink-0">
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              Autor
            </p>
            <p className="font-bold text-slate-900 text-lg leading-tight mb-2">
              {author.name}
            </p>
            {author.description && (
              <p className="text-sm text-slate-500 leading-relaxed">
                {author.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Posts recomendados ── */}
      {recommended.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Leia também</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommended.map((p) => (
              <PostCard key={p.id} post={p} compact />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
