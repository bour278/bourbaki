import matter from "gray-matter"; // Handles frontmatter
import { remark } from "remark"; // Core markdown processor
import strip from "strip-markdown"; // Converts markdown to plain text
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

// Math plugins
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export interface ProcessedMdx {
  frontmatter: { [key: string]: any };
  html: string;
  readingTime: number;
  excerpt: string;
}

/**
 * Processes a raw MDX file string into HTML with KaTeX rendered math.
 */
export async function processMdx(fileContent: string): Promise<ProcessedMdx> {
  // 1. Parse frontmatter and content using gray-matter
  const { data: frontmatter, content } = matter(fileContent);

  // 2. Convert markdown to plain text for excerpt and reading time
  const plainText = await remark()
    .use(strip)
    .process(content)
    .then(file => String(file));
    
  // 3. Calculate reading time from the plain text
  const wordCount = plainText.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // 4. Generate a clean excerpt
  const excerpt = plainText.length > 200 
    ? plainText.substring(0, 200).replace(/\s+\w*$/, '...') 
    : plainText;

  // 5. Convert markdown to HTML with KaTeX math rendering
  const html = await remark()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content)
    .then(file => String(file));

  return {
    frontmatter,
    html,
    readingTime,
    excerpt,
  };
}

export class MDXProcessor {
  
  /**
   * Process MDX content and return HTML with LaTeX support
   */
  static async processContent(content: string): Promise<ProcessedMdx> {
    return processMdx(content);
  }

  /**
   * Extract excerpt from content
   */
  static extractExcerpt(content: string, maxLength: number = 300): string {
    // Remove markdown formatting and LaTeX for excerpt
    const plainText = content
      .replace(/#+\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic  
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\$\$[\s\S]*?\$\$/g, '[mathematical formula]') // Replace block math
      .replace(/\$([^$]+)\$/g, '[mathematical expression]') // Replace inline math
      .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    return plainText.substring(0, maxLength).replace(/\s+\w*$/, '') + '...';
  }
}
