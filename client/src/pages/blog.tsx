import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Link } from "wouter";
import { useState, useMemo } from "react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const categories = useMemo(() => {
    const cats = posts.reduce((acc, post) => {
      if (post.category && !acc.includes(post.category)) {
        acc.push(post.category);
      }
      return acc;
    }, [] as string[]);
    return ['all', ...cats];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filter by tag first (highest priority)
      if (selectedTag && !post.metadata?.tags?.includes(selectedTag)) {
        return false;
      }
      
      // Filter by category if no tag selected
      if (!selectedTag && selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      
      return true;
    });
  }, [posts, selectedCategory, selectedTag]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setSelectedCategory('all');
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(null);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTag(null);
  };

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
      {/* Active filter indicator */}
      {(selectedTag || selectedCategory !== 'all') && (
        <div style={{ marginBottom: '1em', fontSize: '14px', color: '#666' }}>
          {selectedTag && `Showing posts tagged with "${selectedTag}"`}
          {selectedCategory !== 'all' && !selectedTag && `Showing ${selectedCategory} posts`}
          <button 
            onClick={clearFilters}
            style={{ 
              marginLeft: '1em', 
              padding: '2px 6px', 
              background: 'transparent', 
              border: '1px solid #ccc', 
              cursor: 'pointer',
              fontSize: '12px',
              color: '#666'
            }}
          >
            clear
          </button>
        </div>
      )}
      
      {/* Category filter buttons */}
      {categories.length > 2 && !selectedTag && (
        <div style={{ marginBottom: '2em', fontSize: '14px' }}>
          {categories.map((category) => (
            <button 
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                marginRight: '1em',
                padding: '4px 8px',
                background: selectedCategory === category ? '#f0f0f0' : 'transparent',
                border: '1px solid #ccc',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      
      {/* Posts list */}
      {filteredPosts.map((post) => (
        <div key={post.id} style={{ marginBottom: '2em', borderBottom: '1px solid #ccc', paddingBottom: '1em' }}>
          <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5em' }}>
            {formatDate(post.publishDate)}
            {post.category && (
              <span style={{ marginLeft: '1em', fontStyle: 'italic' }}>
                {post.category}
              </span>
            )}
          </div>
          {post.metadata?.tags && (
            <div style={{ fontSize: '11px', color: '#888', fontFamily: 'monospace' }}>
              {post.metadata.tags.map((tag: string) => (
                <span 
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  style={{ 
                    backgroundColor: selectedTag === tag ? '#e0e0e0' : '#f5f5f5', 
                    padding: '2px 4px', 
                    marginRight: '4px', 
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    color: '#888'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {post.subtitle && (
            <p style={{ fontSize: '14px', color: '#333', marginTop: '0.5em' }}>
              {post.subtitle}
            </p>
          )}
        </div>
      ))}
      
      {filteredPosts.length === 0 && (
        <p>No posts found.</p>
      )}
    </div>
  );
}