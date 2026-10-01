import React, { useState } from 'react';
import { Tenant } from '../types/index.ts';
import { 
  Building2, 
  Users, 
  Scissors, 
  CreditCard, 
  MessageSquare, 
  Globe, 
  ChevronRight, 
  Check, 
  MapPin, 
  Sparkles,
  HelpCircle,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface SettingsScreenProps {
  tenant: Tenant;
  onSelectSubView?: (view: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  tenant,
  onSelectSubView
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-20">
      {/* Card da Empresa igual à foto */}
      <div className="rounded-2xl bg-[#13151B] border border-[#222630] p-4 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center font-black text-white text-lg flex-shrink-0 shadow-lg shadow-blue-950/40 border border-blue-400/20">
            <div className="flex items-center tracking-tighter">
              <span>V</span>
              <Check className="w-4 h-4 -ml-0.5 stroke-[3] text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-black text-white tracking-tight truncate">
              {tenant.name || 'Vibestyli Studio'}
            </h2>
            
            <p className="text-[11px] text-[#8E95A5] truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
              <span>{tenant.address || 'Rua Oscar Freire, 1052 - Jardins, SP'}</span>
            </p>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1E293B] text-[#60A5FA] border border-[#2563EB]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                <span>Plano Anual VIP • Ativo</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: GESTÃO E EMPRESA */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-extrabold uppercase text-[#717888] tracking-wider block px-1">
          Gestão e Empresa
        </span>

        <div className="bg-[#13151B] border border-[#222630] rounded-2xl overflow-hidden divide-y divide-[#1D212B]">
          {/* Perfil da Empresa */}
          <div 
            onClick={() => setActiveModal('perfil')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Perfil da Empresa & Gestor</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Logo, endereço, horários e identidade</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>

          {/* Colaboradores & Equipe */}
          <div 
            onClick={() => setActiveModal('equipe')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Colaboradores & Equipe</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Escalas de trabalho, comissões e membros</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>

          {/* Catálogo de Serviços */}
          <div 
            onClick={() => setActiveModal('servicos')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Catálogo de Serviços</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Preços, durações e intervalos de agenda</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: PLANO E CONEXÕES */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-extrabold uppercase text-[#717888] tracking-wider block px-1">
          Plano e Conexões
        </span>

        <div className="bg-[#13151B] border border-[#222630] rounded-2xl overflow-hidden divide-y divide-[#1D212B]">
          {/* Assinatura & Plano */}
          <div 
            onClick={() => setActiveModal('assinatura')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Assinatura & Plano</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Plano Anual VIP, faturas e renovação</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>

          {/* Integração WhatsApp */}
          <div 
            onClick={() => setActiveModal('whatsapp')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Integração WhatsApp</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Status conectado, QR Code e mensagens automáticas</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>

          {/* Portal do Cliente & Link Único */}
          <div 
            onClick={() => setActiveModal('portal')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Portal do Cliente & Link Único</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Página pública, link web e QR Code de balcão</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: PREFERÊNCIAS E SUPORTE */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-extrabold uppercase text-[#717888] tracking-wider block px-1">
          Preferências e Suporte
        </span>

        <div className="bg-[#13151B] border border-[#222630] rounded-2xl overflow-hidden divide-y divide-[#1D212B]">
          <div 
            onClick={() => setActiveModal('notificacoes')}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181C26] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1D26] text-white flex items-center justify-center flex-shrink-0 border border-[#222630]">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white">Notificações e Alertas</h3>
                <p className="text-[11px] text-[#8E95A5] truncate">Avisos de novos agendamentos no celular</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#717888] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Quick feedback toast on click */}
      {activeModal && (
        <div className="p-3 bg-[#171B26] border border-[#2563EB]/40 rounded-xl text-xs text-[#60A5FA] flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
            <span>Módulo <strong>{activeModal}</strong> sincronizado e ativo</span>
          </span>
          <button 
            onClick={() => setActiveModal(null)} 
            className="text-[#8E95A5] hover:text-white font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
