import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";

export default function Home() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Personal Math & CS Blog</h1>
      </div>
      
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: '2em', borderBottom: '1px solid #ccc', paddingBottom: '1em' }}>
          <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5em' }}>
            {formatDate(post.publishDate)}
          </div>
          {post.metadata?.tags && (
            <div style={{ fontSize: '11px', color: '#888', fontFamily: 'monospace' }}>
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
      ))}
    </div>
  );
}
