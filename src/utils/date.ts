import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// 配置dayjs插件
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 检查文章是否在指定时间范围内
 */
export function isWithinHours(date: Date, hours: number = 24): boolean {
  const now = dayjs();
  const articleTime = dayjs(date);
  const cutoffTime = now.subtract(hours, 'hour');

  return articleTime.isAfter(cutoffTime);
}

/**
 * 格式化日期时间
 */
export function formatDate(date: Date, format: string = 'MM-DD HH:mm'): string {
  return dayjs(date).format(format);
}

/**
 * 解析RSS时间字符串
 */
export function parseRSSDate(dateStr: string): Date {
  return dayjs(dateStr).toDate();
}
