import { Article, Statistics } from './types.js';
import { formatDate } from './utils/date.js';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

/**
 * 生成Markdown内容
 */
export function generateMarkdown(
  articles: Article[],
  stats: Statistics
): string {
  const now = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');

  let markdown = `# 🤖 AI新闻聚合日报 (${now})\n\n`;

  // 统计信息
  markdown += `## 📊 统计信息\n\n`;
  markdown += `- 📰 **共收录**: ${stats.totalArticles} 篇文章\n`;
  markdown += `- 🌐 **来自**: ${stats.totalSources} 个来源\n\n`;

  if (stats.sources.length > 0) {
    markdown += `### 📈 来源分布\n\n`;
    stats.sources.forEach(source => {
      markdown += `- **${source.name}**: ${source.count} 篇\n`;
    });
    markdown += `\n`;
  }

  markdown += `---\n\n`;

  // 文章列表
  markdown += `## 📋 文章列表\n\n`;

  if (articles.length === 0) {
    markdown += `> ⚠️ 最近24小时内没有找到相关文章\n\n`;
  } else {
    articles.forEach((article, index) => {
      const time = formatDate(article.pubDate);

      markdown += `### ${index + 1}. ${article.title}\n\n`;
      markdown += `📰 **来源**: ${article.source}  |  🕐 **时间**: ${time}\n`;

      if (article.description) {
        markdown += `\n💬 **摘要**: ${article.description}\n`;
      }

      markdown += `\n🔗 [阅读全文](${article.link})\n\n`;
      markdown += `---\n\n`;
    });
  }

  markdown += `---\n\n`;
  markdown += `*🤖 本日报由AI新闻聚合工具自动生成*  |  📅 *更新时间: ${now}*\n`;

  return markdown;
}

/**
 * 保存Markdown文件
 */
export async function saveMarkdown(
  content: string,
  outputDir: string,
  filename: string
): Promise<string> {
  try {
    // 确保输出目录存在
    await mkdir(outputDir, { recursive: true });

    const filePath = join(outputDir, filename);
    await writeFile(filePath, content, 'utf-8');

    return filePath;
  } catch (error) {
    throw new Error(`保存文件失败: ${error instanceof Error ? error.message : error}`);
  }
}
