export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

export interface Author {
  node: {
    name: string;
    description?: string;
    avatar?: {
      url: string;
    };
  };
}

export interface Category {
  name: string;
  slug: string;
  id?: string;
  description?: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface SEO {
  title: string;
  metaDesc: string;
  opengraphImage?: {
    sourceUrl: string;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
  startCursor: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  modified?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: FeaturedImage;
  author?: Author;
  categories?: {
    nodes: Category[];
  };
  tags?: {
    nodes: Tag[];
  };
  seo?: SEO;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  uri?: string;
  date: string;
  modified?: string;
  content?: string;
  featuredImage?: FeaturedImage;
  seo?: SEO;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId?: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

export interface SiteSettings {
  title: string;
  description: string;
  url: string;
}

export interface PostsResult {
  posts: Post[];
  pageInfo: PageInfo;
}
