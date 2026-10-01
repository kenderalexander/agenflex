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
  RotateCcw, 
  MapPin, 
  Clock, 
  User, 
  Scissors 
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
  onReset
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
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
    <div className="space-y-4 animate-in zoom-in-95 duration-200 w-full pb-6">
      {/* Cabeçalho de Sucesso */}
      <div className="text-center pt-2">
        <div className="w-14 h-14 bg-[#3A4D6F] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-[#FFFFFF]">
          AGENDAMENTO CONFIRMADO!
        </h2>
        <p className="text-[11px] text-[#8E8E93] mt-0.5">
          Horário reservado com sucesso no <strong className="text-white">{tenant.name}</strong>.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-[#141416] border border-[#222226] px-3 py-1 rounded-full text-[11px] font-mono text-[#FFFFFF]">
          <span className="text-[#8E8E93]">Código:</span>
          <span className="font-bold">{appointment.id}</span>
        </div>
      </div>

      {/* Cartão do Voucher / Resumo */}
      <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#222226] pb-2.5">
          <div>
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider block">Estabelecimento</span>
            <span className="text-xs font-bold text-white">{tenant.name}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider block">Status</span>
            <span className="text-[10px] font-bold uppercase text-[#FFFFFF] bg-[#3A4D6F] px-2 py-0.5 rounded-md inline-block">
              Confirmado
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8E8E93]" /> Cliente:
            </span>
            <strong className="text-white font-medium">{appointment.clientName} ({appointment.clientPhone})</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#8E8E93]" /> Serviço:
            </span>
            <strong className="text-white font-medium">{appointment.serviceName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8E8E93]" /> Profissional:
            </span>
            <strong className="text-white font-medium">{appointment.specialistName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8E8E93]" /> Data & Hora:
            </span>
            <strong className="text-white font-bold">{formatDatePtBR(appointment.date)} às {appointment.time}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8E8E93]" /> Local:
            </span>
            <span className="text-[#A1A1AA] text-xs text-right truncate max-w-[180px]">{tenant.address.split('-')[0]}</span>
          </div>

          <div className="border-t border-[#222226] pt-2.5 flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-[#8E8E93]">Valor Total:</span>
            <span className="text-base font-black text-white">{formatCurrency(appointment.price)}</span>
          </div>
        </div>
      </div>

      {/* Ação Primária: WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 px-4 rounded-[16px] bg-[#3A4D6F] hover:bg-[#4A5D80] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all text-center"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>Abrir Comprovante no WhatsApp</span>
      </a>

      {/* Ação Secundária: Google Agenda */}
      <a
        href={googleCalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 rounded-[16px] bg-[#141416] hover:bg-[#1A1A1E] border border-[#222226] text-[#FFFFFF] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors text-center"
      >
        <Calendar className="w-4 h-4 text-[#8E8E93]" />
        <span>Salvar no Google Agenda</span>
      </a>

      {/* Novo Agendamento */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#8E8E93] hover:text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Fazer Novo Agendamento</span>
        </button>
      </div>
    </div>
  );
};
