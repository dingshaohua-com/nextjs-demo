// 获取头像背景色 (基于用户ID)
export const getAvatarColor = (id: number) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  return colors[id % colors.length];
};

// 获取性别标签样式
export const getGenderStyle = (gender: string) => {
  if (gender === "male" || gender === "男") {
    return "bg-blue-100 text-blue-700";
  }
  return "bg-pink-100 text-pink-700";
};

export const Loading = () => {
  return (
    <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100 flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-500">加载中...</span>
      </div>
    </div>
  );
};
