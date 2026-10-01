import React from 'react';
import { Appointment, Tenant } from '../types/index.ts';
import { formatCurrency, formatDatePtBR, generateWhatsAppLink } from '../utils/storage.ts';
import { Calendar, X, MessageCircle, Clock, MapPin, Scissors, User, Trash2 } from 'lucide-react';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  tenants: Record<string, Tenant>;
  onCancelAppointment: (id: string) => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  tenants,
  onCancelAppointment
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#141416] border border-[#222226] rounded-t-[20px] sm:rounded-[20px] max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#222226] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3A4D6F] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">Minhas Reservas</h2>
              <p className="text-[10px] text-[#8E8E93]">Histórico de agendamentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E93] hover:text-white hover:bg-[#1A1A1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of appointments */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-[#8E8E93] mx-auto mb-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Nenhum agendamento ativo</h3>
              <p className="text-[11px] text-[#8E8E93] mt-0.5">
                Faça sua primeira reserva no catálogo do estabelecimento.
              </p>
            </div>
          ) : (
            appointments.map((appt) => {
              const tenant = tenants[appt.tenantSlug] || {
                name: appt.tenantName,
                phone: '(11) 97777-8888',
                address: 'São Paulo - SP'
              };

              const isCancelled = appt.status === 'cancelado';

              const whatsappUrl = generateWhatsAppLink(tenant.phone, {
                serviceName: appt.serviceName,
                date: appt.date,
                time: appt.time,
                specialistName: appt.specialistName,
                tenantName: tenant.name,
                clientName: appt.clientName,
                price: appt.price
              });

              return (
                <div
                  key={appt.id}
                  className={`p-3.5 rounded-[16px] border transition-all ${
                    isCancelled
                      ? 'bg-[#141416]/50 border-[#222226] opacity-60'
                      : 'bg-[#1A1A1E] border-[#222226]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#222226]">
                    <div>
                      <span className="text-xs font-bold text-white block">{appt.tenantName}</span>
                      <span className="text-[10px] font-mono text-[#8E8E93]">{appt.id}</span>
                    </div>

                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCancelled
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-[#3A4D6F] text-white'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E8E93] flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-[#8E8E93]" /> {appt.serviceName}
                      </span>
                      <strong className="text-white">{formatCurrency(appt.price)}</strong>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8E8E93] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8E8E93]" /> {formatDatePtBR(appt.date)} às {appt.time}
                      </span>
                      <span className="text-[#A1A1AA] flex items-center gap-1">
                        <User className="w-3 h-3 text-[#8E8E93]" /> {appt.specialistName}
                      </span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#222226]">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-[#3A4D6F] hover:bg-[#4A5D80] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={() => onCancelAppointment(appt.id)}
                        className="py-2 px-2.5 rounded-xl bg-[#141416] hover:bg-rose-950/40 text-[#8E8E93] hover:text-rose-400 border border-[#222226] text-[11px] font-bold transition-colors flex items-center justify-center"
                        title="Cancelar Reserva"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
