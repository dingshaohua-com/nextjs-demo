import type { ListResponse, PaginatedResponse } from './types';

/**
 * 类型守卫：判断是否为分页响应
 * 使用 _page 参数时 json-server 返回此格式
 */
export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  if (!response || typeof response !== 'object') return false;
  const res = response as Record<string, unknown>;
  return (
    Array.isArray(res.data) &&
    typeof res.first === 'number' &&
    typeof res.last === 'number' &&
    typeof res.pages === 'number' &&
    typeof res.items === 'number'
  );
}

/**
 * 类型守卫：判断是否为数组响应
 * 不使用分页参数时 json-server 直接返回数组
 */
export function isArrayResponse<T>(response: unknown): response is T[] {
  return Array.isArray(response);
}

/**
 * 解析 json-server 响应，统一转换为 { data, total } 格式
 *
 * @example
 * // 不分页 - 直接返回数组
 * const res1 = await fetch('/users');
 * const json1 = await res1.json(); // User[]
 * const { data, total } = parseResponse<User>(json1);
 *
 * // 分页 - 返回分页对象
 * const res2 = await fetch('/users?_page=1');
 * const json2 = await res2.json(); // { first, prev, next, last, pages, items, data }
 * const { data, total } = parseResponse<User>(json2);
 */
export function parseResponse<T>(response: T[] | PaginatedResponse<T>): ListResponse<T> {
  // 分页格式: { first, prev, next, last, pages, items, data }
  if (isPaginatedResponse<T>(response)) {
    return { data: response.data, total: response.items };
  }
  // 数组格式: T[]
  if (Array.isArray(response)) {
    return { data: response, total: response.length };
  }
  throw new Error('Invalid json-server response format');
}

/**
 * 从分页响应提取分页信息
 */
export function getPaginationInfo<T>(response: PaginatedResponse<T>) {
  return {
    currentPage: response.prev !== null ? response.prev + 1 : 1,
    totalPages: response.pages,
    totalItems: response.items,
    hasNext: response.next !== null,
    hasPrev: response.prev !== null,
  };
}
