import React, { useState } from 'react';
import {
  Flame,
  Leaf,
  FlaskConical,
  AlertTriangle,
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Plus,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { FoodItem, UserHealthProfile } from '../types';

interface DetailViewProps {
  food: FoodItem;
  userProfile: UserHealthProfile;
  onAddToDailyLog: (food: FoodItem) => void;
  onAskNutritionist?: (question: string) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  food,
  userProfile,
  onAddToDailyLog,
}) => {
  const [showMacroDetail, setShowMacroDetail] = useState(false);
  const [showAdditiveDetail, setShowAdditiveDetail] = useState(false);
  const [showAllergenDetail, setShowAllergenDetail] = useState(false);

  const { nutrients, taste, allergens, additiveRiskLabel, nutritionistAdvice } = food;

  return (
    <div id="detail-view-container" className="px-4 py-4 space-y-4 pb-28 animate-fadeIn">
      {/* 1. Food Header Card */}
      <section
        id="detail-food-summary-card"
        className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {food.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{food.category}</p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </section>

      {/* 2. Calorie Analysis Card (热量分析) */}
      <section
        id="detail-calorie-card"
        className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-orange-500">热量分析</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {nutrients.calories}
              </span>
              <span className="text-sm font-semibold text-slate-600">kcal</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {nutrients.servingSize}
            </p>
          </div>

          {/* Semicircle Gauge (65%) */}
          <div className="relative w-28 h-16 flex items-end justify-center">
            <svg className="w-28 h-14 overflow-visible" viewBox="0 0 100 50">
              {/* Background Semicircle Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Foreground Orange Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#ff7a45"
                strokeWidth="10"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (nutrients.dailyPercent || 65)) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-xs font-black text-[#ff7a45]">
                {nutrients.dailyPercent || 65}%
              </span>
            </div>
          </div>
        </div>

        {/* Daily Recommendation Pill */}
        <div className="bg-orange-50/70 text-orange-700/80 text-xs py-2 rounded-xl text-center font-medium">
          占每日推荐值的 {nutrients.dailyPercent || 65}%
        </div>
      </section>

      {/* 3. Nutrition Composition Card (营养成分) */}
      <section
        id="detail-nutrients-card"
        className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-4"
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowMacroDetail(!showMacroDetail)}
        >
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-emerald-600">营养成分</h3>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showMacroDetail ? 'rotate-90' : ''
            }`}
          />
        </div>

        <div className="space-y-3.5 pt-1">
          {/* Protein */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-700">蛋白质</span>
              <span className="text-slate-800 font-bold">{nutrients.protein}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (nutrients.protein / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-700">脂肪</span>
              <span className="text-slate-800 font-bold">{nutrients.fat}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff9f7d] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (nutrients.fat / 65) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-700">碳水化合物</span>
              <span className="text-slate-800 font-bold">{nutrients.carbs}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#86efac] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (nutrients.carbs / 250) * 100)}%` }}
              />
            </div>
          </div>

          {/* Micro Nutrients Breakdown */}
          {showMacroDetail && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs animate-fadeIn">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">膳食纤维</span>
                <span className="font-bold text-slate-800">{nutrients.fiber || 3.2}g</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">钠含量</span>
                <span className="font-bold text-slate-800">{nutrients.sodium || 1150}mg</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">糖分</span>
                <span className="font-bold text-slate-800">{nutrients.sugar || 6.8}g</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Taste Profile Card (口感分析) */}
      <section
        id="detail-taste-card"
        className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-slate-600" />
            <h3 className="text-base font-bold text-slate-700">口感分析</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-4 pt-1">
          {/* Saltiness */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-700 w-10">咸度</span>
            <div className="flex-1 relative flex items-center">
              <div className="w-full h-1.5 bg-blue-100/80 rounded-full" />
              <div
                className="absolute w-3.5 h-3.5 bg-slate-600 rounded-full ring-2 ring-white shadow-sm"
                style={{ left: `calc(${taste.saltiness}% - 7px)` }}
              />
            </div>
          </div>

          {/* Spiciness */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-700 w-10">辣度</span>
            <div className="flex-1 relative flex items-center">
              <div className="w-full h-1.5 bg-blue-100/80 rounded-full" />
              <div
                className="absolute w-3.5 h-3.5 bg-rose-600 rounded-full ring-2 ring-white shadow-sm"
                style={{ left: `calc(${taste.spiciness}% - 7px)` }}
              />
            </div>
          </div>

          {/* Sweetness */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-700 w-10">甜度</span>
            <div className="flex-1 relative flex items-center">
              <div className="w-full h-1.5 bg-blue-100/80 rounded-full" />
              <div
                className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white shadow-sm"
                style={{ left: `calc(${taste.sweetness}% - 7px)` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Additive Risk Card (添加剂风险) */}
      <section
        id="detail-additive-card"
        onClick={() => setShowAdditiveDetail(!showAdditiveDetail)}
        className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">添加剂风险</h4>
            <p className="text-xs text-slate-400">加工过程评估</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full font-medium">
            {additiveRiskLabel || '低风险'}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </section>

      {/* 6. Allergen Notice Card (过敏原提示) */}
      <section
        id="detail-allergen-card"
        className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px]">
              !
            </div>
            <h3 className="text-sm font-bold text-rose-600">过敏原提示</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {allergens && allergens.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {allergens.map((allergen, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-3 py-1.5 bg-rose-50/80 text-rose-700 border border-rose-100 rounded-xl flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {allergen}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">未检测到常见高危过敏原</p>
        )}
      </section>

      {/* 7. AI Nutritionist Advice Card (你的专属营养师说) (Image 3.png) */}
      <section
        id="detail-nutritionist-card"
        className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-4 space-y-2.5 relative overflow-hidden"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-emerald-800">你的专属营养师说</h4>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          {nutritionistAdvice ||
            '这道菜热量适中，但钠含量偏高，建议今天晚餐少放盐，多补充一些绿叶蔬菜。'}
        </p>

        <p className="text-[10px] text-slate-400 pt-1">
          此建议仅供参考，不能替代专业医疗诊断
        </p>
      </section>

      {/* Bottom Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md max-w-md mx-auto p-4 border-t border-slate-100">
        <button
          id="btn-add-to-diet-log"
          onClick={() => onAddToDailyLog(food)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#f95726] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>记录到今日饮食</span>
        </button>
      </div>
    </div>
  );
};
