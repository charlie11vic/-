import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-5 animate-fadeIn"
    >
      <div
        id="privacy-modal-content"
        className="bg-white rounded-3xl p-6 max-w-xs sm:max-w-sm w-full text-center space-y-5 shadow-2xl animate-scaleUp"
      >
        {/* Shield Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-emerald-600 flex items-center justify-center">
          <div className="relative">
            <ShieldCheck className="w-9 h-9 text-emerald-600" />
            <Lock className="w-4 h-4 text-emerald-700 absolute bottom-0 right-0 bg-white rounded-full p-0.5" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          隐私保护说明
        </h3>

        {/* Description Text */}
        <p className="text-sm text-slate-600 leading-relaxed text-left sm:text-center px-1">
          我们需要收集您的健康信息以提供个性化建议，这些信息将被加密存储，仅用于生成饮食建议，您可以随时删除。
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            id="btn-privacy-accept"
            onClick={onAccept}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#f95726] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            同意并继续
          </button>
          <button
            id="btn-privacy-decline"
            onClick={onDecline}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            暂不
          </button>
        </div>
      </div>
    </div>
  );
};
