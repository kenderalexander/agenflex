import React from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Scissors, 
  BarChart2, 
  SlidersHorizontal 
} from 'lucide-react';

export type TabType = 'inicio' | 'agenda' | 'servicos' | 'relatorios' | 'ajustes';

interface BottomTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  appointmentCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  appointmentCount = 0
}) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Início', icon: LayoutGrid },
    { id: 'agenda' as TabType, label: 'Agenda', icon: Calendar, badge: appointmentCount },
    { id: 'servicos' as TabType, label: 'Agendar', icon: Scissors },
    { id: 'relatorios' as TabType, label: 'Relatórios', icon: BarChart2 },
    { id: 'ajustes' as TabType, label: 'Ajustes', icon: SlidersHorizontal }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div className="w-full max-w-md bg-[#090A0D]/95 backdrop-blur-xl border-t border-[#1D212B] px-3 pt-2 pb-5 pointer-events-auto">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 transition-all py-1 px-2.5 rounded-xl cursor-pointer ${
                  isActive
                    ? 'bg-[#1E2536] text-white'
                    : 'text-[#8E95A5] hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#60A5FA]' : 'text-[#8E95A5]'}`} />
                  {tab.badge && tab.badge > 0 && !isActive ? (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#2563EB] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-[#717888]'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Home gesture indicator bar for native mobile feel */}
        <div className="w-32 h-1 bg-[#323847] rounded-full mx-auto mt-2.5" />
      </div>
    </div>
  );
};
