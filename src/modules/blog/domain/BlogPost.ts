/**
 * Blog Domain Entity and Types
 */

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogSection {
  title?: string;
  content: string; // Markdown or formatted text
  image?: string;
  caption?: string;
}

export interface BlogPostProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  author: BlogAuthor;
  tags: string[];
  sections: BlogSection[];
  relatedProductIds?: string[];
  featured?: boolean;
}

export type BlogCategory =
  | "Todos"
  | "Hardware & Gaming"
  | "Guías de Compra"
  | "Productividad & Setup"
  | "Noticias Tech"
  | "Facturación & Negocios";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Todos",
  "Hardware & Gaming",
  "Guías de Compra",
  "Productividad & Setup",
  "Noticias Tech",
  "Facturación & Negocios",
];

export class BlogPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: BlogCategory;
  readonly coverImage: string;
  readonly publishedAt: string;
  readonly readTimeMinutes: number;
  readonly author: BlogAuthor;
  readonly tags: string[];
  readonly sections: BlogSection[];
  readonly relatedProductIds: string[];
  readonly featured: boolean;

  constructor(props: BlogPostProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.title = props.title;
    this.excerpt = props.excerpt;
    this.category = props.category;
    this.coverImage = props.coverImage;
    this.publishedAt = props.publishedAt;
    this.readTimeMinutes = props.readTimeMinutes;
    this.author = props.author;
    this.tags = props.tags;
    this.sections = props.sections;
    this.relatedProductIds = props.relatedProductIds ?? [];
    this.featured = Boolean(props.featured);
  }

  get formattedDate(): string {
    const date = new Date(this.publishedAt);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
