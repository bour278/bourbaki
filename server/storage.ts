import { posts, type Post, type InsertPost } from "@shared/schema";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface IStorage {
  // Posts
  getPost(slug: string): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getPostsByCategory(category: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  searchPosts(query: string): Promise<Post[]>;
}

export class MemStorage implements IStorage {
  private posts: Map<string, Post>;
  private currentId: number;

  constructor() {
    this.posts = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    this.loadPostsFromFiles();
  }

  private loadPostsFromFiles() {
    const postsDir = path.join(process.cwd(), "content", "posts");
    
    if (!fs.existsSync(postsDir)) {
      console.warn("Posts directory does not exist:", postsDir);
      return;
    }

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      try {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        
        const id = this.currentId++;
        const post: Post = {
          id,
          title: frontmatter.title || "",
          subtitle: frontmatter.subtitle || "",
          slug: frontmatter.slug || path.basename(file, '.md'),
          content: content,
          excerpt: frontmatter.excerpt || "",
          category: frontmatter.category || "General",
          publishDate: frontmatter.publishDate ? new Date(frontmatter.publishDate) : new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            readingTime: frontmatter.readingTime || 0,
            tags: frontmatter.tags || []
          }
        };
        
        this.posts.set(post.slug, post);
      } catch (error) {
        console.error(`Error loading post from ${file}:`, error);
      }
    });
  }

  async getPost(slug: string): Promise<Post | undefined> {
    return this.posts.get(slug);
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
    );
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = {
      ...insertPost,
      id,
      subtitle: insertPost.subtitle || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: insertPost.metadata ? {
        readingTime: insertPost.metadata.readingTime as number,
        tags: insertPost.metadata.tags as string[]
      } : null
    };
    this.posts.set(post.slug, post);
    return post;
  }

  async searchPosts(query: string): Promise<Post[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.subtitle?.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }
}

export const storage = new MemStorage();
