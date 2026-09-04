"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "../domain/BlogPost";
import { Clock, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogHeroCardProps {
  post: BlogPost;
}

export default function BlogHeroCard({ post }: BlogHeroCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative rounded-[32px] overflow-hidden bg-black text-white shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-black/20 hover:scale-[1.005]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          {/* Left / Info */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white text-black text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Destacado
                </span>
                <Badge variant="outline" className="text-white border-white/30 text-xs font-semibold">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTimeMinutes} min de lectura</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight group-hover:text-gray-200 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            {/* Author & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{post.author.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.author.role}</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-white text-black text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full group-hover:bg-gray-200 transition-all shadow">
                <span>Leer artículo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Right / Cover Image */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-gray-900">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/30 to-transparent" />
          </div>
        </div>
      </div>
    </Link>
  );
}
