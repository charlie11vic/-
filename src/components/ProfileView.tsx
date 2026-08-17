import React, { useState } from 'react';
import {
  User,
  Check,
  Activity,
  Flame,
  Scale,
  Shield,
  Heart,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { UserHealthProfile } from '../types';

interface ProfileViewProps {
  userProfile: UserHealthProfile;
  onUpdateProfile: (updated: UserHealthProfile) => void;
  onOpenPrivacyModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenPrivacyModal,
}) => {
  const [profile, setProfile] = useState<UserHealthProfile>(userProfile);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Calculate BMI
  const heightM = profile.height / 100;
  const bmi = heightM > 0 ? (profile.weight / (heightM * heightM)).toFixed(1) : '22.0';

  const getBmiStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: '偏瘦', color: 'text-amber-600 bg-amber-50' };
    if (bmiValue <= 23.9) return { label: '正常范围', color: 'text-emerald-700 bg-emerald-50' };
    if (bmiValue <= 27.9) return { label: '偏重', color: 'text-orange-600 bg-orange-50' };
    return { label: '超重', color: 'text-rose-600 bg-rose-50' };
  };

  const handleGenderChange = (gender: 'male' | 'female') => {
    const updated = { ...profile, gender };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleGoalChange = (goal: 'lose_fat' | 'gain_muscle' | 'maintain') => {
    let targetCals = 2000;
    if (goal === 'lose_fat') targetCals = 1600;
    if (goal === 'gain_muscle') targetCals = 2400;

    const updated = { ...profile, goal, dailyCalorieTarget: targetCals };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const togglePreference = (pref: string) => {
    const exists = profile.dietaryPreferences.includes(pref);
    const updatedPrefs = exists
      ? profile.dietaryPreferences.filter((p) => p !== pref)
      : [...profile.dietaryPreferences, pref];

    const updated = { ...profile, dietaryPreferences: updatedPrefs };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const toggleAllergy = (allergy: string) => {
    const exists = profile.allergies.includes(allergy);
    const updatedAllergies = exists
      ? profile.allergies.filter((a) => a !== allergy)
      : [...profile.allergies, allergy];

    const updated = { ...profile, allergies: updatedAllergies };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleSave = () => {
    onUpdateProfile(profile);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const preferenceOptions = ['清淡', '减糖', '微辣', '节油', '素食', '高蛋白', '低碳水'];
  const allergyOptions = ['花生', '大豆', '海鲜', '坚果', '牛奶', '鸡蛋', '小麦面筋'];

  return (
    <div id="profile-view-container" className="px-4 py-4 space-y-5 pb-28 animate-fadeIn">
      {/* 1. Avatar & User ID Card */}
      <section className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-emerald-50 shadow-sm">
            <img
              src={profile.avatarUrl}
              alt={profile.nickname}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs border-2 border-white">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {profile.nickname}
          </h2>
          <p className="text-xs text-slate-400">已开启 AI 专属营养定制</p>
        </div>
      </section>

      {/* 2. Basic Information (基础信息) */}
      <section className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            基础信息
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${getBmiStatus(Number(bmi)).color}`}>
            BMI {bmi} ({getBmiStatus(Number(bmi)).label})
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">性别</label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleGenderChange('male')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  profile.gender === 'male'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                男
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('female')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  profile.gender === 'female'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                女 ✓
              </button>
            </div>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">年龄</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-1.5">
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">岁</span>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">身高</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-1.5">
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">cm</span>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">体重</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-1.5">
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dietary Goal (饮食习惯 / 目标) */}
      <section className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          饮食目标
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleGoalChange('lose_fat')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              profile.goal === 'lose_fat'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            减脂塑形
          </button>
          <button
            type="button"
            onClick={() => handleGoalChange('gain_muscle')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              profile.goal === 'gain_muscle'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            增肌增重
          </button>
          <button
            type="button"
            onClick={() => handleGoalChange('maintain')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              profile.goal === 'maintain'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            保持健康
          </button>
        </div>
      </section>

      {/* 4. Weekly Exercise (每周运动时长) */}
      <section className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            每周运动时长
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {profile.activityHours <= 1
              ? '很少运动'
              : profile.activityHours <= 3
              ? '1-3 小时'
              : profile.activityHours <= 5
              ? '3-5 小时'
              : '6小时以上'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="8"
          step="1"
          value={profile.activityHours}
          onChange={(e) => setProfile({ ...profile, activityHours: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>0h</span>
          <span>2h</span>
          <span>4h (推荐)</span>
          <span>6h</span>
          <span>8h+</span>
        </div>
      </section>

      {/* 5. Taste & Dietary Preferences (口味偏好) */}
      <section className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500" />
          口味偏好与习惯
        </h3>

        <div className="flex flex-wrap gap-2">
          {preferenceOptions.map((pref) => {
            const isSelected = profile.dietaryPreferences.includes(pref);
            return (
              <button
                key={pref}
                type="button"
                onClick={() => togglePreference(pref)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                {pref} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Allergens (过敏原) */}
      <section className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-rose-500" />
          个人过敏原警示设置
        </h3>

        <div className="flex flex-wrap gap-2">
          {allergyOptions.map((allergy) => {
            const isSelected = profile.allergies.includes(allergy);
            return (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleAllergy(allergy)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-rose-50 text-rose-700 border border-rose-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                ● {allergy} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Privacy Statement Link */}
      <div className="text-center pt-1">
        <button
          onClick={onOpenPrivacyModal}
          className="text-xs text-slate-400 hover:text-emerald-700 underline transition-colors"
        >
          查看《隐私保护与数据安全说明》
        </button>
      </div>

      {/* Save Button */}
      <button
        id="btn-save-profile"
        onClick={handleSave}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#f95726] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        <span>保存健康档案</span>
      </button>

      {/* Toast */}
      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs py-2 px-4 rounded-full shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          健康档案已更新
        </div>
      )}
    </div>
  );
};
