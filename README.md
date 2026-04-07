# 🤖 AI 新闻聚合工具

一个基于 TypeScript 的 CLI 工具，自动抓取多个 AI 相关 RSS 源，生成 Markdown 格式的日报。

## 功能特性

- ✅ 支持多个 RSS 源并发抓取
- ✅ 自动过滤最近 N 小时的文章
- ✅ 按时间倒序排列
- ✅ 提取文章摘要（前100字）
- ✅ 生成统计信息（总文章数、来源分布）
- ✅ 输出美观的 Markdown 格式
- ✅ 支持 dry-run 模式预览
- ✅ 可配置时间范围和输出目录

## 支持的 RSS 源

- **TechCrunch AI**: https://techcrunch.com/category/artificial-intelligence/feed/
- **The Verge AI**: https://www.theverge.com/rss/ai-artificial-intelligence/index.xml
- **Hacker News AI**: https://hnrss.org/newest?q=AI&count=30

## 安装

```bash
# 克隆项目
git clone <repository>
cd ai-news-aggregator

# 安装依赖
npm install
```

## 使用

### 基本用法

```bash
# 抓取最近24小时的文章并生成日报
npm start

# 或者直接运行
npx tsx src/index.ts
```

### 命令行参数

```bash
# 指定抓取最近12小时的文章
npx tsx src/index.ts --hours 12

# 指定输出目录
npx tsx src/index.ts --output ./my-output

# dry-run模式（仅预览，不保存文件）
npx tsx src/index.ts --dry-run

# 组合使用
npx tsx src/index.ts --hours 12 --output ./reports --dry-run
```

### 参数说明

- `-h, --hours <number>`: 抓取最近N小时的文章（默认：24）
- `-o, --output <dir>`: 输出目录（默认：./output）
- `--dry-run`: 仅显示统计信息，不生成文件
- `--help`: 显示帮助信息
- `--version`: 显示版本信息

## 输出示例

生成的 Markdown 文件包含：

1. **统计信息**：总文章数、来源分布
2. **文章列表**：每篇文章包含
   - 标题
   - 来源和时间
   - 摘要（前100字）
   - 阅读链接

文件保存在 `output/` 目录，命名格式：`ai-news-YYYYMMDD-HHmmss.md`

## 添加新的 RSS 源

编辑 `src/config.ts` 文件：

```typescript
export const RSS_SOURCES: RSSSource[] = [
  // ...现有源
  {
    name: "新的RSS源名称",
    url: "https://example.com/rss.xml"
  }
];
```

## 开发

```bash
# 安装开发依赖
npm install

# 运行测试
npm run dev

# 构建项目
npm run build
```

## 定时任务

可以通过 cron 设置定时执行：

```bash
# 每天上午9点自动生成日报
0 9 * * * cd /path/to/ai-news-aggregator && npx tsx src/index.ts
```

## 技术栈

- TypeScript
- tsx (TypeScript 执行环境)
- rss-parser (RSS解析)
- dayjs (日期处理)
- commander (CLI框架)

## 许可证

MIT
