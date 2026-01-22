/** 排序方向 */
type Order = 'asc' | 'desc';
/** json-server 支持的操作符 */
type Operator = 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'like';
/** 分页参数 */
interface PaginationParams {
    /** 页码 (从 1 开始) */
    _page?: number;
    /** 每页数量 (json-server v1) */
    _per_page?: number;
    /** 每页数量 (json-server v0) */
    _limit?: number;
    /** 起始索引 (slice 模式) */
    _start?: number;
    /** 结束索引 (slice 模式) */
    _end?: number;
}
/** 排序参数 */
interface SortParams {
    /** 排序字段，支持逗号分隔多字段 */
    _sort?: string;
    /** 排序方向 */
    _order?: Order;
}
/** 关系参数 */
interface RelationParams {
    /** 嵌入子资源 (一对多) */
    _embed?: string | string[];
    /** 展开父资源 (多对一) */
    _expand?: string | string[];
}
/** 全文搜索参数 */
interface SearchParams {
    /** 全文搜索关键词 */
    q?: string;
}
/** json-server 基础查询参数 */
type JsonServerBaseParams = PaginationParams & SortParams & RelationParams & SearchParams;
/**
 * 操作符字段生成
 * 为实体的每个字段生成带操作符后缀的可选属性
 * 例如: User { name: string } -> { name_ne?: string, name_like?: string, ... }
 */
type WithOperators<T> = {
    [K in keyof T as `${Extract<K, string>}_${Operator}`]?: T[K] extends (infer U)[] ? U : T[K];
};
/**
 * 完整的 json-server 查询类型
 * 组合: 基础参数 + 精确匹配 + 操作符匹配
 */
type JsonServerQuery<T> = JsonServerBaseParams & Partial<T> & WithOperators<T>;
/**
 * 统一列表响应格式 (由 parseResponse 转换后返回)
 * 注意：这不是 json-server 的原始响应格式
 * - json-server 不分页时直接返回 T[]
 * - json-server 分页时返回 PaginatedResponse<T>
 */
interface ListResponse<T> {
    data: T[];
    total: number;
}
/**
 * json-server 分页响应格式
 * 使用 _page 参数时的响应结构
 */
interface PaginatedResponse<T> {
    data: T[];
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
}
/** 创建资源时的参数类型 (排除 id) */
type CreateParams<T> = Omit<T, 'id'>;
/** 更新资源时的参数类型 (排除 id，所有字段可选) */
type UpdateParams<T> = Partial<Omit<T, 'id'>>;
/** 带 id 的基础实体接口 */
interface BaseEntity {
    id: number | string;
}

type QueryKey<T> = keyof T | `${Extract<keyof T, string>}_${Operator}`;
/**
 * 类型安全的 json-server 查询构建器
 */
declare class QueryBuilder<T> {
    private params;
    /**
     * 设置字段条件 (精确匹配或操作符匹配)
     * @example
     * query.where('name', 'John')        // 精确匹配
     * query.where('age_gte', 18)         // 操作符匹配
     */
    where<K extends QueryKey<T>>(key: K, value: K extends keyof T ? T[K] : unknown): this;
    /**
     * 设置分页 (使用 _page + _limit)
     */
    paginate(page: number, limit: number): this;
    /**
     * 设置分页 (使用 _page + _per_page，json-server v1)
     */
    paginateV1(page: number, perPage: number): this;
    /**
     * 设置切片范围 (_start + _end)
     */
    slice(start: number, end: number): this;
    /**
     * 设置排序
     * @param field 排序字段，支持逗号分隔多字段
     * @param order 排序方向
     */
    sort(field: string, order?: Order): this;
    /**
     * 嵌入子资源 (一对多关系)
     * @example query.embed('posts') // 嵌入用户的 posts
     */
    embed(resource: string | string[]): this;
    /**
     * 展开父资源 (多对一关系)
     * @example query.expand('user') // 展开 post 的 user
     */
    expand(resource: string | string[]): this;
    /**
     * 全文搜索
     */
    search(keyword: string): this;
    /**
     * 构建查询参数对象
     */
    build(): JsonServerQuery<T>;
    /**
     * 构建为 URLSearchParams
     */
    toURLSearchParams(): URLSearchParams;
    /**
     * 构建为查询字符串
     */
    toQueryString(): string;
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
declare function createQuery<T>(): QueryBuilder<T>;

/**
 * 类型守卫：判断是否为分页响应
 * 使用 _page 参数时 json-server 返回此格式
 */
declare function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T>;
/**
 * 类型守卫：判断是否为数组响应
 * 不使用分页参数时 json-server 直接返回数组
 */
declare function isArrayResponse<T>(response: unknown): response is T[];
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
declare function parseResponse<T>(response: T[] | PaginatedResponse<T>): ListResponse<T>;
/**
 * 从分页响应提取分页信息
 */
declare function getPaginationInfo<T>(response: PaginatedResponse<T>): {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export { type BaseEntity, type CreateParams, type JsonServerBaseParams, type JsonServerQuery, type ListResponse, type Operator, type Order, type PaginatedResponse, type PaginationParams, QueryBuilder, type RelationParams, type SearchParams, type SortParams, type UpdateParams, type WithOperators, createQuery, getPaginationInfo, isArrayResponse, isPaginatedResponse, parseResponse };
