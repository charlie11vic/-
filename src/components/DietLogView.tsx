import React, { useState } from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  Coffee,
  Camera,
  QrCode,
  Edit2,
  Trash2,
  Plus,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { LoggedMealItem, UserHealthProfile } from '../types';

interface DietLogViewProps {
  loggedMeals: LoggedMealItem[];
  userProfile: UserHealthProfile;
  onDeleteMealItem: (id: string) => void;
  onOpenScanner: () => void;
  onSelectFoodName?: (name: string) => void;
}

export const DietLogView: React.FC<DietLogViewProps> = ({
  loggedMeals,
  userProfile,
  onDeleteMealItem,
  onOpenScanner,
}) => {
  // Calendar days around current day
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [swipedItemId, setSwipedItemId] = useState<string | null>('log_3'); // default show delete action on 宫保鸡丁 like in screenshot

  const days = [
    { label: '一', day: 21 },
    { label: '二', day: 22 },
    { label: '三', day: 23 },
    { label: '四', day: 24 },
    { label: '五', day: 25 },
    { label: '六', day: 26 },
    { label: '日', day: 27 },
  ];

  // Group meals
  const breakfastItems = loggedMeals.filter((m) => m.mealType === 'breakfast');
  const lunchItems = loggedMeals.filter((m) => m.mealType === 'lunch');
  const dinnerItems = loggedMeals.filter((m) => m.mealType === 'dinner');
  const snackItems = loggedMeals.filter((m) => m.mealType === 'snack');

  const breakfastCalories = breakfastItems.reduce((s, i) => s + i.calories, 0);
  const lunchCalories = lunchItems.reduce((s, i) => s + i.calories, 0);
  const dinnerCalories = dinnerItems.reduce((s, i) => s + i.calories, 0);
  const snackCalories = snackItems.reduce((s, i) => s + i.calories, 0);

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
  const targetCalories = 1800;

  // Macros sum
  const totalCarbs = loggedMeals.reduce((s, i) => s + i.nutrients.carbs, 0);
  const totalProtein = loggedMeals.reduce((s, i) => s + i.nutrients.protein, 0);
  const totalFat = loggedMeals.reduce((s, i) => s + i.nutrients.fat, 0);

  // Proportions for segmented progress bar
  const macroTotal = (totalCarbs * 4) + (totalProtein * 4) + (totalFat * 9) || 1;
  const carbsPercent = Math.round(((totalCarbs * 4) / macroTotal) * 100);
  const proteinPercent = Math.round(((totalProtein * 4) / macroTotal) * 100);
  const fatPercent = Math.max(0, 100 - carbsPercent - proteinPercent);

  return (
    <div id="diet-log-container" className="px-4 py-3 space-y-5 pb-28 animate-fadeIn">
      {/* 1. Date Selector Bar */}
      <section id="diet-log-date-bar" className="flex items-center justify-between gap-1 overflow-x-auto py-1">
        {days.map((d) => {
          const isSelected = d.day === selectedDay;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-[#15803d] text-white shadow-sm font-bold scale-105'
                  : 'bg-blue-50/60 text-slate-600 hover:bg-blue-100/60'
              }`}
            >
              <span className={`text-[11px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                {d.label}
              </span>
              <span className="text-base font-bold mt-0.5">{d.day}</span>
            </button>
          );
        })}
      </section>

      {/* 2. Today Nutrition Card (今日营养) */}
      <section
        id="diet-today-nutrition-card"
        className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">今日营养</h3>
          <span className="text-sm font-bold text-slate-700">
            {totalCalories} / {targetCalories} kcal
          </span>
        </div>

        {/* Stacked Segmented Macro Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-[#ff7a45] h-full transition-all duration-700"
            style={{ width: `${carbsPercent}%` }}
            title={`碳水化合物 ${carbsPercent}%`}
          />
          <div
            className="bg-[#15803d] h-full transition-all duration-700"
            style={{ width: `${proteinPercent}%` }}
            title={`蛋白质 ${proteinPercent}%`}
          />
          <div
            className="bg-[#9a3412] h-full transition-all duration-700"
            style={{ width: `${fatPercent}%` }}
            title={`脂肪 ${fatPercent}%`}
          />
        </div>

        {/* Macro Labels */}
        <div className="flex items-center justify-between text-xs font-medium pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a45]" />
            <span className="text-slate-700">碳水 {totalCarbs.toFixed(0)}g</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
            <span className="text-slate-700">蛋白质 {totalProtein.toFixed(0)}g</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9a3412]" />
            <span className="text-slate-700">脂肪 {totalFat.toFixed(0)}g</span>
          </div>
        </div>
      </section>

      {/* 3. Breakfast Section (早餐) */}
      <section id="diet-meal-breakfast" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base font-bold text-slate-900">早餐</h4>
          </div>
          <span className="text-sm font-semibold text-slate-500">{breakfastCalories} kcal</span>
        </div>

        <div className="space-y-2">
          {breakfastItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{item.name}</h5>
                  <p className="text-xs text-slate-400 font-medium">{item.calories} kcal</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                {item.source === 'barcode' ? (
                  <QrCode className="w-5 h-5 text-slate-400" />
                ) : (
                  <Camera className="w-5 h-5 text-slate-400" />
                )}
                <button
                  onClick={() => onDeleteMealItem(item.id)}
                  className="p-1.5 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {breakfastItems.length === 0 && (
            <button
              onClick={onOpenScanner}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-600 flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> 记录早餐
            </button>
          )}
        </div>
      </section>

      {/* 4. Lunch Section (午餐) */}
      <section id="diet-meal-lunch" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-orange-500" />
            <h4 className="text-base font-bold text-slate-900">午餐</h4>
          </div>
          <span className="text-sm font-semibold text-slate-500">{lunchCalories} kcal</span>
        </div>

        <div className="space-y-2">
          {lunchItems.map((item) => {
            const isSwiped = swipedItemId === item.id;
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-slate-100 shadow-xs bg-white"
              >
                <div className="flex items-stretch justify-between">
                  <div
                    onClick={() => setSwipedItemId(isSwiped ? null : item.id)}
                    className="flex-1 p-3 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {item.foodId === 'brown_rice' ? (
                        <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{item.name}</h5>
                        <p className="text-xs text-slate-400 font-medium">{item.calories} kcal</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mr-2">
                      {item.foodId === 'brown_rice' ? (
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Camera className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Red Delete Button (Matches Screenshot Image 7.png) */}
                  <button
                    onClick={() => onDeleteMealItem(item.id)}
                    className="w-16 bg-[#b91c1c] text-white flex items-center justify-center hover:bg-rose-700 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          {lunchItems.length === 0 && (
            <button
              onClick={onOpenScanner}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-600 flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> 记录午餐
            </button>
          )}
        </div>
      </section>

      {/* 5. Dinner Section (晚餐) */}
      <section id="diet-meal-dinner" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunset className="w-5 h-5 text-indigo-500" />
            <h4 className="text-base font-bold text-slate-900">晚餐</h4>
          </div>
          <span className="text-sm font-semibold text-slate-500">{dinnerCalories} kcal</span>
        </div>

        <div className="space-y-2">
          {dinnerItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{item.name}</h5>
                  <p className="text-xs text-slate-400 font-medium">{item.calories} kcal</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteMealItem(item.id)}
                className="p-1.5 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors text-slate-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={onOpenScanner}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-600 flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" /> + 记录晚餐
          </button>
        </div>
      </section>

      {/* 6. Snacks Section (加餐) */}
      <section id="diet-meal-snack" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-600" />
            <h4 className="text-base font-bold text-slate-900">加餐 / 水果</h4>
          </div>
          <span className="text-sm font-semibold text-slate-500">{snackCalories} kcal</span>
        </div>

        <div className="space-y-2">
          {snackItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{item.name}</h5>
                  <p className="text-xs text-slate-400 font-medium">{item.calories} kcal</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteMealItem(item.id)}
                className="p-1.5 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors text-slate-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={onOpenScanner}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-600 flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" /> + 记录加餐
          </button>
        </div>
      </section>
    </div>
  );
};
