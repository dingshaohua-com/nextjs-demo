# json-server-client

Type-safe query and response utilities for json-server.

## 安装

```bash
pnpm add json-server-client
```

## 特性

- **类型安全**：完整的 TypeScript 类型推导
- **HTTP 无关**：不绑定任何 HTTP 客户端
- **零依赖**：最小化运行时代码

## json-server 响应格式

新版 json-server 的响应格式：

```typescript
// 不分页 - 直接返回数组
GET /users
// => User[]

// 分页 - 返回分页对象
GET /users?_page=1
// => { first, prev, next, last, pages, items, data: User[] }
```

## 使用示例

### 1. 类型安全的查询参数

```typescript
import type { JsonServerQuery } from 'json-server-client';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

async function getUsers(params: JsonServerQuery<User>) {
  const url = `/users?${new URLSearchParams(params as any)}`;
  return fetch(url).then(res => res.json());
}

// 调用时有完整类型提示
getUsers({
  name_like: 'john',   // 模糊匹配
  age_gte: 18,         // 大于等于
  _page: 1,
  _sort: 'createdAt',
  _order: 'desc',
});
```

### 2. 使用查询构建器

```typescript
import { createQuery } from 'json-server-client';

const query = createQuery<User>()
  .where('name_like', 'john')
  .where('age_gte', 18)
  .paginate(1, 10)
  .sort('createdAt', 'desc')
  .build();

// 或直接转为查询字符串
const qs = createQuery<User>()
  .where('name', 'John')
  .paginate(1, 10)
  .toQueryString();
// => "name=John&_page=1&_limit=10"
```

### 3. 解析响应

```typescript
import { parseResponse, isPaginatedResponse, getPaginationInfo } from 'json-server-client';

// 统一转换为 { data, total } 格式
const res = await fetch('/users?_page=1');
const json = await res.json();
const { data, total } = parseResponse<User>(json);

// 或保留完整分页信息
if (isPaginatedResponse<User>(json)) {
  const info = getPaginationInfo(json);
  // { currentPage: 1, totalPages: 3, totalItems: 52, hasNext: true, hasPrev: false }
}
```

## API

### 类型

| 类型 | 描述 |
|------|------|
| `JsonServerQuery<T>` | 完整查询参数类型 |
| `ListResponse<T>` | 统一列表响应 `{ data, total }` |
| `PaginatedResponse<T>` | 分页响应 `{ first, prev, next, last, pages, items, data }` |
| `CreateParams<T>` | 创建资源参数 (排除 id) |
| `UpdateParams<T>` | 更新资源参数 (排除 id，可选) |

### 支持的操作符

| 操作符 | 示例 | 描述 |
|--------|------|------|
| `_ne` | `name_ne: 'John'` | 不等于 |
| `_like` | `name_like: 'jo'` | 模糊匹配 |
| `_lt` | `age_lt: 30` | 小于 |
| `_lte` | `age_lte: 30` | 小于等于 |
| `_gt` | `age_gt: 18` | 大于 |
| `_gte` | `age_gte: 18` | 大于等于 |

### 函数

| 函数 | 描述 |
|------|------|
| `createQuery<T>()` | 创建查询构建器 |
| `parseResponse(response)` | 统一解析为 `{ data, total }` |
| `isPaginatedResponse(res)` | 判断是否为分页响应 |
| `getPaginationInfo(res)` | 提取分页信息 |

## License

MIT
