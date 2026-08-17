import React, { useState } from 'react';
import { CheckCircle2, Edit3, Minus, Plus, Sparkles, Scale } from 'lucide-react';
import { FoodItem } from '../types';

interface EstimateViewProps {
  food: FoodItem;
  onConfirm: (adjustedFood: FoodItem) => void;
  onOpenCorrection: () => void;
}

export const EstimateView: React.FC<EstimateViewProps> = ({
  food,
  onConfirm,
  onOpenCorrection,
}) => {
  const minGrams = food.minWeight || 180;
  const maxGrams = food.maxWeight || 220;
  const initialWeight = food.currentWeight || Math.round((minGrams + maxGrams) / 2);

  const [weight, setWeight] = useState<number>(initialWeight);

  const handleMinus = () => {
    setWeight((prev) => Math.max(50, prev - 10));
  };

  const handlePlus = () => {
    setWeight((prev) => Math.min(800, prev + 10));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value));
  };

  const handleConfirm = () => {
    // Recalculate nutrients proportionally based on weight ratio
    const baseWeight = food.nutrients.servingWeight || 300;
    const ratio = weight / baseWeight;

    const adjustedFood: FoodItem = {
      ...food,
      currentWeight: weight,
      nutrients: {
        ...food.nutrients,
        calories: Math.round(food.nutrients.calories * ratio),
        protein: Number((food.nutrients.protein * ratio).toFixed(1)),
        fat: Number((food.nutrients.fat * ratio).toFixed(1)),
        carbs: Number((food.nutrients.carbs * ratio).toFixed(1)),
        sodium: food.nutrients.sodium ? Math.round(food.nutrients.sodium * ratio) : undefined,
        servingSize: `一份 (约 ${weight}g)`,
        servingWeight: weight,
        dailyPercent: Math.min(100, Math.round((Math.round(food.nutrients.calories * ratio) / 2000) * 100)),
      },
    };

    onConfirm(adjustedFood);
  };

  return (
    <div id="estimate-view-container" className="min-h-screen bg-slate-50 flex flex-col justify-between pb-6">
      <div className="space-y-4">
        {/* Top Food Picture */}
        <div className="w-full h-72 sm:h-80 bg-slate-200 relative overflow-hidden">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Bottom Content Card */}
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-5 pt-6 pb-6 shadow-sm space-y-6">
          {/* AI Confidence Badge */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              id="ai-confidence-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>识别置信度 {food.confidence || 85}%</span>
            </div>

            {/* AI Suggestion Food Name */}
            <h2
              id="ai-suggested-food-name"
              className="text-2xl font-black text-slate-900 tracking-tight text-center"
            >
              AI 建议结果：{food.name}
            </h2>

            {/* Correction Link */}
            <button
              id="btn-food-correction"
              onClick={onOpenCorrection}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              结果不准？点击修正
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Portion Estimate Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                估计分量
              </h3>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
                滑动微调
              </span>
            </div>

            {/* Blue Range Card */}
            <div className="bg-blue-50/70 border border-blue-100/80 rounded-2xl p-6 text-center space-y-1">
              <p className="text-xs font-medium text-slate-500">当前估计范围</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm font-medium text-slate-600">约</span>
                <span className="text-3xl font-black text-emerald-700 tracking-tight">
                  {Math.max(50, weight - 20)} - {weight + 20}
                </span>
                <span className="text-base font-bold text-slate-700">克</span>
              </div>
              <p className="text-xs text-slate-400">
                当前设定：<span className="font-semibold text-slate-700">{weight}g</span>
              </p>
            </div>

            {/* Slider with [-] and [+] Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-weight-minus"
                onClick={handleMinus}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95 flex-shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex-1 relative flex items-center">
                <input
                  id="weight-range-slider"
                  type="range"
                  min="50"
                  max="600"
                  step="5"
                  value={weight}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <button
                id="btn-weight-plus"
                onClick={handlePlus}
                className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors active:scale-95 flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="px-5 pt-4">
        <button
          id="btn-confirm-nutrition-analysis"
          onClick={handleConfirm}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#f95726] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] text-center"
        >
          确认，查看营养分析
        </button>
      </div>
    </div>
  );
};
