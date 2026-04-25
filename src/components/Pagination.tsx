import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string; // ex: "/posts" ou "/category/credit"
}

export default function Pagination({ currentPage, hasNextPage, basePath }: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  if (currentPage === 1 && !hasNextPage) return null;

  return (
    <nav className="flex items-center justify-center gap-3 mt-12">
      {currentPage > 1 && (
        <Link
          href={prevPage === 1 ? basePath : `${basePath}?page=${prevPage}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        >
          ← Anterior
        </Link>
      )}
      <span className="px-4 py-2.5 text-sm text-slate-400">
        Página {currentPage}
      </span>
      {hasNextPage && (
        <Link
          href={`${basePath}?page=${nextPage}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        >
          Próxima →
        </Link>
      )}
    </nav>
  );
}
