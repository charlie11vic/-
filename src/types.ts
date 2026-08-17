export interface NutrientInfo {
  calories: number; // kcal
  servingSize: string; // e.g. "一份 (约 300g)"
  servingWeight: number; // in grams e.g. 300
  dailyPercent: number; // e.g. 65%
  protein: number; // in grams
  fat: number; // in grams
  carbs: number; // in grams
  fiber?: number; // g
  sodium?: number; // mg
  sugar?: number; // g
}

export interface TasteProfile {
  saltiness: number; // 0 to 100
  spiciness: number; // 0 to 100
  sweetness: number; // 0 to 100
}

export interface FoodItem {
  id: string;
  name: string;
  category: string; // e.g. "经典川菜 · 炒制"
  imageUrl: string;
  confidence?: number; // 0 to 100, e.g. 85
  minWeight?: number; // e.g. 180
  maxWeight?: number; // e.g. 220
  currentWeight?: number; // e.g. 200
  nutrients: NutrientInfo;
  taste: TasteProfile;
  additiveRisk: 'low' | 'medium' | 'high';
  additiveRiskLabel: string; // e.g. "低风险"
  allergens: string[]; // e.g. ["含花生", "含大豆 (酱油)"]
  nutritionistAdvice: string;
  verified?: boolean;
}

export interface LoggedMealItem {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  weight: number;
  imageUrl: string;
  source: 'camera' | 'barcode' | 'manual';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface UserHealthProfile {
  id: string;
  nickname: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  age: number;
  height: number; // cm
  weight: number; // kg
  targetWeight: number; // kg
  goal: 'lose_fat' | 'gain_muscle' | 'maintain';
  activityHours: number; // weekly exercise hours
  dailyCalorieTarget: number; // default 2000
  dietaryPreferences: string[]; // ['清淡', '减糖', '微辣', '节油', '素食']
  allergies: string[]; // ['花生', '海鲜', '大豆']
  privacyAccepted: boolean;
}

export type ActiveTab = 'home' | 'log' | 'recognize' | 'profile';
