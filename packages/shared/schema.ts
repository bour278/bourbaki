import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // MDX content
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  publishDate: timestamp("publish_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata").$type<{
    readingTime?: number;
    tags?: string[];
  }>(),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Categories enum for consistent categorization
export const categories = [
  "Math",
  "TCS", 
  "Finance",
  "Puzzles",
  "General"
] as const;

export type Category = typeof categories[number];
