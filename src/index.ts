#!/usr/bin/env node

import { Command } from 'commander';
import { join } from 'path';
import dayjs from 'dayjs';
import { RSS_SOURCES, OUTPUT_DIR } from './config.js';
import { fetchAllRSS } from './fetcher.js';
import { processArticles } from './processor.js';
import { generateMarkdown, saveMarkdown } from './markdown.js';

const program = new Command();

program
  .name('ai-news-aggregator')
  .description('AI新闻聚合CLI工具')
  .version('1.0.0')
  .option('-h, --hours <number>', '抓取最近N小时的文章', '24')
  .option('-o, --output <dir>', '输出目录', OUTPUT_DIR)
  .option('--dry-run', '仅显示统计信息，不生成文件')
  .parse();

async function main() {
  const options = program.opts();
  const hours = parseInt(options.hours, 10);
  const outputDir = options.output;
  const isDryRun = options.dryRun || false;

  console.log('🤖 AI新闻聚合工具启动\n');
  console.log(`⏰ 时间范围: 最近 ${hours} 小时`);
  console.log(`📁 输出目录: ${outputDir}`);
  console.log(`🎯 模式: ${isDryRun ? ' dry-run (不保存文件)' : '正常模式'}\n`);

  try {
    // 1. 抓取所有RSS源
    const startTime = Date.now();
    const allArticles = await fetchAllRSS(RSS_SOURCES);
    const fetchTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`⏱️  抓取耗时: ${fetchTime} 秒\n`);

    if (allArticles.length === 0) {
      console.log('⚠️  未获取到任何文章，程序退出');
      process.exit(0);
    }

    // 2. 处理数据（过滤 + 排序 + 统计）
    const { filtered: processedArticles, statistics } = processArticles(allArticles, hours);

    if (processedArticles.length === 0) {
      console.log('⚠️  过滤后没有符合时间要求的文章');
      process.exit(0);
    }

    // 3. 生成Markdown
    console.log('\n📝 生成Markdown内容...');
    const markdown = generateMarkdown(processedArticles, statistics);
    console.log('✅ Markdown生成完成\n');

    // 4. 保存文件（dry-run模式跳过）
    if (!isDryRun) {
      const filename = `ai-news-${dayjs().format('YYYYMMDD-HHmmss')}.md`;
      const filePath = await saveMarkdown(markdown, outputDir, filename);

      console.log(`💾 文件已保存:`);
      console.log(`   📄 ${filename}`);
      console.log(`   📂 ${filePath}\n`);
    } else {
      console.log('🏃‍♂️ dry-run模式: 跳过文件保存\n');
    }

    // 5. 显示预览
    console.log('👀 内容预览:');
    console.log('─'.repeat(50));
    console.log(markdown.split('\n').slice(0, 20).join('\n'));
    console.log('─'.repeat(50));
    console.log(`... 共 ${markdown.split('\n').length} 行\n`);

    console.log('🎉 任务完成！');

  } catch (error) {
    console.error('\n❌ 错误:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// 运行程序
main().catch(error => {
  console.error('致命错误:', error);
  process.exit(1);
});
