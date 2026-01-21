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
          <div className="font-bold text-2xl">这是一些nextjs的一些Demo页面</div>
          <div className="content mt-4 flex flex-col gap-1">
            <Link href="/virtual" className="text-blue-600 hover:underline">
              Virtual 示例页面
            </Link>
             <Link href="/swr" className="text-blue-600 hover:underline">
              Swr 示例页面
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
