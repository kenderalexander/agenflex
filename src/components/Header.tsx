import React from 'react';
import { Tenant } from '../types/index.ts';
import { Scissors } from 'lucide-react';

interface HeaderProps {
  tenant: Tenant;
}

export const Header: React.FC<HeaderProps> = ({ tenant }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-[#222226]">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#3A4D6F] flex items-center justify-center text-white shadow-sm">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] block leading-tight">
              {tenant.name}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wide text-[#8E8E93]">
              Portal de Agendamento
            </span>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFFFFF] bg-[#141416] border border-[#222226] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="uppercase tracking-wider text-[9px] text-[#A1A1AA]">Aberto</span>
        </div>
      </div>
    </header>
  );
};
