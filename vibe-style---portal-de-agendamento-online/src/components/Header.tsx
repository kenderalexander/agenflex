import React from 'react';
import { Tenant } from '../types/index.ts';
import { Scissors } from 'lucide-react';

interface HeaderProps {
  tenant: Tenant;
}

export const Header: React.FC<HeaderProps> = ({ tenant }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#222F46]/60 transition-all">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Clean Brand Title */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-purple-900/30">
            <Scissors className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
            Vibe Style <span className="text-purple-400 font-semibold">• Agendamento Online</span>
          </span>
        </div>

        <div className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          Horários Abertos
        </div>
      </div>
    </header>
  );
};
