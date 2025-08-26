export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: Date;
  isRead: boolean;
}

export interface RSSSource {
  name: string;
  url: string;
  rssUrl: string;
}

export const RSS_SOURCES: RSSSource[] = [
  {
    name: "The New Yorker",
    url: "https://www.newyorker.com/",
    rssUrl: "https://www.newyorker.com/feed/rss"
  },
  {
    name: "Stratechery",
    url: "https://stratechery.com/",
    rssUrl: "https://stratechery.com/feed/"
  },
  {
    name: "Sherwood News",
    url: "https://sherwood.news/",
    rssUrl: "https://sherwood.news/rss/"
  },
  {
    name: "The New York Times",
    url: "https://www.nytimes.com/",
    rssUrl: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/",
    rssUrl: "https://hnrss.org/frontpage"
  },
  {
    name: "Semafor",
    url: "https://www.semafor.com/",
    rssUrl: "https://www.semafor.com/rss"
  }
];