import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Appointment, Tenant } from '../types/index.ts';
import { 
  formatCurrency, 
  formatDatePtBR, 
  generateWhatsAppLink, 
  generateGoogleCalendarLink 
} from '../utils/storage.ts';
import { 
  CheckCircle2, 
  MessageCircle, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  MapPin, 
  Clock, 
  User, 
  Scissors,
  Download
} from 'lucide-react';

interface StepSuccessProps {
  appointment: Appointment;
  tenant: Tenant;
  onReset: () => void;
  onOpenMyAppointments: () => void;
}

export const StepSuccess: React.FC<StepSuccessProps> = ({
  appointment,
  tenant,
  onReset,
  onOpenMyAppointments
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const whatsappUrl = generateWhatsAppLink(tenant.phone, {
    serviceName: appointment.serviceName,
    date: appointment.date,
    time: appointment.time,
    specialistName: appointment.specialistName,
    tenantName: tenant.name,
    clientName: appointment.clientName,
    price: appointment.price
  });

  const googleCalUrl = generateGoogleCalendarLink({
    serviceName: appointment.serviceName,
    date: appointment.date,
    time: appointment.time,
    tenantName: tenant.name,
    tenantAddress: tenant.address,
    duration: appointment.duration
  });

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 max-w-lg mx-auto pb-6">
      {/* Big Animated Success Badge */}
      <div className="text-center pt-2">
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-900/50">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1.5 border-2 border-[#0B0F19]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Agendamento Confirmado!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md mx-auto">
          Seu horário foi reservado com sucesso no sistema do <strong className="text-white">{tenant.name}</strong>.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-[#151D2F] border border-[#222F46] px-3 py-1 rounded-full text-xs font-mono font-bold text-purple-300">
          <span>Código da Reserva:</span>
          <span className="text-emerald-400 font-extrabold">{appointment.id}</span>
        </div>
      </div>

      {/* Booking Receipt Card */}
      <div className="bg-[#151D2F] border border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#222F46] pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estabelecimento</span>
            <span className="text-sm font-extrabold text-white">{tenant.name}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md inline-block">
              Confirmado ✓
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" /> Cliente:
            </span>
            <strong className="text-white">{appointment.clientName} ({appointment.clientPhone})</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-purple-400" /> Serviço:
            </span>
            <strong className="text-white">{appointment.serviceName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" /> Profissional:
            </span>
            <strong className="text-white">{appointment.specialistName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Data:
            </span>
            <strong className="text-emerald-400 font-bold">{formatDatePtBR(appointment.date)}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Horário:
            </span>
            <strong className="text-emerald-400 font-bold">{appointment.time} ({appointment.duration} min)</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Endereço:
            </span>
            <span className="text-slate-300 text-xs text-right truncate max-w-[200px]">{tenant.address}</span>
          </div>

          <div className="border-t border-[#222F46] pt-3 flex items-center justify-between">
            <span className="font-extrabold text-white text-sm">Valor Total:</span>
            <span className="text-lg font-black text-emerald-400">{formatCurrency(appointment.price)}</span>
          </div>
        </div>
      </div>

      {/* Primary Action: Direct WhatsApp Conversation */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-green-950/40 transition-all hover:scale-[1.02] text-center"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span>Abrir Confirmação no WhatsApp</span>
      </a>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google Calendar Link */}
        <a
          href={googleCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-xl bg-[#151D2F] hover:bg-[#1b253b] border border-[#222F46] text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors text-center"
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Salvar no Google Agenda</span>
        </a>

        {/* View All Appointments */}
        <button
          onClick={onOpenMyAppointments}
          className="py-3 px-4 rounded-xl bg-[#151D2F] hover:bg-[#1b253b] border border-[#222F46] text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ver Minha Agenda</span>
        </button>
      </div>

      {/* Reset & Book Again Button */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Fazer um Novo Agendamento</span>
        </button>
      </div>
    </div>
  );
};
