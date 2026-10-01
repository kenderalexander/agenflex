import React, { useState } from 'react';
import { Service, Specialist, Tenant } from '../types/index.ts';
import { formatCurrency, formatDatePtBR, formatPhoneMask } from '../utils/storage.ts';
import { 
  User, 
  Phone, 
  MessageSquare, 
  Check, 
  Copy, 
  ShieldCheck
} from 'lucide-react';

interface StepClientDataProps {
  tenant: Tenant;
  service: Service;
  specialist: Specialist;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  paymentMethod: 'presencial' | 'pix_online';
  onChangeClientName: (val: string) => void;
  onChangeClientPhone: (val: string) => void;
  onChangeClientNotes: (val: string) => void;
  onChangePaymentMethod: (val: 'presencial' | 'pix_online') => void;
  onSubmitBooking: () => void;
  isSubmitting: boolean;
}

export const StepClientData: React.FC<StepClientDataProps> = ({
  tenant,
  service,
  specialist,
  date,
  time,
  clientName,
  clientPhone,
  clientNotes,
  paymentMethod,
  onChangeClientName,
  onChangeClientPhone,
  onChangeClientNotes,
  onChangePaymentMethod,
  onSubmitBooking,
  isSubmitting
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneMask(e.target.value);
    onChangeClientPhone(formatted);
  };

  const copyPixKey = () => {
    if (tenant.pixKey) {
      navigator.clipboard?.writeText(tenant.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Título da Seção em Caixa Alta */}
      <div className="pt-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
          DADOS PARA CONTATO
        </h2>
        <p className="text-[11px] text-[#8E8E93] mt-0.5">
          Preencha suas informações para confirmar a vaga
        </p>
      </div>

      {/* Resumo da Reserva - Card #141416 com borda #222226 e rounded-[16px] */}
      <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#222226] pb-2.5 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
            RESUMO DO AGENDAMENTO
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF] bg-[#1A1A1E] border border-[#222226] px-2 py-0.5 rounded-md">
            {tenant.name}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93]">Serviço:</span>
            <strong className="text-[#FFFFFF] text-right font-medium">{service.name} ({service.duration}m)</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93]">Profissional:</span>
            <strong className="text-[#FFFFFF] text-right font-medium">{specialist.name}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8E93]">Data & Hora:</span>
            <strong className="text-[#FFFFFF] text-right font-bold">
              {formatDatePtBR(date)} às {time}
            </strong>
          </div>

          <div className="border-t border-[#222226] pt-2.5 mt-1 flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-[#8E8E93]">Valor Total:</span>
            <span className="text-base font-black text-[#FFFFFF]">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário - 100% Width Mobile */}
      <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-4 space-y-3.5">
        {/* Nome do Cliente */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mb-1">
            Nome Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              value={clientName}
              onChange={(e) => onChangeClientName(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full bg-[#1A1A1E] border border-[#222226] focus:border-[#3A4D6F] text-[#FFFFFF] placeholder-[#8E8E93] pl-10 pr-3 py-2.5 rounded-xl text-xs font-medium outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* WhatsApp do Cliente */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mb-1">
            WhatsApp com DDD *
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <input
              type="tel"
              value={clientPhone}
              onChange={handlePhoneChange}
              placeholder="(11) 98888-7777"
              maxLength={15}
              className="w-full bg-[#1A1A1E] border border-[#222226] focus:border-[#3A4D6F] text-[#FFFFFF] placeholder-[#8E8E93] pl-10 pr-3 py-2.5 rounded-xl text-xs font-mono font-medium outline-none transition-all"
              required
            />
          </div>
          <p className="text-[10px] text-[#8E8E93] mt-1">
            O lembrete da vaga será enviado via WhatsApp.
          </p>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mb-1">
            Observações (Opcional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-[#8E8E93]" />
            <textarea
              value={clientNotes}
              onChange={(e) => onChangeClientNotes(e.target.value)}
              placeholder="Alguma preferência ou detalhe específico?"
              rows={2}
              className="w-full bg-[#1A1A1E] border border-[#222226] focus:border-[#3A4D6F] text-[#FFFFFF] placeholder-[#8E8E93] pl-10 pr-3 py-2 rounded-xl text-xs font-medium outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Forma de Pagamento */}
      <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-4 space-y-2.5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
          Forma de Pagamento
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {/* Pagamento Presencial */}
          <div
            onClick={() => onChangePaymentMethod('presencial')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
              paymentMethod === 'presencial'
                ? 'border-[#3A4D6F] bg-[#1A1A1E] ring-1 ring-[#3A4D6F]'
                : 'border-[#222226] bg-[#141416] hover:border-[#3A4D6F]/60'
            }`}
          >
            <div className="mt-0.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'presencial' ? 'border-[#3A4D6F] bg-[#3A4D6F]' : 'border-[#222226]'
                }`}
              >
                {paymentMethod === 'presencial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#FFFFFF]">Pagar Presencialmente</div>
              <div className="text-[10px] text-[#8E8E93] mt-0.5">
                No balcão após o atendimento (Pix, Cartão ou Dinheiro).
              </div>
            </div>
          </div>

          {/* Pix Antecipado */}
          <div
            onClick={() => onChangePaymentMethod('pix_online')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
              paymentMethod === 'pix_online'
                ? 'border-[#3A4D6F] bg-[#1A1A1E] ring-1 ring-[#3A4D6F]'
                : 'border-[#222226] bg-[#141416] hover:border-[#3A4D6F]/60'
            }`}
          >
            <div className="mt-0.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'pix_online' ? 'border-[#3A4D6F] bg-[#3A4D6F]' : 'border-[#222226]'
                }`}
              >
                {paymentMethod === 'pix_online' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#FFFFFF]">Chave Pix do Estabelecimento</div>
              <div className="text-[10px] text-[#8E8E93] mt-0.5">
                Transfira direto para a chave Pix oficial do salão.
              </div>
            </div>
          </div>
        </div>

        {paymentMethod === 'pix_online' && tenant.pixKey && (
          <div className="mt-2 p-2.5 bg-[#1A1A1E] rounded-xl border border-[#222226] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider block">Chave Pix:</span>
              <span className="text-xs font-mono font-bold text-white truncate block">{tenant.pixKey}</span>
            </div>
            <button
              type="button"
              onClick={copyPixKey}
              className="px-2.5 py-1 rounded-lg bg-[#3A4D6F] hover:bg-[#4A5D80] text-white text-[11px] font-bold flex items-center gap-1 flex-shrink-0 transition-colors"
            >
              {copiedPix ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Reassurance Footer */}
      <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] px-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#3A4D6F] flex-shrink-0" />
        <span>Seus dados são confidenciais e protegidos.</span>
      </div>
    </div>
  );
};
