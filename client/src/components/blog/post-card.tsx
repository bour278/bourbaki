import { Post } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${post.slug}`}>
        <div className="border-b border-gray-100 pb-8 hover:border-gray-200 transition-colors">
          <div className="flex flex-wrap items-center gap-2 text-sm text-secondary font-sans mb-3">
            <span>{formatDate(post.publishDate)}</span>
            <span>·</span>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
              {post.category}
            </span>
            {post.metadata?.readingTime && (
              <>
                <span>·</span>
                <span>{post.metadata.readingTime} min read</span>
              </>
            )}
          </div>
          
          <h2 className="text-2xl font-bold font-sans mb-4 group-hover:text-blog-accent transition-colors">
            {post.title}
          </h2>
          
          {post.subtitle && (
            <h3 className="text-lg text-secondary mb-4 leading-relaxed">
              {post.subtitle}
            </h3>
          )}
          
          <p className="text-secondary leading-relaxed mb-4 max-w-reading">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-sm text-blog-accent font-sans">
            Read more
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
}
