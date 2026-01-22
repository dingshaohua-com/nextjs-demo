"use client";

import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useGetUsers } from "@/lib/api-client";
import {getAvatarColor, getGenderStyle, Loading} from './_helper'

export default function Virtual() {
  const [pagination, setPagination] = useState({page: 1, pageSize: 25});
  const { data, isLoading } = useGetUsers({ _page: pagination.page, _per_page: pagination.pageSize });

  // 列表的可滚动元素 (scroll element)
  const parentRef = useRef(null);

  // 虚拟化器 (virtualizer)
  const rowVirtualizer = useVirtualizer({
    count: pagination.pageSize, // 需要虚拟化的总项目数，不分也则是totol，后端要是分页则对应的是pageSize
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // 每个元素高度
  });

  // 加载状态
  if (isLoading) return <Loading/>
  return (
    <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-125 h-125 overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-blue-500 to-indigo-600">
          <h2 className="text-xl font-semibold text-white">用户列表</h2>
          <p className="text-blue-100 text-sm mt-1">共 {data?.items || 0} 位用户</p>
        </div>

        {/* 虚拟滚动列表 */}
        <div className="flex-1 overflow-auto" ref={parentRef}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const item = data?.data?.[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="px-4 py-2"
                >
                  <div className="h-full bg-slate-50 hover:bg-slate-100 rounded-xl px-4 flex items-center gap-4 transition-colors cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-sm">
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
                          {item?.gender === "male" || item?.gender === "男" ? "男" : "女"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{item?.email || "无邮箱"}</p>
                    </div>

                    {/* ID标识 */}
                    <div className="text-xs text-slate-400 shrink-0">#{item?.id}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
