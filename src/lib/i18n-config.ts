// Constantes de i18n — sem dependências de servidor, safe para client components

export const LOCALES = ["en", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number] | "pt";
export const DEFAULT_LOCALE: Locale = "pt";

export const LOCALE_LABELS: Record<string, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
  fr: "FR",
};

/** Strings estáticas da UI por idioma */
export const UI_STRINGS: Record<string, Record<string, string>> = {
  pt: {
    readMore: "Leia mais →",
    previous: "← Anterior",
    next: "Próxima →",
    page: "Página",
    category: "Categoria",
    author: "Autor",
    readAlso: "Leia também",
    noPostsFound: "Nenhum post encontrado.",
    noPostsCategory: "Nenhum post encontrado nesta categoria.",
    allRightsReserved: "Todos os direitos reservados.",
    searchPlaceholder: "Buscar artigos...",
    searchButton: "Buscar",
  },
  en: {
    readMore: "Read more →",
    previous: "← Previous",
    next: "Next →",
    page: "Page",
    category: "Category",
    author: "Author",
    readAlso: "Read also",
    noPostsFound: "No posts found.",
    noPostsCategory: "No posts found in this category.",
    allRightsReserved: "All rights reserved.",
    searchPlaceholder: "Search articles...",
    searchButton: "Search",
  },
  es: {
    readMore: "Leer más →",
    previous: "← Anterior",
    next: "Siguiente →",
    page: "Página",
    category: "Categoría",
    author: "Autor",
    readAlso: "Lee también",
    noPostsFound: "No se encontraron publicaciones.",
    noPostsCategory: "No se encontraron publicaciones en esta categoría.",
    allRightsReserved: "Todos los derechos reservados.",
    searchPlaceholder: "Buscar artículos...",
    searchButton: "Buscar",
  },
  fr: {
    readMore: "Lire la suite →",
    previous: "← Précédent",
    next: "Suivant →",
    page: "Page",
    category: "Catégorie",
    author: "Auteur",
    readAlso: "Lire aussi",
    noPostsFound: "Aucun article trouvé.",
    noPostsCategory: "Aucun article trouvé dans cette catégorie.",
    allRightsReserved: "Tous droits réservés.",
    searchPlaceholder: "Rechercher des articles...",
    searchButton: "Rechercher",
  },
};

/** Retorna string de UI para o locale. Fallback para PT. */
export function t(locale: string, key: keyof (typeof UI_STRINGS)["pt"]): string {
  return UI_STRINGS[locale]?.[key] ?? UI_STRINGS["pt"][key];
}

/**
 * Constrói path com prefixo de locale.
 * localePath("en", "/posts/slug") → "/en/posts/slug"
 * localePath("pt", "/posts/slug") → "/posts/slug"
 */
export function localePath(locale: string, path: string): string {
  if (!locale || locale === "pt") return path;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
