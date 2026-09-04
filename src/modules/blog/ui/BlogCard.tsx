"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "../domain/BlogPost";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
      <article className="flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3.5 left-3.5">
            <span className="bg-white/90 backdrop-blur-md text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-2.5">
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {post.formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {post.readTimeMinutes} min
              </span>
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-lg sm:text-xl text-black leading-snug group-hover:underline line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* Author & Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold text-gray-800 truncate max-w-[120px]">
                {post.author.name}
              </span>
            </div>

            <span className="text-xs font-bold text-black flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Leer más
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
