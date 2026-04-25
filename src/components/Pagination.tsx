import Link from "next/link";
import { localePath, t } from "@/lib/i18n-config";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string; // ex: "/posts" ou "/category/credit"
  locale?: string;
}

export default function Pagination({ currentPage, hasNextPage, basePath, locale = "pt" }: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  if (currentPage === 1 && !hasNextPage) return null;

  const prevHref = localePath(locale, prevPage === 1 ? basePath : `${basePath}?page=${prevPage}`);
  const nextHref = localePath(locale, `${basePath}?page=${nextPage}`);

  return (
    <nav className="flex items-center justify-center gap-3 mt-12">
      {currentPage > 1 && (
        <Link
          href={prevHref}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        >
          {t(locale, "previous")}
        </Link>
      )}
      <span className="px-4 py-2.5 text-sm text-slate-400">
        {t(locale, "page")} {currentPage}
      </span>
      {hasNextPage && (
        <Link
          href={nextHref}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        >
          {t(locale, "next")}
        </Link>
      )}
    </nav>
  );
}

