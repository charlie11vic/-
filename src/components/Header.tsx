import React from 'react';
import { ArrowLeft, Bell, Share2, Menu, UserCheck } from 'lucide-react';
import { UserHealthProfile } from '../types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showShare?: boolean;
  onShare?: () => void;
  userProfile?: UserHealthProfile;
  onAvatarClick?: () => void;
  onNotificationClick?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  hasUnreadNotification?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Food Integrated Identification',
  showBack = false,
  onBack,
  showShare = false,
  onShare,
  userProfile,
  onAvatarClick,
  onNotificationClick,
  showMenu = false,
  onMenuClick,
  hasUnreadNotification = true,
}) => {
  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-30 bg-[#f8faf9]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100/60"
    >
      {/* Left Slot */}
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            id="header-back-button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="返回"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </button>
        ) : showMenu ? (
          <button
            id="header-menu-button"
            onClick={onMenuClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-emerald-800 hover:bg-slate-200/60 transition-colors"
            title="菜单"
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : userProfile ? (
          <button
            id="header-avatar-button"
            onClick={onAvatarClick}
            className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500/30 hover:ring-2 hover:ring-emerald-400 transition-all"
            title="个人健康档案"
          >
            <img
              src={userProfile.avatarUrl}
              alt="用户头像"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <h1
          id="header-title-text"
          className="text-base font-semibold text-emerald-800 tracking-tight"
        >
          {title}
        </h1>
      </div>

      {/* Right Slot */}
      <div className="flex items-center gap-2">
        {showShare && (
          <button
            id="header-share-button"
            onClick={onShare}
            className="w-9 h-9 rounded-full flex items-center justify-center text-emerald-800 hover:bg-slate-200/60 transition-colors"
            title="分享营养报告"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}

        {!showShare && (
          <button
            id="header-notification-button"
            onClick={onNotificationClick}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="消息提醒"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {hasUnreadNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white animate-pulse" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
