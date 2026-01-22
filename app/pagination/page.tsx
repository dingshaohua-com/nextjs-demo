"use client";

import { useRef } from "react";
import { getUsersByPagination } from "@/lib/api-client";
import { getAvatarColor, getGenderStyle, Loading } from "./_helper";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer"; // 到底触发器
import { Loader2 } from "lucide-react";

// 在组件外部创建 client（避免重复渲染时重新创建，推荐放到根，比如app.tsx或者main.tsx或者layout.tsx）
const queryClient = new QueryClient();

// --- 子组件：负责逻辑和渲染 ---
const DEFAULT_PAGE_SIZE = 8;
function Pagination() {
  // 1. 无限分页查询
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["pagination-demo-page"],
      initialPageParam: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
      queryFn: ({ pageParam }) =>
        getUsersByPagination({
          _page: pageParam.page,
          _per_page: pageParam.pageSize,
        }),
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        return {
          // 和initialPageParam保持一致
          page: lastPage.next,
          pageSize: DEFAULT_PAGE_SIZE,
        };
      },
    });

  // 2. 使用 ref 获取最新状态，避免 onChange 闭包问题
  const stateRef = useRef({ hasNextPage, isFetchingNextPage });
  stateRef.current = { hasNextPage, isFetchingNextPage };

  // 3. 使用 useInView 的 onChange 回调，只在进入视口时触发一次
  const { ref } = useInView({
    onChange: (inView) => {  // 比使用useEffect监听[inView, hasNextPage, isFetchingNextPage]靠谱
      // inView 指的是底部触发器ref是否进入视图
      const { hasNextPage, isFetchingNextPage } = stateRef.current;
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  // 4. 将嵌套的 pages 数据拍平，方便渲染
  const allUsers = data?.pages.flatMap((page) => page.data) ?? [];

  if (status === "pending") return <Loading />;
  return (
    <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-125 h-125 overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-blue-500 to-indigo-600">
          <h2 className="text-xl font-semibold text-white">用户列表</h2>
          <p className="text-blue-100 text-sm mt-1">
            共 {data?.pages[0].items || 0} 位用户
          </p>
        </div>

        {/* 虚拟滚动列表 */}
        <div className="flex-1 overflow-auto p-2">
          {allUsers.map((item) => (
            <div
              key={item.id}
              className="mb-2 h-20 bg-slate-50 hover:bg-slate-100 rounded-xl px-4 flex items-center gap-4 transition-colors cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-sm"
            >
              {/* 头像 */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shrink-0 ${getAvatarColor(item?.id || 0)}`}
              >
                {item?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* 用户信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800 truncate">
                    {item?.name || "未知用户"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${getGenderStyle(item?.gender || "")}`}
                  >
                    {item?.gender === "male" || item?.gender === "男"
                      ? "男"
                      : "女"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {item?.email || "无邮箱"}
                </p>
              </div>

              {/* ID标识 */}
              <div className="text-xs text-slate-400 shrink-0">#{item?.id}</div>
            </div>
          ))}

          {/* 5. 底部触发器：用于判断是否滚动到底部 */}
          <div ref={ref} className="py-8 flex justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4" />
                正在加载更多...
              </div>
            ) : hasNextPage ? (
              <p className="text-sm text-gray-400">继续向下滚动加载</p>
            ) : (
              <p className="text-sm text-gray-400">没有更多数据了</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 父组件：负责包裹环境 ---
export default function PaginationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Pagination />
    </QueryClientProvider>
  );
}
