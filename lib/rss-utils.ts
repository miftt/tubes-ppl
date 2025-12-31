import Parser from "rss-parser";
import { Item } from "rss-parser";

const parser = new Parser();

export interface ParseRSSOptions {
  url: string;
}

export async function parseRSS(options: ParseRSSOptions) {
  return await parser.parseURL(options.url);
}

export function replaceQueryParams(
  url: string | undefined,
  param: string,
  value: string
): string {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(param, value);
    return urlObj.toString();
  } catch {
    return url;
  }
}

export function search(
  data: Item[],
  searchQuery: string
): Array<{ item: Item; score: number }> {
  const query = searchQuery.toLowerCase();
  const results: Array<{ item: Item; score: number }> = [];

  data.forEach((item) => {
    const title = (item.title || "").toLowerCase();
    const content = (item.contentSnippet || item.content || "").toLowerCase();
    
    let score = 0;
    
    // Exact match in title gets highest score
    if (title.includes(query)) {
      score += 10;
      if (title.startsWith(query)) {
        score += 5;
      }
    }
    
    // Match in content gets lower score
    if (content.includes(query)) {
      score += 2;
    }
    
    if (score > 0) {
      results.push({ item, score });
    }
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

