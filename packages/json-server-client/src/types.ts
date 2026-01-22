/** 排序方向 */
export type Order = 'asc' | 'desc';

/** json-server 支持的操作符 */
export type Operator = 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'like';

/** 分页参数 */
export interface PaginationParams {
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
export interface SortParams {
  /** 排序字段，支持逗号分隔多字段 */
  _sort?: string;
  /** 排序方向 */
  _order?: Order;
}

/** 关系参数 */
export interface RelationParams {
  /** 嵌入子资源 (一对多) */
  _embed?: string | string[];
  /** 展开父资源 (多对一) */
  _expand?: string | string[];
}

/** 全文搜索参数 */
export interface SearchParams {
  /** 全文搜索关键词 */
  q?: string;
}

/** json-server 基础查询参数 */
export type JsonServerBaseParams = PaginationParams & SortParams & RelationParams & SearchParams;

/**
 * 操作符字段生成
 * 为实体的每个字段生成带操作符后缀的可选属性
 * 例如: User { name: string } -> { name_ne?: string, name_like?: string, ... }
 */
export type WithOperators<T> = {
  [K in keyof T as `${Extract<K, string>}_${Operator}`]?: T[K] extends (infer U)[] ? U : T[K];
};

/**
 * 完整的 json-server 查询类型
 * 组合: 基础参数 + 精确匹配 + 操作符匹配
 */
export type JsonServerQuery<T> = JsonServerBaseParams & Partial<T> & WithOperators<T>;

/**
 * 统一列表响应格式 (由 parseResponse 转换后返回)
 * 注意：这不是 json-server 的原始响应格式
 * - json-server 不分页时直接返回 T[]
 * - json-server 分页时返回 PaginatedResponse<T>
 */
export interface ListResponse<T> {
  data: T[];
  total: number;
}

/**
 * json-server 分页响应格式
 * 使用 _page 参数时的响应结构
 */
export interface PaginatedResponse<T> {
  data: T[];
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
}

/** 创建资源时的参数类型 (排除 id) */
export type CreateParams<T> = Omit<T, 'id'>;

/** 更新资源时的参数类型 (排除 id，所有字段可选) */
export type UpdateParams<T> = Partial<Omit<T, 'id'>>;

/** 带 id 的基础实体接口 */
export interface BaseEntity {
  id: number | string;
}
