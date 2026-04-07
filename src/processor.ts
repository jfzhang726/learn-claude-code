import { Article, Statistics } from './types.js';
import { isWithinHours } from './utils/date.js';

/**
 * 按时间倒序排序
 */
export function sortByTimeDesc(articles: Article[]): Article[] {
  return [...articles].sort((a, b) =>
    b.pubDate.getTime() - a.pubDate.getTime()
  );
}

/**
 * 过滤最近N小时的文章
 */
export function filterByTime(articles: Article[], hours: number = 24): Article[] {
  return articles.filter(article => isWithinHours(article.pubDate, hours));
}

/**
 * 计算统计数据
 */
export function calculateStatistics(articles: Article[]): Statistics {
  const sourceMap = new Map<string, number>();

  articles.forEach(article => {
    sourceMap.set(article.source, (sourceMap.get(article.source) || 0) + 1);
  });

  return {
    totalArticles: articles.length,
    totalSources: sourceMap.size,
    sources: Array.from(sourceMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count) // 按数量倒序
  };
}

/**
 * 处理文章数据: 过滤 + 排序
 */
export function processArticles(
  articles: Article[],
  hours: number = 24
): {
  filtered: Article[];
  statistics: Statistics;
} {
  console.log(`⏰ 过滤最近 ${hours} 小时的文章...`);

  const filtered = filterByTime(articles, hours);
  console.log(`📊 过滤后剩余 ${filtered.length} 篇`);

  console.log('🔄 按时间倒序排序...');
  const sorted = sortByTimeDesc(filtered);

  const statistics = calculateStatistics(sorted);

  console.log(`\n📈 统计信息:`);
  console.log(`   - 总文章数: ${statistics.totalArticles}`);
  console.log(`   - 来源数: ${statistics.totalSources}`);
  statistics.sources.forEach(source => {
    console.log(`     - ${source.name}: ${source.count} 篇`);
  });

  return { filtered: sorted, statistics };
}
