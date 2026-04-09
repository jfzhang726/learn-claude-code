import { RSSSource } from './types.js';

export const RSS_SOURCES: RSSSource[] = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/"
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"
  },
  {
    name: "Hacker News AI",
    url: "https://hnrss.org/newest?q=AI&count=30",
    isHN: true
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml"
  }
];

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const OUTPUT_DIR = join(__dirname, '..', 'output');
