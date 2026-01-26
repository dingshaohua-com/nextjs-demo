"use client";

import { useState } from "react";
import Link from "next/link";

const users = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

export default function KeepAlive() {
  const [keyword, setKeyword] = useState("");
  const filtered = users.filter(
    (u) => u.name.includes(keyword) || u.email.includes(keyword)
  );

  return (
    <div className="h-screen bg-slate-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-125 h-125 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-blue-500 to-indigo-600">
          <h2 className="text-xl font-semibold text-white">用户列表</h2>
          <p className="text-blue-100 text-sm mt-1">共 {filtered.length} 位用户</p>
        </div>
        <div className="px-4 py-3 border-b border-slate-100">
          <input
            type="text"
            placeholder="搜索姓名或邮箱..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1 overflow-auto p-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="mb-2 h-16 bg-slate-50 hover:bg-slate-100 rounded-xl px-4 flex items-center gap-4 transition-colors cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shrink-0">
                {item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-slate-800">{item.name}</span>
                <p className="text-sm text-slate-500">{item.email}</p>
              </div>
              <Link
                href={`/keep-alive/dtl/${item.id}`}
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline shrink-0"
              >
                查看详情
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
