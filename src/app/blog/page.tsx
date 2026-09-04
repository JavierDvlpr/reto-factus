"use client";

import { useState, useEffect, useMemo } from "react";
import { blogService } from "@/modules/blog/application/BlogService";
import { BlogPost, BLOG_CATEGORIES, BlogCategory } from "@/modules/blog/domain/BlogPost";
import BlogHeroCard from "@/modules/blog/ui/BlogHeroCard";
import BlogCard from "@/modules/blog/ui/BlogCard";
import { Search, Sparkles, Newspaper, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [all, featured] = await Promise.all([
        blogService.getAllPosts(),
        blogService.getFeaturedPost(),
      ]);
      setPosts(all);
      setFeaturedPost(featured);
      setLoading(false);
    };

    load();
  }, []);

  // Filtered posts based on category and search query
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategory !== "Todos") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Blog Hero Header */}
      <section className="bg-[#F2F0F1] py-12 sm:py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
            </Link>
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-bold text-gray-800">
              <BookOpen className="w-4 h-4 text-black" />
              <span>TechStore Blog & Guías</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black font-sans leading-[1.1]">
                Conocimiento, análisis y guías de tecnología
              </h1>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Descubre comparativas de hardware de alto rendimiento, optimización de setups, análisis a fondo y novedades del ecosistema tech en Colombia.
              </p>
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos o temas..."
                className="w-full bg-white border border-gray-300 rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Featured Hero Post (Only shown when not searching and on 'Todos') */}
        {featuredPost && selectedCategory === "Todos" && !searchQuery.trim() && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Artículo Destacado de la Semana</span>
            </div>
            <BlogHeroCard post={featuredPost} />
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-extrabold text-xl sm:text-2xl text-black font-sans">
              Explora por temática
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {filteredPosts.length} {filteredPosts.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-[#F9F9F9] rounded-[32px] border border-gray-200 p-8">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="font-bold text-lg text-black">
              No se encontraron artículos con estos criterios
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Intenta cambiar la categoría o prueba buscando términos más generales como "laptop", "setup" o "monitores".
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSearchQuery("");
              }}
              className="bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
