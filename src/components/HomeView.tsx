import React from 'react';
import { Camera, QrCode, ChevronRight, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { FoodItem, LoggedMealItem, UserHealthProfile } from '../types';

interface HomeViewProps {
  userProfile: UserHealthProfile;
  loggedMeals: LoggedMealItem[];
  recentFoods: FoodItem[];
  onOpenPhotoRecognition: () => void;
  onOpenBarcodeScanner: () => void;
  onSelectFood: (food: FoodItem) => void;
  onViewAllLogs: () => void;
  onQuickLog: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  loggedMeals,
  recentFoods,
  onOpenPhotoRecognition,
  onOpenBarcodeScanner,
  onSelectFood,
  onViewAllLogs,
}) => {
  // Calculate today's consumed calories
  const totalCalories = loggedMeals.reduce((acc, item) => acc + item.calories, 0);
  const targetCalories = userProfile.dailyCalorieTarget || 2000;
  const percentage = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const remainingCalories = Math.max(0, targetCalories - totalCalories);

  // Status badge calculation
  const getStatusBadge = () => {
    if (percentage <= 75) return { text: '目标达成良好', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (percentage <= 100) return { text: '接近今日目标', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { text: '轻微超出摄入', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const status = getStatusBadge();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div id="home-view-container" className="px-4 py-4 space-y-6 pb-24 animate-fadeIn">
      {/* User Greeting Section */}
      <section id="home-greeting-section" className="space-y-1.5 pt-1">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          {getGreeting()}，今天吃点什么？
        </h2>
        <p className="text-sm text-slate-500 font-normal">
          保持健康饮食，从了解每一口食物开始。
        </p>
      </section>

      {/* Two Big Recognition Action Cards (Orange & Green) */}
      <section id="home-quick-actions" className="grid grid-cols-2 gap-3.5">
        {/* Photo Recognition Card (Orange) */}
        <button
          id="btn-photo-recognition"
          onClick={onOpenPhotoRecognition}
          className="group relative overflow-hidden bg-gradient-to-br from-[#ff7a45] to-[#f95726] rounded-2xl p-5 text-white flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-[0.98] min-h-[140px]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <span className="text-lg font-bold tracking-wide">拍照识别</span>
          <span className="text-[11px] text-white/80 mt-1">AI 毫秒级分析菜品</span>
        </button>

        {/* Barcode / QR Scan Card (Green) */}
        <button
          id="btn-barcode-recognition"
          onClick={onOpenBarcodeScanner}
          className="group relative overflow-hidden bg-gradient-to-br from-[#2db059] to-[#1e9645] rounded-2xl p-5 text-white flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-[0.98] min-h-[140px]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <span className="text-lg font-bold tracking-wide">扫码识别</span>
          <span className="text-[11px] text-white/80 mt-1">配料表与营养标签</span>
        </button>
      </section>

      {/* Today's Calorie Intake Gauge Card */}
      <section
        id="home-calorie-intake-card"
        className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            今日已摄入热量
          </h3>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${status.bg}`}
          >
            {status.text}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#22c55e"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Calorie Stats */}
          <div className="flex-1 space-y-1.5 pl-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {totalCalories}
              </span>
              <span className="text-sm font-medium text-slate-500">
                / {targetCalories} kcal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              还可摄入 <span className="font-semibold text-emerald-700">{remainingCalories}</span> kcal
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>建议晚餐：以低油高纤蔬菜为主</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Records (最近记录) */}
      <section id="home-recent-records" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            最近记录
          </h3>
          <button
            id="btn-view-all-records"
            onClick={onViewAllLogs}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            查看全部
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Food cards grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {recentFoods.slice(0, 4).map((food) => (
            <div
              key={food.id}
              id={`recent-food-${food.id}`}
              onClick={() => onSelectFood(food)}
              className="group bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                  {food.nutrients.servingWeight}g
                </span>
              </div>
              <div className="space-y-0.5 px-1">
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {food.name}
                </h4>
                <p className="text-xs font-medium text-slate-500">
                  {food.nutrients.calories} kcal
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
