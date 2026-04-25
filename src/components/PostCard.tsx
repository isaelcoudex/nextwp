import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { localePath, t } from "@/lib/i18n-config";
import { translateText, translateHtml } from "@/lib/translate";

interface PostCardProps {
  post: Post;
  compact?: boolean;
  locale?: string;
}

export default async function PostCard({ post, compact = false, locale = "pt" }: PostCardProps) {
  const lang = locale.toUpperCase();

  const [title, excerpt] = await Promise.all([
    translateText(post.title, lang),
    post.excerpt ? translateHtml(post.excerpt, lang) : Promise.resolve(""),
  ]);

  const postHref = localePath(locale, `/posts/${post.slug}`);
  const catHref = (slug: string) => localePath(locale, `/category/${slug}`);

  const date = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Link principal cobre o card inteiro */}
      <Link href={postHref} className="absolute inset-0 z-0" aria-label={title} />

      {post.featuredImage?.node?.sourceUrl && (
        <div className={`relative w-full overflow-hidden ${compact ? "h-36" : "h-52"}`}>
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || title}
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
                href={catHref(cat.slug)}
                className="relative z-10 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <h2 className={`font-bold mb-2 text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors ${compact ? "text-sm" : "text-lg"}`}>
          {title}
        </h2>
        {!compact && excerpt && (
          <div
            className="text-slate-500 text-sm line-clamp-2 mb-5"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-400">{date}</span>
          <span className="text-xs font-semibold text-emerald-700">
            {t(locale, "readMore")}
          </span>
        </div>
      </div>
    </article>
  );
}

