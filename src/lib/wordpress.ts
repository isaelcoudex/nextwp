import { fetchGraphQL } from "@/lib/graphql-client";
import {
  GET_ALL_POSTS,
  GET_POST_BY_SLUG,
  GET_ALL_PAGES,
  GET_PAGE_BY_SLUG,
  GET_SITE_SETTINGS,
  GET_MENU,
  GET_POSTS_BY_CATEGORY,
} from "@/lib/queries";
import { Post, Page, SiteSettings, MenuItem, PageInfo, Category } from "@/lib/types";

interface PostsData {
  posts: { nodes: Post[]; pageInfo: PageInfo };
}

interface PostData {
  post: Post | null;
}

interface PagesData {
  pages: { nodes: Page[] };
}

interface PageData {
  page: Page | null;
}

interface SiteSettingsData {
  generalSettings: SiteSettings;
}

interface MenuData {
  menuItems: { nodes: MenuItem[] };
}

interface CategoryPostsData {
  posts: { nodes: Post[]; pageInfo: PageInfo };
  categories: { nodes: Category[] };
}

export async function getAllPosts(first = 12, after?: string): Promise<{ posts: Post[]; pageInfo: PageInfo }> {
  const data = await fetchGraphQL<PostsData>(GET_ALL_POSTS, { first, after });
  return {
    posts: data?.posts?.nodes ?? [],
    pageInfo: data?.posts?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false, endCursor: "", startCursor: "" },
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await fetchGraphQL<PostData>(GET_POST_BY_SLUG, { slug });
  return data?.post ?? null;
}

export async function getAllPages(): Promise<Page[]> {
  const data = await fetchGraphQL<PagesData>(GET_ALL_PAGES, {}, 300);
  return data?.pages?.nodes ?? [];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchGraphQL<PageData>(GET_PAGE_BY_SLUG, { slug: `/${slug}/` }, 300);
  return data?.page ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await fetchGraphQL<SiteSettingsData>(GET_SITE_SETTINGS, {}, 3600);
  return data?.generalSettings ?? null;
}

export async function getSiteIconUrl(): Promise<string | null> {
  try {
    const settings = await getSiteSettings();
    if (!settings?.url) return null;
    const base = settings.url.replace(/\/$/, "");
    const res = await fetch(`${base}/wp-json/`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.site_icon_url as string) || null;
  } catch {
    return null;
  }
}

export async function getSiteLogoUrl(): Promise<string | null> {
  try {
    const settings = await getSiteSettings();
    if (!settings?.url) return null;
    const base = settings.url.replace(/\/$/, "");

    // /wp-json/ retorna site_logo como ID do attachment
    const rootRes = await fetch(`${base}/wp-json/`, { next: { revalidate: 3600 } });
    if (!rootRes.ok) return null;
    const rootData = await rootRes.json();
    const logoId = rootData.site_logo as number | undefined;
    if (!logoId) return null;

    // Busca a URL real do attachment
    const mediaRes = await fetch(`${base}/wp-json/wp/v2/media/${logoId}`, {
      next: { revalidate: 3600 },
    });
    if (!mediaRes.ok) return null;
    const mediaData = await mediaRes.json();
    return (mediaData?.source_url as string) || null;
  } catch {
    return null;
  }
}

export async function getMenuByLocation(location: string): Promise<MenuItem[]> {
  const data = await fetchGraphQL<MenuData>(GET_MENU, { location }, 3600);
  return data?.menuItems?.nodes ?? [];
}

export async function getPostsByCategory(
  slug: string,
  first = 12,
  after?: string
): Promise<{ posts: Post[]; pageInfo: PageInfo; category: Category | null }> {
  const data = await fetchGraphQL<CategoryPostsData>(GET_POSTS_BY_CATEGORY, { slug, first, after });
  return {
    posts: data?.posts?.nodes ?? [],
    pageInfo: data?.posts?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false, endCursor: "", startCursor: "" },
    category: data?.categories?.nodes?.[0] ?? null,
  };
}
