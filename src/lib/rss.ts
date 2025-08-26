import { Article, RSSSource, RSS_SOURCES } from './types';

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export async function fetchRSSFeed(source: RSSSource): Promise<Article[]> {
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(source.rssUrl)}`);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error('No content received');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const articles: Article[] = [];

    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || 'Untitled';
      const description = item.querySelector('description')?.textContent || 
                         item.querySelector('content\\:encoded')?.textContent || 
                         'No description available';
      const link = item.querySelector('link')?.textContent || 
                  item.querySelector('guid')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || 
                     item.querySelector('published')?.textContent ||
                     new Date().toISOString();

      // Clean up description - remove HTML tags and limit length
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .trim()
        .substring(0, 200) + (description.length > 200 ? '...' : '');

      articles.push({
        id: `${source.name}-${index}-${Date.now()}`,
        title: title.trim(),
        description: cleanDescription,
        link: link.trim(),
        source: source.name,
        publishedAt: new Date(pubDate),
        isRead: false
      });
    });

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed for ${source.name}:`, error);
    return [];
  }
}

export async function aggregateArticles(): Promise<Article[]> {
  const promises = RSS_SOURCES.map(source => fetchRSSFeed(source));
  const results = await Promise.allSettled(promises);
  
  const allArticles = results
    .filter((result): result is PromiseFulfilledResult<Article[]> => result.status === 'fulfilled')
    .flatMap(result => result.value);

  // Remove duplicates based on title similarity
  const uniqueArticles = allArticles.filter((article, index, arr) => {
    return arr.findIndex(a => 
      a.title.toLowerCase().trim() === article.title.toLowerCase().trim() ||
      (a.link && a.link === article.link)
    ) === index;
  });

  // Sort by published date (newest first) and limit to 50 articles
  return uniqueArticles
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 50);
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}