import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Article } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes an article object, ensuring publishedAt is a Date object
 */
export function normalizeArticle(article: Article): Article {
  return {
    ...article,
    publishedAt: article.publishedAt instanceof Date ? article.publishedAt : new Date(article.publishedAt)
  };
}

/**
 * Normalizes an array of articles, ensuring all publishedAt fields are Date objects
 */
export function normalizeArticles(articles: Article[]): Article[] {
  return articles.map(normalizeArticle);
}

/**
 * Randomizes articles by source, ensuring each source that has articles 
 * gets at least 2 articles represented in the final list (if available).
 * Remaining slots are filled randomly from all articles.
 */
export function randomizeArticlesBySource(articles: Article[]): Article[] {
  if (articles.length === 0) return articles;

  // Group articles by source
  const articlesBySource = articles.reduce((acc, article) => {
    if (!acc[article.source]) {
      acc[article.source] = [];
    }
    acc[article.source].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  const sources = Object.keys(articlesBySource);
  const result: Article[] = [];
  const usedArticleIds = new Set<string>();

  // Step 1: Ensure each source gets at least 2 articles (if they have that many)
  for (const source of sources) {
    const sourceArticles = articlesBySource[source];
    const shuffledSourceArticles = [...sourceArticles].sort(() => Math.random() - 0.5);
    
    // Take up to 2 articles from each source
    const articlesToAdd = shuffledSourceArticles.slice(0, Math.min(2, sourceArticles.length));
    
    for (const article of articlesToAdd) {
      result.push(article);
      usedArticleIds.add(article.id);
    }
  }

  // Step 2: Fill remaining slots with random articles from all sources
  const remainingArticles = articles.filter(article => !usedArticleIds.has(article.id));
  const shuffledRemaining = [...remainingArticles].sort(() => Math.random() - 0.5);
  
  result.push(...shuffledRemaining);

  // Step 3: Final shuffle to mix the guaranteed articles with the remaining ones
  return result.sort(() => Math.random() - 0.5);
}
