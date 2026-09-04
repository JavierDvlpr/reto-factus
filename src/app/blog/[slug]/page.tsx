"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { blogService } from "@/modules/blog/application/BlogService";
import { BlogPost } from "@/modules/blog/domain/BlogPost";
import RelatedProductsWidget from "@/modules/blog/ui/RelatedProductsWidget";
import BlogCard from "@/modules/blog/ui/BlogCard";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await blogService.getPostBySlug(resolvedParams.slug);
      if (!data) {
        notFound();
        return;
      }
      setPost(data);

      const related = await blogService.getRelatedPosts(
        data.slug,
        data.category,
        3
      );
      setRelatedPosts(related);
      setLoading(false);
    };

    load();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Breadcrumbs & Navigation Header */}
      <div className="border-b border-gray-100 bg-[#F9F9F9] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <nav className="flex items-center gap-1.5 overflow-hidden">
            <Link href="/" className="hover:text-black transition-colors shrink-0">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <Link href="/blog" className="hover:text-black transition-colors shrink-0">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-black font-semibold truncate">
              {post.category}
            </span>
          </nav>

          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 font-bold text-black hover:underline shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a artículos
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
            {post.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTimeMinutes} min de lectura</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author Bar & Social Share */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-extrabold text-black">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              title="Copiar enlace"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "¡Copiado!" : "Compartir"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative aspect-[16/9] w-full rounded-[32px] overflow-hidden shadow-xl bg-gray-100 border border-gray-200">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {post.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight font-sans pt-4">
                {section.title}
              </h2>
            )}

            <p className="text-base sm:text-lg text-gray-800 leading-relaxed whitespace-pre-line font-serif">
              {section.content}
            </p>

            {section.image && (
              <div className="my-6 space-y-2">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={section.image}
                    alt={section.caption || "Imagen de sección"}
                    fill
                    className="object-cover"
                  />
                </div>
                {section.caption && (
                  <p className="text-center text-xs text-gray-400 italic">
                    {section.caption}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}

        {/* Related Products Widget */}
        {post.relatedProductIds && post.relatedProductIds.length > 0 && (
          <RelatedProductsWidget productIds={post.relatedProductIds} />
        )}

        {/* Tags */}
        <div className="pt-8 border-t border-gray-200">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Etiquetas del artículo
          </h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F9F9F9] border border-gray-200 flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escrito por</p>
            <h4 className="text-base font-extrabold text-black">{post.author.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {post.author.role} en TechStore CO. Especialista en pruebas de laboratorio de componentes, análisis de benchmarks y optimización de productividad tecnológica.
            </p>
          </div>
        </div>
      </main>

      {/* Recommended Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-gray-200 mt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
              Artículos recomendados
            </h3>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-bold text-black hover:underline flex items-center gap-1"
            >
              Ver todo el blog
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <BlogCard key={rPost.id} post={rPost} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
