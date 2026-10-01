import React from 'react';
import { Appointment, Tenant } from '../types/index.ts';
import { formatCurrency, formatDatePtBR, generateWhatsAppLink } from '../utils/storage.ts';
import { Calendar, X, MessageCircle, Clock, MapPin, Scissors, User, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#151D2F] border border-[#222F46] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222F46] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Minha Agenda de Serviços</h2>
              <p className="text-xs text-slate-400">Histórico de reservas e confirmações</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222F46] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of appointments */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {appointments.length === 0 ? (
            <div className="text-center py-10">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-300">Nenhum agendamento ativo</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Escolha um serviço no catálogo do salão e faça sua primeira reserva online.
              </p>
            </div>
          ) : (
            appointments.map((appt) => {
              const tenant = tenants[appt.tenantSlug] || {
                name: appt.tenantName,
                phone: '(11) 97777-8888',
                address: 'São Paulo - SP'
              };

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
                  className="bg-[#0B0F19] border border-[#222F46] rounded-2xl p-4 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold block">{appt.id}</span>
                      <h4 className="text-sm font-black text-white">{tenant.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
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

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-purple-400" /> Procedimento:
                      </span>
                      <strong className="text-white">{appt.serviceName}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" /> Profissional:
                      </span>
                      <strong className="text-white">{appt.specialistName}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> Data e Horário:
                      </span>
                      <strong className="text-emerald-400 font-bold">{formatDatePtBR(appt.date)} às {appt.time}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Valor Total:</span>
                      <strong className="text-sm font-black text-emerald-400">{formatCurrency(appt.price)}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp do Salão</span>
                    </a>

                    {appt.status !== 'cancelado' && (
                      <button
                        onClick={() => onCancelAppointment(appt.id)}
                        className="py-2 px-3 bg-rose-950/20 hover:bg-rose-950/50 text-rose-300 border border-rose-800/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancelar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
