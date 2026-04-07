import Parser from 'rss-parser';
import { Article, RSSSource } from './types.js';
import { parseRSSDate } from './utils/date.js';

const parser = new Parser({
  timeout: 10000, // 10秒超时
  headers: {
    'User-Agent': 'AI-News-Aggregator/1.0'
  }
});

/**
 * 截取描述文本
 */
function truncateDescription(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 解析文章内容
 */
function parseArticle(item: any, source: RSSSource): Article {
  // Hacker News 的RSS格式特殊处理
  let description = '';

  if (source.isHN) {
    // HN: contentSnippet 包含文章描述
    description = item.contentSnippet || '';
  } else {
    // 其他RSS源: 使用 description 或 contentSnippet
    description = item.description || item.contentSnippet || '';
  }

  // 清理HTML标签
  description = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  return {
    title: item.title || '无标题',
    link: item.link || '',
    pubDate: item.pubDate ? parseRSSDate(item.pubDate) : new Date(),
    source: source.name,
    description: truncateDescription(description)
  };
}

/**
 * 抓取单个RSS源
 */
async function fetchRSS(source: RSSSource): Promise<Article[]> {
  try {
    console.log(`📡 正在抓取: ${source.name}`);

    const feed = await parser.parseURL(source.url);

    if (!feed.items || feed.items.length === 0) {
      console.log(`⚠️  ${source.name} - 未获取到文章`);
      return [];
    }

    const articles = feed.items.map(item => parseArticle(item, source));

    console.log(`✅ ${source.name} - 获取 ${articles.length} 篇文章`);

    return articles;
  } catch (error) {
    console.error(`❌ ${source.name} - 抓取失败:`, error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * 抓取所有RSS源（并发）
 */
export async function fetchAllRSS(sources: RSSSource[]): Promise<Article[]> {
  console.log(`开始并发抓取 ${sources.length} 个RSS源...\n`);

  const promises = sources.map(source => fetchRSS(source));

  const results = await Promise.allSettled(promises);

  const articles: Article[] = [];
  let successCount = 0;
  let failCount = 0;

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
      successCount++;
    } else {
      failCount++;
      console.error(`\n❌ ${sources[index].name} 彻底失败`);
    }
  });

  console.log(`\n📊 抓取完成: ${successCount} 个源成功, ${failCount} 个源失败`);
  console.log(`📰 总计获取 ${articles.length} 篇文章\n`);

  return articles;
}
