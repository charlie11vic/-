import React, { useState } from 'react';
import { X, Check, Sunrise, Sun, Sunset, Coffee, PlusCircle } from 'lucide-react';
import { FoodItem, LoggedMealItem } from '../types';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: FoodItem | null;
  onConfirmAdd: (item: LoggedMealItem) => void;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  food,
  onConfirmAdd,
}) => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [portionGrams, setPortionGrams] = useState<number>(food?.nutrients.servingWeight || 200);

  if (!isOpen || !food) return null;

  const handleConfirm = () => {
    const ratio = portionGrams / (food.nutrients.servingWeight || 200);
    const newMeal: LoggedMealItem = {
      id: 'log_' + Date.now(),
      foodId: food.id,
      name: food.name,
      calories: Math.round(food.nutrients.calories * ratio),
      weight: portionGrams,
      imageUrl: food.imageUrl,
      source: 'camera',
      mealType,
      date: '2026-08-24',
      nutrients: {
        protein: Number((food.nutrients.protein * ratio).toFixed(1)),
        fat: Number((food.nutrients.fat * ratio).toFixed(1)),
        carbs: Number((food.nutrients.carbs * ratio).toFixed(1)),
      },
    };

    onConfirmAdd(newMeal);
    onClose();
  };

  const mealOptions = [
    { type: 'breakfast' as const, label: '早餐', icon: Sunrise, color: 'text-emerald-600' },
    { type: 'lunch' as const, label: '午餐', icon: Sun, color: 'text-orange-500' },
    { type: 'dinner' as const, label: '晚餐', icon: Sunset, color: 'text-indigo-500' },
    { type: 'snack' as const, label: '加餐', icon: Coffee, color: 'text-amber-600' },
  ];

  return (
    <div
      id="add-meal-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        id="add-meal-modal-content"
        className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-scaleUp"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            记录到饮食日记
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Food Preview */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-12 h-12 rounded-xl object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{food.name}</h4>
            <p className="text-xs text-slate-400">
              {Math.round(food.nutrients.calories * (portionGrams / (food.nutrients.servingWeight || 200)))} kcal ({portionGrams}g)
            </p>
          </div>
        </div>

        {/* Meal Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">选择用餐时段：</label>
          <div className="grid grid-cols-4 gap-2">
            {mealOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = mealType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setMealType(opt.type)}
                  className={`py-2.5 px-1 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : opt.color}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portion adjustment slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">进食分量：</span>
            <span className="text-emerald-700">{portionGrams} 克 (g)</span>
          </div>
          <input
            type="range"
            min="50"
            max="600"
            step="10"
            value={portionGrams}
            onChange={(e) => setPortionGrams(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#f95726] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            确认添加并返回日记
          </button>
        </div>
      </div>
    </div>
  );
};
