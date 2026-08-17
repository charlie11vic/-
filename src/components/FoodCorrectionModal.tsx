import React, { useState } from 'react';
import { X, Search, Check, Utensils, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';
import { PRESET_FOODS } from '../data/initialData';

interface FoodCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCorrection: (food: FoodItem) => void;
}

export const FoodCorrectionModal: React.FC<FoodCorrectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCorrection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const filteredFoods = PRESET_FOODS.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    // Create customized dish
    const newFood: FoodItem = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      category: '自定义菜品 · 家常',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      confidence: 100,
      minWeight: 180,
      maxWeight: 220,
      currentWeight: 200,
      nutrients: {
        calories: 320,
        servingSize: '一份 (约 200g)',
        servingWeight: 200,
        dailyPercent: 16,
        protein: 16,
        fat: 12,
        carbs: 35,
        fiber: 3.5,
        sodium: 480,
        sugar: 4,
      },
      taste: {
        saltiness: 50,
        spiciness: 20,
        sweetness: 30,
      },
      additiveRisk: 'low',
      additiveRiskLabel: '低风险',
      allergens: [],
      nutritionistAdvice: '已根据用户输入重新估算营养，适量进食，保持多样化搭配。',
      verified: false,
    };

    onSelectCorrection(newFood);
    onClose();
  };

  return (
    <div
      id="correction-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        id="correction-modal-content"
        className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            修正 AI 识别结果
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索正确菜品名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Preset List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-56">
          {filteredFoods.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                onSelectCorrection(f);
                onClose();
              }}
              className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={f.imageUrl}
                  alt={f.name}
                  className="w-10 h-10 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">{f.name}</p>
                  <p className="text-[10px] text-slate-400">{f.category}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">{f.nutrients.calories} kcal</span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-xs text-slate-500 font-medium">没有找到？输入菜名自动生成营养：</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="例如：番茄炒蛋、清蒸鲈鱼"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              确定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
