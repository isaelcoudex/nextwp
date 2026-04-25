import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export default function PostCard({ post, compact = false }: PostCardProps) {
  const date = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Link principal cobre o card inteiro */}
      <Link href={`/posts/${post.slug}`} className="absolute inset-0 z-0" aria-label={post.title} />

      {post.featuredImage?.node?.sourceUrl && (
        <div className={`relative w-full overflow-hidden ${compact ? "h-36" : "h-52"}`}>
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            sizes={compact ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className={compact ? "p-4" : "p-6"}>
        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {post.categories.nodes.slice(0, 1).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="relative z-10 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <h2 className={`font-bold mb-2 text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors ${compact ? "text-sm" : "text-lg"}`}>
          {post.title}
        </h2>
        {!compact && post.excerpt && (
          <div
            className="text-slate-500 text-sm line-clamp-2 mb-5"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-400">{date}</span>
          <span className="text-xs font-semibold text-emerald-700">
            Leia mais →
          </span>
        </div>
      </div>
    </article>
  );
}
