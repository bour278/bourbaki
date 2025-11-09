import { Post } from "@shared/schema";

export class RSSGenerator {
  static generateFeed(posts: Post[], baseUrl: string = "http://localhost:5000"): string {
    const now = new Date().toUTCString();
    const latestPost = posts[0];
    const lastBuildDate = latestPost ? latestPost.publishDate.toUTCString() : now;

    const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Personal Math &amp; CS Blog</title>
    <description>Notes and thoughts on mathematics, theoretical computer science, finance, and puzzles</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <language>en-US</language>
    <managingEditor>your@email.com (Your Name)</managingEditor>
    <webMaster>your@email.com (Your Name)</webMaster>`;

    const rssItems = posts.map(post => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = post.publishDate.toUTCString();
      
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <category><![CDATA[${post.category}]]></category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    }).join('\n');

    const rssFooter = `  </channel>
</rss>`;

    return [rssHeader, rssItems, rssFooter].join('\n');
  }
}
