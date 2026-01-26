import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="mt-2">
          <div className="font-bold text-2xl">这是一些nextjs的一些Demo页面（<a className="text-pink-400" href="https://github.com/dingshaohua-com/nextjs-demo" target="_blank">点此访问源码</a>）</div>
          <div className="content mt-4 flex flex-col gap-1">
            <Link href="/virtual" className="text-blue-600 hover:underline">
              Virtual 示例页面：虚拟列表
            </Link>
            <Link href="/pagination" className="text-blue-600 hover:underline">
              Pagination 示例页面：上拉加载下拉刷新
            </Link>
            <Link href="/pagination-virtual" className="text-blue-600 hover:underline">
              Pagination+Virtual 示例页面：无限加载+虚拟列表
            </Link>
             <Link href="/swr" className="text-blue-600 hover:underline">
              Swr 示例页面: react优秀的请求库
            </Link>
            <Link href="/keep-alive" className="text-blue-600 hover:underline">
              页面缓存: 实现vue的keep-alive感觉
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
