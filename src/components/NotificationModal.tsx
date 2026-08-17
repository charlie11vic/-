import React from 'react';
import { X, Bell, Flame, Droplets, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      type: 'nutrition',
      title: '今日钠摄入提醒',
      time: '12:35',
      desc: '您午餐记录的宫保鸡丁含钠量较高，建议晚餐以清蒸或水煮蔬菜为主，多饮水促进代谢。',
      icon: Flame,
      color: 'text-orange-500 bg-orange-50',
    },
    {
      id: '2',
      type: 'water',
      title: '健康饮水打卡',
      time: '10:00',
      desc: '今日已完成饮水 1200ml / 2000ml，记得下午也要保持水分充足哦！',
      icon: Droplets,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      id: '3',
      type: 'diet',
      title: '减脂塑形目标进展',
      time: '昨天',
      desc: '连续3天蛋白质与热量缺口控制在极佳区间，继续保持！',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div
      id="notification-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        id="notification-modal-content"
        className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-scaleUp"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            消息与健康提醒
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${n.color} flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 pl-8 leading-relaxed">{n.desc}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
        >
          知道了
        </button>
      </div>
    </div>
  );
};
