import { BlogPost, BlogCategory, BLOG_CATEGORIES } from "../domain/BlogPost";
import { ALL_BLOG_POSTS } from "../infrastructure/blogData";

export class BlogService {
  private readonly posts: BlogPost[] = ALL_BLOG_POSTS;

  async getAllPosts(filters?: {
    category?: string;
    query?: string;
  }): Promise<BlogPost[]> {
    let result = [...this.posts];

    if (filters?.category && filters.category !== "Todos") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters?.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    // Sort by publication date descending
    return result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getFeaturedPost(): Promise<BlogPost> {
    const featured = this.posts.find((p) => p.featured);
    return featured || this.posts[0];
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = this.posts.find((p) => p.slug === slug);
    return post || null;
  }

  async getRelatedPosts(
    currentSlug: string,
    category: string,
    limit: number = 3
  ): Promise<BlogPost[]> {
    const sameCategory = this.posts.filter(
      (p) => p.slug !== currentSlug && p.category === category
    );
    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }
    const others = this.posts.filter(
      (p) => p.slug !== currentSlug && p.category !== category
    );
    return [...sameCategory, ...others].slice(0, limit);
  }

  getCategories(): BlogCategory[] {
    return BLOG_CATEGORIES;
  }
}

export const blogService = new BlogService();
