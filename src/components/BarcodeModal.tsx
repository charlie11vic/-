import React, { useState } from 'react';
import { QrCode, X, Sparkles, Barcode, CheckCircle2 } from 'lucide-react';
import { FoodItem } from '../types';

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecognized: (food: FoodItem) => void;
}

const BARCODE_ITEMS: Array<{ code: string; name: string; brand: string; food: FoodItem }> = [
  {
    code: '6901234567890',
    name: '全麦三明治 (低脂鸡胸)',
    brand: '鲜食工坊',
    food: {
      id: 'sandwich_wheat',
      name: '全麦三明治',
      category: '预包装鲜食 · 冷藏',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
      confidence: 99,
      minWeight: 150,
      maxWeight: 170,
      currentWeight: 160,
      nutrients: {
        calories: 250,
        servingSize: '一份 (约 160g)',
        servingWeight: 160,
        dailyPercent: 13,
        protein: 14,
        fat: 8,
        carbs: 32,
        fiber: 5.1,
        sodium: 380,
        sugar: 3.2,
      },
      taste: { saltiness: 40, spiciness: 0, sweetness: 15 },
      additiveRisk: 'low',
      additiveRiskLabel: '符合国家安全标准',
      allergens: ['含麸质谷物', '含鸡蛋', '含乳制品'],
      nutritionistAdvice: '商品条码精准匹配。高蛋白、全麦碳水，热量控制理想。',
      verified: true,
    },
  },
  {
    code: '6909876543210',
    name: '希腊酸奶 (原味 0蔗糖)',
    brand: '简爱/卡士',
    food: {
      id: 'greek_yogurt',
      name: '原味希腊酸奶 (0蔗糖)',
      category: '乳制品 · 发酵乳',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
      confidence: 100,
      minWeight: 135,
      maxWeight: 150,
      currentWeight: 140,
      nutrients: {
        calories: 110,
        servingSize: '一杯 (约 140g)',
        servingWeight: 140,
        dailyPercent: 6,
        protein: 9.8,
        fat: 4.5,
        carbs: 5.2,
        fiber: 0,
        sodium: 65,
        sugar: 4.8,
      },
      taste: { saltiness: 5, spiciness: 0, sweetness: 20 },
      additiveRisk: 'low',
      additiveRiskLabel: '天然生牛乳发酵',
      allergens: ['含乳制品'],
      nutritionistAdvice: '优质乳清蛋白与活性益生菌，饱腹感强，极佳的加餐选择。',
      verified: true,
    },
  },
  {
    code: '6905544332211',
    name: '燕麦植物奶 (无添加糖)',
    brand: 'OATLY 咖啡大师',
    food: {
      id: 'oat_milk',
      name: '燕麦植物奶 (无添加糖)',
      category: '植物蛋白饮料 · 灭菌',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      confidence: 100,
      minWeight: 240,
      maxWeight: 260,
      currentWeight: 250,
      nutrients: {
        calories: 145,
        servingSize: '一杯 (约 250ml)',
        servingWeight: 250,
        dailyPercent: 7,
        protein: 3.2,
        fat: 4.8,
        carbs: 21,
        fiber: 2.5,
        sodium: 95,
        sugar: 7.5,
      },
      taste: { saltiness: 10, spiciness: 0, sweetness: 35 },
      additiveRisk: 'low',
      additiveRiskLabel: '低风险',
      allergens: ['含燕麦(麸质)'],
      nutritionistAdvice: '含可溶性膳食纤维β-葡聚糖，乳糖不耐受人群的优选替代奶。',
      verified: true,
    },
  },
];

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  isOpen,
  onClose,
  onRecognized,
}) => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  if (!isOpen) return null;

  const handleSelectBarcodeItem = (item: typeof BARCODE_ITEMS[0]) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onRecognized(item.food);
    }, 700);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    // Match code or return first item
    const found = BARCODE_ITEMS.find((b) => b.code.includes(manualCode.trim())) || BARCODE_ITEMS[0];
    handleSelectBarcodeItem(found);
  };

  return (
    <div
      id="barcode-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between p-4 max-w-md mx-auto animate-fadeIn"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white pt-2">
        <h3 className="text-base font-bold flex items-center gap-2">
          <QrCode className="w-5 h-5 text-emerald-400" />
          条形码 / 商品营养表扫描
        </h3>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Barcode Laser Window */}
      <div className="relative flex-1 my-4 rounded-3xl overflow-hidden bg-slate-900 border-2 border-emerald-500/50 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
        <div className="space-y-3">
          <div className="w-24 h-16 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center mx-auto bg-emerald-500/10">
            <Barcode className="w-16 h-10 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white">将商品包装条形码置于框内</p>
          <p className="text-xs text-slate-400">
            自动匹配国家预包装食品营养标签数据库
          </p>
        </div>

        {/* Animated Laser Line */}
        <div className="absolute left-6 right-6 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse top-1/2 -translate-y-1/2" />
      </div>

      {/* Quick Select Barcode Foods */}
      <div className="space-y-3 pb-2">
        <p className="text-xs text-white/80 font-medium">快速扫描样例商品：</p>
        <div className="space-y-2">
          {BARCODE_ITEMS.map((item) => (
            <button
              key={item.code}
              onClick={() => handleSelectBarcodeItem(item)}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white/15 text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.food.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <p className="text-xs font-bold">{item.name}</p>
                  <p className="text-[10px] text-emerald-300">条码: {item.code}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-orange-400">
                {item.food.nutrients.calories} kcal
              </span>
            </button>
          ))}
        </div>

        {/* Manual Code Input */}
        <form onSubmit={handleManualSearch} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="输入69开头的商品条形码..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            查询
          </button>
        </form>
      </div>
    </div>
  );
};
