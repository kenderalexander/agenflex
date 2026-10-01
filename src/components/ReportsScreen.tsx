import React from 'react';
import { Appointment, Tenant } from '../types/index.ts';
import { formatCurrency } from '../utils/storage.ts';
import { BarChart3, TrendingUp, DollarSign, Calendar, Flame, CheckCircle2 } from 'lucide-react';

interface ReportsScreenProps {
  tenant: Tenant;
  appointments: Appointment[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  tenant,
  appointments
}) => {
  const activeAppts = appointments.filter(a => a.status !== 'cancelado');
  const totalRevenue = activeAppts.reduce((sum, a) => sum + (a.price || 0), 0);
  const completedCount = appointments.filter(a => a.status === 'concluido').length;

  // Group by service
  const serviceCountMap: Record<string, { name: string; count: number; total: number }> = {};
  activeAppts.forEach(a => {
    if (!serviceCountMap[a.serviceName]) {
      serviceCountMap[a.serviceName] = { name: a.serviceName, count: 0, total: 0 };
    }
    serviceCountMap[a.serviceName].count += 1;
    serviceCountMap[a.serviceName].total += a.price || 0;
  });

  const topServices = Object.values(serviceCountMap).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4 animate-in fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Relatórios & Métricas</h1>
        <p className="text-xs text-[#A1A1AA] mt-0.5">
          Desempenho operacional e financeiro do estabelecimento
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121215] border border-[#222226] p-4 rounded-2xl shadow-md">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-bold">Faturamento</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg sm:text-xl font-black text-emerald-400">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[10px] text-[#71717A] block mt-0.5">Em reservas ativas</span>
        </div>

        <div className="bg-[#121215] border border-[#222226] p-4 rounded-2xl shadow-md">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-bold">Total Reservas</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-lg sm:text-xl font-black text-white">
            {activeAppts.length}
          </span>
          <span className="text-[10px] text-[#71717A] block mt-0.5">{completedCount} concluídos</span>
        </div>
      </div>

      {/* Top Services Ranking */}
      <div className="bg-[#121215] border border-[#222226] rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Serviços Mais Agendados
          </h3>
        </div>

        {topServices.length === 0 ? (
          <p className="text-xs text-[#71717A] py-3 text-center">Nenhum atendimento registrado ainda.</p>
        ) : (
          <div className="space-y-2.5">
            {topServices.slice(0, 5).map((s, idx) => {
              const pct = Math.round((s.count / activeAppts.length) * 100) || 0;
              return (
                <div key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[200px]">
                      {idx + 1}. {s.name}
                    </span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(s.total)} ({s.count}x)</span>
                  </div>
                  <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
