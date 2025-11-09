import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Post } from "@shared/schema";

interface PostWithProcessedContent extends Post {
  html: string;
  readingTime: number;
  excerpt: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery<PostWithProcessedContent>({
    queryKey: ['/api/posts', slug],
    enabled: !!slug,
  });

  const { data: allPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-8"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans mb-4">Post Not Found</h1>
          <p className="text-secondary mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/blog" className="text-blog-accent hover:underline font-sans">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{post.title}</h1>
      
      <div className="post-meta">
        {formatDate(post.publishDate)}
        {post.metadata?.tags && (
          <div style={{ fontSize: '11px', color: '#888', fontFamily: 'monospace', marginTop: '0.5em' }}>
            {post.metadata.tags.map((tag: string) => (
              <Link 
                key={tag} 
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                style={{ textDecoration: 'none' }}
              >
                <span style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '2px 4px', 
                  marginRight: '4px', 
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  color: '#888'
                }}>
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
