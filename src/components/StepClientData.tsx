import React, { useState } from 'react';
import { Service, Specialist, Tenant } from '../types/index.ts';
import { formatCurrency, formatDatePtBR, formatPhoneMask } from '../utils/storage.ts';
import { 
  FileText, 
  User, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Check, 
  Copy, 
  Sparkles,
  MapPin,
  Calendar,
  Clock
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Identificação & Confirmação</span>
          <FileText className="w-5 h-5 text-purple-400" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Preencha seus dados para garantir a reserva na agenda do <strong>{tenant.name}</strong>:
        </p>
      </div>

      {/* Summary Voucher Card */}
      <div className="bg-gradient-to-br from-[#151D2F] via-[#1b253b] to-[#151D2F] border border-purple-500/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-[#222F46] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Resumo da Reserva</span>
          </div>
          <span className="text-xs font-extrabold text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2.5 py-0.5 rounded-full">
            {tenant.name}
          </span>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Serviço:</span>
            <strong className="text-white text-right">{service.name} ({service.duration} min)</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Especialista:</span>
            <strong className="text-white text-right">{specialist.name}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Data & Horário:</span>
            <strong className="text-emerald-400 text-right font-bold">
              {formatDatePtBR(date)} às {time}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Localização:</span>
            <span className="text-slate-300 text-right text-xs truncate max-w-[200px] sm:max-w-xs">{tenant.address}</span>
          </div>

          <div className="border-t border-[#222F46] pt-3 mt-2 flex items-center justify-between">
            <span className="font-extrabold text-white text-sm">Valor Total:</span>
            <span className="text-xl font-black text-emerald-400">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          <span>Dados do Cliente</span>
        </h3>

        {/* Client Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Seu Nome Completo <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={clientName}
              onChange={(e) => onChangeClientName(e.target.value)}
              placeholder="Ex: Carolina Almeida Souza"
              className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Client WhatsApp */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Seu WhatsApp com DDD <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={clientPhone}
              onChange={handlePhoneChange}
              placeholder="(11) 98888-7777"
              maxLength={15}
              className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all font-mono"
              required
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Enviaremos o lembrete de confirmação diretamente para este número.
          </p>
        </div>

        {/* Client Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Observações ou Preferências (Opcional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <textarea
              value={clientNotes}
              onChange={(e) => onChangeClientNotes(e.target.value)}
              placeholder="Ex: Prefiro tom loiro perolado, tenho alergia a perfume forte, etc."
              rows={2}
              className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-400" />
          <span>Forma de Pagamento Preferida</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Presencial Option */}
          <div
            onClick={() => onChangePaymentMethod('presencial')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              paymentMethod === 'presencial'
                ? 'border-purple-500 bg-purple-950/20 shadow-md ring-1 ring-purple-500/40'
                : 'border-[#222F46] bg-[#0B0F19]/60 hover:border-slate-600'
            }`}
          >
            <div className="mt-0.5">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'presencial' ? 'border-purple-500 bg-purple-600' : 'border-slate-600'
                }`}
              >
                {paymentMethod === 'presencial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Pagar Presencialmente</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Pague no balcão após o atendimento (Pix, Cartão de Crédito/Débito ou Dinheiro).
              </div>
            </div>
          </div>

          {/* Pix Antecipado Option */}
          <div
            onClick={() => onChangePaymentMethod('pix_online')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              paymentMethod === 'pix_online'
                ? 'border-purple-500 bg-purple-950/20 shadow-md ring-1 ring-purple-500/40'
                : 'border-[#222F46] bg-[#0B0F19]/60 hover:border-slate-600'
            }`}
          >
            <div className="mt-0.5">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'pix_online' ? 'border-purple-500 bg-purple-600' : 'border-slate-600'
                }`}
              >
                {paymentMethod === 'pix_online' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Chave Pix do Estabelecimento</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 rounded">Rápido</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Transfira direto para o Pix oficial do salão e envie o comprovante.
              </div>
            </div>
          </div>
        </div>

        {paymentMethod === 'pix_online' && tenant.pixKey && (
          <div className="mt-3 p-3 bg-[#0B0F19] rounded-xl border border-emerald-500/30 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Chave Pix Oficial:</span>
              <span className="text-xs font-mono font-bold text-white truncate block">{tenant.pixKey}</span>
            </div>
            <button
              type="button"
              onClick={copyPixKey}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-colors"
            >
              {copiedPix ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Chave</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Reassurance Footer */}
      <div className="flex items-center gap-2.5 text-xs text-slate-400 px-1">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Seus dados estão protegidos. Confirmação instantânea sem burocracia.</span>
      </div>
    </div>
  );
};
