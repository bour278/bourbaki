import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { RSSGenerator } from "./services/rss-generator";
import { MDXProcessor } from "./services/mdx-processor";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all posts
  app.get("/api/posts", async (req, res) => {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;
      
      let posts;
      if (search) {
        posts = await storage.searchPosts(search);
      } else if (category && category !== 'all') {
        posts = await storage.getPostsByCategory(category);
      } else {
        posts = await storage.getAllPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get single post by slug
  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getPost(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Process MDX content
      const processed = await MDXProcessor.processContent(post.content);
      
      res.json({
        ...post,
        html: processed.html,
        readingTime: processed.readingTime,
        excerpt: processed.excerpt
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // RSS Feed
  app.get("/feed.xml", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      const baseUrl = req.get('host') ? `${req.protocol}://${req.get('host')}` : 'http://localhost:5000';
      const rssXml = RSSGenerator.generateFeed(posts, baseUrl);
      
      res.set('Content-Type', 'application/rss+xml');
      res.send(rssXml);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate RSS feed" });
    }
  });

  // Get categories with post counts
  app.get("/api/categories", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      const categoryCount = posts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json(categoryCount);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
