"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/lib/types";

interface HeaderClientProps {
  siteName: string;
  menuItems: MenuItem[];
  logoUrl?: string | null;
}

export default function HeaderClient({ siteName, menuItems, logoUrl }: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Fecha menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-mobile-menu]")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const rootItems = menuItems.filter((item) => !item.parentId);

  return (
    <>
      {/* ── Desktop header ── */}
      <div className="hidden md:flex max-w-6xl mx-auto px-4 py-2 items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-xl font-bold text-slate-900 hover:text-emerald-700 transition-colors">
              {siteName}
            </span>
          )}
        </Link>

        <nav className="flex gap-1 items-center flex-wrap">
          {rootItems.length > 0 ? (
            rootItems.map((item) => (
              <Link
                key={item.id}
                href={item.path || item.url}
                className="text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/posts"
                className="text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
              >
                Blog
              </Link>
            </>
          )}
        </nav>

        {/* Busca desktop */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Buscar"
          className="ml-2 p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
      </div>

      {/* ── Mobile header ── */}
      <div className="flex md:hidden px-4 py-2 items-center justify-between" data-mobile-menu>
        {/* Botão hambúrguer */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Logo centralizada */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center hover:opacity-80 transition-opacity"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-lg font-bold text-slate-900">{siteName}</span>
          )}
        </Link>

        {/* Botão de busca */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Buscar"
          className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
      </div>

      {/* ── Dropdown menu mobile ── */}
      {menuOpen && (
        <div
          data-mobile-menu
          className="md:hidden border-t border-slate-100 bg-white py-2 px-2 shadow-md"
        >
          {rootItems.length > 0 ? (
            rootItems.map((item) => (
              <Link
                key={item.id}
                href={item.path || item.url}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-3 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-3 rounded-xl transition-colors">Home</Link>
              <Link href="/posts" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-3 rounded-xl transition-colors">Blog</Link>
            </>
          )}
        </div>
      )}

      {/* ── Barra de pesquisa (mobile + desktop) ── */}
      {searchOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-sm">
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto">
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artigos..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-colors"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Fechar busca"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
