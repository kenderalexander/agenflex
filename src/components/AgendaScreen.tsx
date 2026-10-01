import React, { useState } from 'react';
import { Appointment, Tenant, AppointmentStatus } from '../types/index.ts';
import { formatDatePtBR, formatCurrency } from '../utils/storage.ts';
import { Calendar, Clock, User, Scissors, MessageCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface AgendaScreenProps {
  tenant: Tenant;
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  tenant,
  appointments,
  onUpdateStatus
}) => {
  const [filter, setFilter] = useState<string>('todos');

  const tenantAppointments = appointments.filter(a => a.tenantSlug === tenant.slug || !a.tenantSlug);
  const filtered = tenantAppointments.filter(a => {
    if (filter === 'todos') return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-4 animate-in fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Agenda de Atendimentos</h1>
        <p className="text-xs text-[#A1A1AA] mt-0.5">
          Sincronizado em tempo real com o banco de dados
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {['todos', 'confirmado', 'em_atendimento', 'concluido', 'cancelado'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
              filter === st
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-[#121215] text-[#71717A] hover:text-white border border-[#222226]'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#121215] border border-[#222226] rounded-2xl p-8 text-center">
            <Calendar className="w-10 h-10 text-[#3F3F46] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">Nenhum atendimento encontrado</h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              Novos agendamentos feitos pelos clientes aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          filtered.map((appt) => {
            const cleanPhone = appt.clientPhone.replace(/\D/g, '');
            const msg = encodeURIComponent(`Olá ${appt.clientName}! Aqui é do ${tenant.name}. Estamos confirmando seu agendamento de ${appt.serviceName} no dia ${formatDatePtBR(appt.date)} às ${appt.time}.`);

            return (
              <div
                key={appt.id}
                className="bg-[#121215] border border-[#222226] rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-[#1F1F23] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                      {appt.id}
                    </span>
                    <span className="text-xs text-white font-bold">{appt.time}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      appt.status === 'confirmado'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : appt.status === 'em_atendimento'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : appt.status === 'concluido'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {appt.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm">{appt.clientName}</span>
                    <strong className="text-emerald-400">{formatCurrency(appt.price)}</strong>
                  </div>
                  <p className="text-[#A1A1AA] flex items-center gap-1">
                    <Scissors className="w-3 h-3 text-blue-400" />
                    <span>{appt.serviceName} ({appt.duration} min)</span>
                  </p>
                  <p className="text-[#71717A] flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Profissional: {appt.specialistName}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#1F1F23]">
                  <a
                    href={`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${msg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#222226] hover:bg-[#2A2A2E] text-emerald-400 border border-[#2E2E33] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <select
                    value={appt.status}
                    onChange={(e) => onUpdateStatus(appt.id, e.target.value as AppointmentStatus)}
                    className="bg-[#09090B] border border-[#27272A] text-xs text-white font-bold px-2.5 py-2 rounded-xl outline-none"
                  >
                    <option value="confirmado">Confirmado</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
