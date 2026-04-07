export interface Article {
  title: string;
  link: string;
  pubDate: Date;
  source: string;
  description?: string;
}

export interface RSSSource {
  name: string;
  url: string;
  isHN?: boolean;
}

export interface Statistics {
  totalArticles: number;
  totalSources: number;
  sources: {
    name: string;
    count: number;
  }[];
}
