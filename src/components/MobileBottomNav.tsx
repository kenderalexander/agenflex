import React from 'react';
import { LayoutGrid, Calendar, Users, BarChart3, SlidersHorizontal } from 'lucide-react';

export type MobileTab = 'inicio' | 'agenda' | 'clientes' | 'relatorios' | 'ajustes';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  agendaBadgeCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  agendaBadgeCount = 0
}) => {
  const tabs = [
    { id: 'inicio' as MobileTab, label: 'Início', icon: LayoutGrid },
    { id: 'agenda' as MobileTab, label: 'Agenda', icon: Calendar, badge: agendaBadgeCount },
    { id: 'clientes' as MobileTab, label: 'Clientes', icon: Users },
    { id: 'relatorios' as MobileTab, label: 'Relatórios', icon: BarChart3 },
    { id: 'ajustes' as MobileTab, label: 'Ajustes', icon: SlidersHorizontal }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0C] border-t border-[#1C1C20] py-2 px-3 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center relative min-w-[56px] transition-transform active:scale-95"
            >
              {/* Active Tab Capsule Pill from the Image */}
              {isActive ? (
                <div className="px-3.5 py-1 rounded-full bg-[#2A354A] flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="p-1 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#71717A] hover:text-slate-300 transition-colors" />
                </div>
              )}

              {/* Label */}
              <span
                className={`text-[10px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-[#71717A]'
                }`}
              >
                {tab.label}
              </span>

              {/* Notification Badge */}
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-0.5 right-2 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {/* Home Indicator Bar */}
      <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-0.5"></div>
    </nav>
  );
};
