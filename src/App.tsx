/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { EstimateView } from './components/EstimateView';
import { DetailView } from './components/DetailView';
import { DietLogView } from './components/DietLogView';
import { ProfileView } from './components/ProfileView';
import { ScannerModal } from './components/ScannerModal';
import { BarcodeModal } from './components/BarcodeModal';
import { FoodCorrectionModal } from './components/FoodCorrectionModal';
import { AddMealModal } from './components/AddMealModal';
import { PrivacyModal } from './components/PrivacyModal';
import { NotificationModal } from './components/NotificationModal';

import { ActiveTab, FoodItem, LoggedMealItem, UserHealthProfile } from './types';
import { PRESET_FOODS, INITIAL_USER_PROFILE, INITIAL_LOGGED_MEALS } from './data/initialData';
import { CheckCircle2, Share2 } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewState, setViewState] = useState<'main' | 'estimate' | 'detail'>('main');

  // Selected Food State
  const [selectedFood, setSelectedFood] = useState<FoodItem>(PRESET_FOODS[0]);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>(PRESET_FOODS);

  // User and Meals State
  const [userProfile, setUserProfile] = useState<UserHealthProfile>(INITIAL_USER_PROFILE);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMealItem[]>(INITIAL_LOGGED_MEALS);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState<boolean>(false);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState<boolean>(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handler: When user clicks photo recognition or camera icon
  const handleOpenScanner = () => {
    setIsScannerOpen(true);
  };

  // Handler: When user clicks barcode scan
  const handleOpenBarcode = () => {
    setIsBarcodeOpen(true);
  };

  // Handler: When food is identified (from scanner or barcode)
  const handleFoodRecognized = (food: FoodItem) => {
    setSelectedFood(food);
    setIsScannerOpen(false);
    setIsBarcodeOpen(false);
    // Go to portion estimation screen (Image 13.png)
    setViewState('estimate');

    // Add to recent list if not already there
    setRecentFoods((prev) => [food, ...prev.filter((f) => f.id !== food.id)]);
  };

  // Handler: From estimate screen, confirm to detail screen (Image 1.png / 3.png)
  const handleConfirmEstimate = (adjustedFood: FoodItem) => {
    setSelectedFood(adjustedFood);
    setViewState('detail');
  };

  // Handler: Direct click on recent food card from home
  const handleSelectRecentFood = (food: FoodItem) => {
    setSelectedFood(food);
    setViewState('detail');
  };

  // Handler: Add to daily meal log
  const handleOpenAddMeal = (food: FoodItem) => {
    setSelectedFood(food);
    setIsAddMealOpen(true);
  };

  const handleConfirmAddMeal = (item: LoggedMealItem) => {
    setLoggedMeals((prev) => [item, ...prev]);
    showToast(`已成功记录 "${item.name}" 到今日饮食`);
    setActiveTab('log');
    setViewState('main');
  };

  // Handler: Delete logged meal item
  const handleDeleteMealItem = (id: string) => {
    setLoggedMeals((prev) => prev.filter((item) => item.id !== id));
    showToast('已删除该饮食记录');
  };

  // Handler: Share nutrition summary
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `【${selectedFood.name} 营养分析】热量: ${selectedFood.nutrients.calories} kcal, 蛋白质: ${selectedFood.nutrients.protein}g, 脂肪: ${selectedFood.nutrients.fat}g, 碳水: ${selectedFood.nutrients.carbs}g — 来自 Food Integrated Identification`
      );
      showToast('营养报告已复制到剪贴板');
    } else {
      showToast('已生成分享卡片');
    }
  };

  // Get current header title
  const getHeaderTitle = () => {
    if (viewState === 'estimate') return 'Food Integrated Identification';
    if (viewState === 'detail') return 'Food Integrated Identification';
    if (activeTab === 'log') return '饮食记录';
    if (activeTab === 'profile') return '健康档案';
    return 'Food Integrated Identification';
  };

  return (
    <div className="min-h-screen bg-[#f1f5f3] flex justify-center selection:bg-emerald-200">
      {/* Mobile-Frame Canvas */}
      <main className="w-full max-w-md bg-[#f8faf9] min-h-screen shadow-2xl flex flex-col relative overflow-x-hidden">
        {/* Top Header */}
        <Header
          title={getHeaderTitle()}
          showBack={viewState !== 'main'}
          onBack={() => setViewState('main')}
          showShare={viewState === 'detail'}
          onShare={handleShare}
          showMenu={activeTab === 'log' && viewState === 'main'}
          onMenuClick={() => setActiveTab('profile')}
          userProfile={userProfile}
          onAvatarClick={() => {
            setActiveTab('profile');
            setViewState('main');
          }}
          onNotificationClick={() => setIsNotificationOpen(true)}
          hasUnreadNotification={true}
        />

        {/* View Switcher */}
        <div className="flex-1">
          {viewState === 'estimate' ? (
            <EstimateView
              food={selectedFood}
              onConfirm={handleConfirmEstimate}
              onOpenCorrection={() => setIsCorrectionOpen(true)}
            />
          ) : viewState === 'detail' ? (
            <DetailView
              food={selectedFood}
              userProfile={userProfile}
              onAddToDailyLog={handleOpenAddMeal}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView
                  userProfile={userProfile}
                  loggedMeals={loggedMeals}
                  recentFoods={recentFoods}
                  onOpenPhotoRecognition={handleOpenScanner}
                  onOpenBarcodeScanner={handleOpenBarcode}
                  onSelectFood={handleSelectRecentFood}
                  onViewAllLogs={() => setActiveTab('log')}
                  onQuickLog={handleOpenScanner}
                />
              )}

              {activeTab === 'log' && (
                <DietLogView
                  loggedMeals={loggedMeals}
                  userProfile={userProfile}
                  onDeleteMealItem={handleDeleteMealItem}
                  onOpenScanner={handleOpenScanner}
                  onSelectFoodName={(name) => {
                    const match = recentFoods.find((f) => f.name.includes(name)) || PRESET_FOODS[0];
                    handleSelectRecentFood(match);
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  userProfile={userProfile}
                  onUpdateProfile={(updated) => setUserProfile(updated)}
                  onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Tab Bar (shown when on main tabs) */}
        {viewState === 'main' && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onOpenScanner={handleOpenScanner}
          />
        )}

        {/* Modals & Dialogs */}
        <ScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onRecognized={handleFoodRecognized}
          userProfile={userProfile}
        />

        <BarcodeModal
          isOpen={isBarcodeOpen}
          onClose={() => setIsBarcodeOpen(false)}
          onRecognized={handleFoodRecognized}
        />

        <FoodCorrectionModal
          isOpen={isCorrectionOpen}
          onClose={() => setIsCorrectionOpen(false)}
          onSelectCorrection={(food) => setSelectedFood(food)}
        />

        <AddMealModal
          isOpen={isAddMealOpen}
          onClose={() => setIsAddMealOpen(false)}
          food={selectedFood}
          onConfirmAdd={handleConfirmAddMeal}
        />

        <PrivacyModal
          isOpen={isPrivacyOpen}
          onAccept={() => {
            setUserProfile((prev) => ({ ...prev, privacyAccepted: true }));
            setIsPrivacyOpen(false);
            showToast('已同意健康隐私协议');
          }}
          onDecline={() => setIsPrivacyOpen(false)}
        />

        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        {/* Toast feedback */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
