'use client'

import { useState } from "react";
import { useGetWeather } from "./_api";

const CITIES = ["北京", "上海", "深圳"] as const;

export default function Snapdom() {
  const [selectedCity, setSelectedCity] = useState<string>("北京");

  // selectedCity 变化后，useGetWeather 会自动重新执行：SWR 检测到 key 变化后，会自动发起新的请求获取新城市的数据
  const { data: weather } = useGetWeather({ city: selectedCity });

  if (!weather) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">暂无天气信息</div>
      </div>
    );
  }

  const { current, living } = weather;

  // 选择一些重要的生活指数展示
  const importantIndices = ["穿衣指数", "感冒指数", "运动指数", "紫外线强度指数"];
  const selectedLiving = living.filter((item: { name: string; }) =>
    importantIndices.includes(item.name)
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 城市切换按钮 */}
        <div className="flex justify-center gap-4 mb-6">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCity === city
                  ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* 主天气卡片 */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          {/* 顶部渐变背景区域 */}
          <div className="bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{current.city}</h1>
                <p className="text-blue-100 text-sm">{current.date}</p>
                <p className="text-blue-100 text-sm">{current.time}</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold">{current.temp}°C</div>
                <div className="text-xl mt-2">{current.weather}</div>
              </div>
            </div>

            {/* 天气详情 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-blue-100 text-xs mb-1">湿度</div>
                <div className="text-lg font-semibold">{current.humidity}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-blue-100 text-xs mb-1">风向风力</div>
                <div className="text-lg font-semibold">
                  {current.wind} {current.windSpeed}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-blue-100 text-xs mb-1">能见度</div>
                <div className="text-lg font-semibold">{current.visibility}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-blue-100 text-xs mb-1">空气质量</div>
                <div className="text-lg font-semibold">
                  {current.air} <span className="text-sm">AQI</span>
                </div>
              </div>
            </div>
          </div>

          {/* 生活指数 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">生活指数</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedLiving.map((item, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {item.index}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.tips}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 更多生活指数 */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">更多建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {living
              .filter((item: { name: string; }) => !importantIndices.includes(item.name))
              .slice(0, 9)
              .map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700 text-sm">
                      {item.name}
                    </h3>
                    <span className="text-indigo-600 font-semibold text-xs">
                      {item.index}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">{item.tips}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
