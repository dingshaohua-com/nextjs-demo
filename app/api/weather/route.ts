// app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. 把浏览器传来的 query 原样拼到上游
  const upstreamUrl = new URL('http://shanhe.kim/api/za/tianqi.php');
  upstreamUrl.search = request.nextUrl.search; // ?city=xxx 自动带过去

  // 2. 发起真实请求
  const res = await fetch(upstreamUrl, {
    method: 'GET',
    headers: {
      // 可选：把用户浏览器 UA 带过去，防止目标站做 UA 校验
      'User-Agent': request.headers.get('user-agent') ?? '',
    },
  });

  // 3. 把状态码、响应体、Content-Type 原样返回
  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  });
}