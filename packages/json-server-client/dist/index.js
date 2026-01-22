// src/query-builder.ts
var QueryBuilder = class {
  constructor() {
    this.params = {};
  }
  /**
   * 设置字段条件 (精确匹配或操作符匹配)
   * @example
   * query.where('name', 'John')        // 精确匹配
   * query.where('age_gte', 18)         // 操作符匹配
   */
  where(key, value) {
    this.params[key] = value;
    return this;
  }
  /**
   * 设置分页 (使用 _page + _limit)
   */
  paginate(page, limit) {
    this.params._page = page;
    this.params._limit = limit;
    return this;
  }
  /**
   * 设置分页 (使用 _page + _per_page，json-server v1)
   */
  paginateV1(page, perPage) {
    this.params._page = page;
    this.params._per_page = perPage;
    return this;
  }
  /**
   * 设置切片范围 (_start + _end)
   */
  slice(start, end) {
    this.params._start = start;
    this.params._end = end;
    return this;
  }
  /**
   * 设置排序
   * @param field 排序字段，支持逗号分隔多字段
   * @param order 排序方向
   */
  sort(field, order = "asc") {
    this.params._sort = field;
    this.params._order = order;
    return this;
  }
  /**
   * 嵌入子资源 (一对多关系)
   * @example query.embed('posts') // 嵌入用户的 posts
   */
  embed(resource) {
    this.params._embed = resource;
    return this;
  }
  /**
   * 展开父资源 (多对一关系)
   * @example query.expand('user') // 展开 post 的 user
   */
  expand(resource) {
    this.params._expand = resource;
    return this;
  }
  /**
   * 全文搜索
   */
  search(keyword) {
    this.params.q = keyword;
    return this;
  }
  /**
   * 构建查询参数对象
   */
  build() {
    return { ...this.params };
  }
  /**
   * 构建为 URLSearchParams
   */
  toURLSearchParams() {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(this.params)) {
      if (value !== void 0 && value !== null) {
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
  toQueryString() {
    return this.toURLSearchParams().toString();
  }
};
function createQuery() {
  return new QueryBuilder();
}

// src/response.ts
function isPaginatedResponse(response) {
  if (!response || typeof response !== "object") return false;
  const res = response;
  return Array.isArray(res.data) && typeof res.first === "number" && typeof res.last === "number" && typeof res.pages === "number" && typeof res.items === "number";
}
function isArrayResponse(response) {
  return Array.isArray(response);
}
function parseResponse(response) {
  if (isPaginatedResponse(response)) {
    return { data: response.data, total: response.items };
  }
  if (Array.isArray(response)) {
    return { data: response, total: response.length };
  }
  throw new Error("Invalid json-server response format");
}
function getPaginationInfo(response) {
  return {
    currentPage: response.prev !== null ? response.prev + 1 : 1,
    totalPages: response.pages,
    totalItems: response.items,
    hasNext: response.next !== null,
    hasPrev: response.prev !== null
  };
}
export {
  QueryBuilder,
  createQuery,
  getPaginationInfo,
  isArrayResponse,
  isPaginatedResponse,
  parseResponse
};
