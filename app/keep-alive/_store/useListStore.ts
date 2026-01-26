import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ListState {
  query: string; // 搜索
  listData: any[]; // 列表数据
  scrollY: number; // 滚动位置
  setState: (fn: (state: ListState) => void) => void;
}

export const useListStore = create<ListState>()(
  immer((set) => ({
    query: "",
    listData: [],
    scrollY: 0,

    // 这里的 set 是 immer 提供的，它会自动处理传入的函数
    setState: (fn) => set(fn),
  })),
);
