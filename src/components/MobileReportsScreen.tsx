import React from 'react';
import { Appointment, Tenant } from '../types/index.ts';
import { formatCurrency } from '../utils/storage.ts';
import { TrendingUp, DollarSign, Users, Calendar, CheckCircle2 } from 'lucide-react';

interface MobileReportsScreenProps {
  appointments: Appointment[];
  tenant: Tenant;
}

export const MobileReportsScreen: React.FC<MobileReportsScreenProps> = ({
  appointments,
  tenant
}) => {
  const activeAppointments = appointments.filter(a => a.status !== 'cancelado');
  const totalRevenue = activeAppointments.reduce((acc, a) => acc + a.price, 0);
  const completedCount = appointments.filter(a => a.status === 'concluido').length;

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200 pb-20">
      <span className="text-[11px] font-extrabold uppercase text-[#717888] tracking-wider block px-1">
        Métricas e Faturamento
      </span>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#13151B] border border-[#222630] rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-[#8E95A5] mb-1">
            <span className="text-xs font-bold">Faturamento</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-white">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">Sincronizado</span>
        </div>

        <div className="bg-[#13151B] border border-[#222630] rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-[#8E95A5] mb-1">
            <span className="text-xs font-bold">Reservas</span>
            <Calendar className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-lg font-black text-white">
            {activeAppointments.length}
          </div>
          <span className="text-[10px] text-[#8E95A5] mt-0.5 block">Total no período</span>
        </div>

        <div className="bg-[#13151B] border border-[#222630] rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-[#8E95A5] mb-1">
            <span className="text-xs font-bold">Concluídos</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-black text-white">
            {completedCount}
          </div>
          <span className="text-[10px] text-[#8E95A5] mt-0.5 block">Atendimentos</span>
        </div>

        <div className="bg-[#13151B] border border-[#222630] rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-[#8E95A5] mb-1">
            <span className="text-xs font-bold">Serviços</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-black text-white">
            {tenant.services.length}
          </div>
          <span className="text-[10px] text-[#8E95A5] mt-0.5 block">{tenant.specialists.length} profissionais</span>
        </div>
      </div>
    </div>
  );
};
