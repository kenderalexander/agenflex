import React, { useState } from 'react';
import { Appointment, Tenant } from '../types/index.ts';
import { formatCurrency, formatDatePtBR, generateWhatsAppLink } from '../utils/storage.ts';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Scissors, 
  User, 
  MessageCircle, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface MobileAgendaScreenProps {
  appointments: Appointment[];
  tenant: Tenant;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onNewBookingClick: () => void;
}

export const MobileAgendaScreen: React.FC<MobileAgendaScreenProps> = ({
  appointments,
  tenant,
  onUpdateStatus,
  onNewBookingClick
}) => {
  const [filter, setFilter] = useState<'todos' | 'hoje' | 'confirmado' | 'concluido'>('todos');

  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = appointments.filter(a => {
    if (filter === 'hoje') return a.date === todayStr;
    if (filter === 'confirmado') return a.status === 'confirmado';
    if (filter === 'concluido') return a.status === 'concluido';
    return true;
  });

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200 pb-20">
      {/* Header & Filter Tabs */}
      <div>
        <span className="text-[11px] font-extrabold uppercase text-[#717888] tracking-wider block mb-2 px-1">
          Agenda em Tempo Real
        </span>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'hoje', label: 'Hoje' },
            { id: 'confirmado', label: 'Confirmados' },
            { id: 'concluido', label: 'Concluídos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-950/40'
                  : 'bg-[#13151B] text-[#8E95A5] hover:text-white border border-[#222630]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-[#13151B] border border-[#222630] rounded-2xl p-6 text-center space-y-2">
            <CalendarIcon className="w-8 h-8 text-[#717888] mx-auto" />
            <h3 className="text-sm font-bold text-white">Nenhum atendimento na lista</h3>
            <p className="text-xs text-[#8E95A5]">
              Novos agendamentos feitos no portal ou via Supabase aparecem aqui automaticamente.
            </p>
            <button
              onClick={onNewBookingClick}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
            >
              Agendar Novo Horário
            </button>
          </div>
        ) : (
          filtered.map(appt => {
            const cleanPhone = appt.clientPhone.replace(/\D/g, '');
            const whatsappMsg = encodeURIComponent(`Olá ${appt.clientName}! Confirmamos seu atendimento no ${tenant.name} para ${formatDatePtBR(appt.date)} às ${appt.time} (${appt.serviceName}).`);

            return (
              <div
                key={appt.id}
                className="bg-[#13151B] border border-[#222630] rounded-2xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-[#1D212B] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#60A5FA] font-bold">
                      {appt.id}
                    </span>
                    <span className="text-[10px] text-[#717888]">•</span>
                    <span className="text-xs font-bold text-white">
                      {formatDatePtBR(appt.date).split(',')[0]} às {appt.time}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
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
                    <span className="text-[#8E95A5]">{appt.clientName}</span>
                    <strong className="text-white">{formatCurrency(appt.price)}</strong>
                  </div>
                  <div className="text-[11px] text-[#8E95A5] flex items-center gap-2">
                    <span>✂️ {appt.serviceName}</span>
                    <span>•</span>
                    <span>👤 {appt.specialistName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#1D212B]">
                  <a
                    href={`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#1E293B] text-[#25D366] text-[11px] font-bold flex items-center gap-1 border border-[#222630]"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  <select
                    value={appt.status}
                    onChange={(e) => onUpdateStatus(appt.id, e.target.value as any)}
                    className="bg-[#090A0D] border border-[#222630] text-[11px] text-[#CBD5E1] font-bold px-2 py-1 rounded-lg outline-none"
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
