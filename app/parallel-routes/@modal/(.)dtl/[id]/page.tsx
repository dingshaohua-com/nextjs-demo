"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

export default function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-125 p-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
        >
          &larr; 返回列表
        </button>

        <div className="mt-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
            用
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">用户 {id}</h1>
            <p className="text-slate-500">user{id}@example.com</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">ID</span>
            <span>#{id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">姓名</span>
            <span>用户 {id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">邮箱</span>
            <span>user{id}@example.com</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">状态</span>
            <span className="text-green-600">正常</span>
          </div>
        </div>
      </div>
    </div>
  );
}
