import React from 'react';
import { Home, Calendar, Scan, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenScanner,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 max-w-md mx-auto px-4 py-2"
    >
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          id="nav-tab-home"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'home'
              ? 'text-emerald-700 font-medium'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'home' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-xs mt-0.5">首页</span>
        </button>

        {/* Record / History */}
        <button
          id="nav-tab-log"
          onClick={() => onTabChange('log')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'log'
              ? 'text-orange-600 font-medium'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'log' ? 'bg-orange-400 text-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs mt-0.5">记录</span>
        </button>

        {/* Recognize Quick Trigger */}
        <button
          id="nav-tab-recognize"
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100">
            <Scan className="w-5 h-5" />
          </div>
          <span className="text-xs mt-0.5">识别</span>
        </button>

        {/* Health Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'profile'
              ? 'text-emerald-700 font-medium'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs mt-0.5">健康档案</span>
        </button>
      </div>
    </nav>
  );
};
