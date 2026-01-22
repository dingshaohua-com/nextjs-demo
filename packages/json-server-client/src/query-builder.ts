import type { JsonServerQuery, Order, Operator } from './types';

type QueryKey<T> = keyof T | `${Extract<keyof T, string>}_${Operator}`;

/**
 * 类型安全的 json-server 查询构建器
 */
export class QueryBuilder<T> {
  private params: JsonServerQuery<T> = {};

  /**
   * 设置字段条件 (精确匹配或操作符匹配)
   * @example
   * query.where('name', 'John')        // 精确匹配
   * query.where('age_gte', 18)         // 操作符匹配
   */
  where<K extends QueryKey<T>>(
    key: K,
    value: K extends keyof T ? T[K] : unknown
  ): this {
    (this.params as Record<string, unknown>)[key as string] = value;
    return this;
  }

  /**
   * 设置分页 (使用 _page + _limit)
   */
  paginate(page: number, limit: number): this {
    this.params._page = page;
    this.params._limit = limit;
    return this;
  }

  /**
   * 设置分页 (使用 _page + _per_page，json-server v1)
   */
  paginateV1(page: number, perPage: number): this {
    this.params._page = page;
    this.params._per_page = perPage;
    return this;
  }

  /**
   * 设置切片范围 (_start + _end)
   */
  slice(start: number, end: number): this {
    this.params._start = start;
    this.params._end = end;
    return this;
  }

  /**
   * 设置排序
   * @param field 排序字段，支持逗号分隔多字段
   * @param order 排序方向
   */
  sort(field: string, order: Order = 'asc'): this {
    this.params._sort = field;
    this.params._order = order;
    return this;
  }

  /**
   * 嵌入子资源 (一对多关系)
   * @example query.embed('posts') // 嵌入用户的 posts
   */
  embed(resource: string | string[]): this {
    this.params._embed = resource;
    return this;
  }

  /**
   * 展开父资源 (多对一关系)
   * @example query.expand('user') // 展开 post 的 user
   */
  expand(resource: string | string[]): this {
    this.params._expand = resource;
    return this;
  }

  /**
   * 全文搜索
   */
  search(keyword: string): this {
    this.params.q = keyword;
    return this;
  }

  /**
   * 构建查询参数对象
   */
  build(): JsonServerQuery<T> {
    return { ...this.params };
  }

  /**
   * 构建为 URLSearchParams
   */
  toURLSearchParams(): URLSearchParams {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(this.params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    }
    return searchParams;
  }

  /**
   * 构建为查询字符串
   */
  toQueryString(): string {
    return this.toURLSearchParams().toString();
  }
}

/**
 * 创建查询构建器实例
 * @example
 * const query = createQuery<User>()
 *   .where('name_like', 'john')
 *   .where('age_gte', 18)
 *   .paginate(1, 10)
 *   .sort('createdAt', 'desc')
 *   .build();
 */
export function createQuery<T>(): QueryBuilder<T> {
  return new QueryBuilder<T>();
}
