import React from 'react';
import { Tenant } from '../types/index.ts';
import { MapPin, Star, MessageCircle } from 'lucide-react';

interface HeroPresentationProps {
  tenant: Tenant;
}

export const HeroBanner: React.FC<HeroPresentationProps> = ({ tenant }) => {
  const cleanPhone = tenant.phone.replace(/\D/g, '');

  return (
    <div className="w-full pt-3 pb-2">
      {/* Contêiner Mobile 100% Width: Fundo #141416, borda #222226, border-radius 16px */}
      <div className="rounded-[16px] bg-[#141416] border border-[#222226] p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          {/* Identificação do Estabelecimento */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-[#3A4D6F] flex items-center justify-center font-black text-white text-base flex-shrink-0 shadow-inner">
              {tenant.initials}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base font-extrabold text-[#FFFFFF] tracking-tight truncate">
                {tenant.name}
              </h1>

              <p className="text-xs uppercase font-semibold tracking-wider text-[#8E8E93] truncate mt-0.5">
                {tenant.category}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] mt-1">
                <span className="flex items-center gap-1 text-[#FFFFFF] font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {tenant.rating.split(' ')[0]}
                </span>
                <span className="text-[#222226]">•</span>
                <span className="flex items-center gap-1 text-[#8E8E93] truncate">
                  <MapPin className="w-3 h-3 text-[#8E8E93] flex-shrink-0" />
                  {tenant.address.split('-')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Contato WhatsApp - 100% Width Mobile */}
          <a
            href={`https://api.whatsapp.com/send?phone=55${cleanPhone || '11977778888'}&text=${encodeURIComponent(`Olá ${tenant.name}! Gostaria de tirar uma dúvida sobre os serviços.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-[#1A1A1E] hover:bg-[#3A4D6F] border border-[#222226] hover:border-[#3A4D6F] text-[#FFFFFF] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#8E8E93] group-hover:text-white" />
            <span className="tracking-wide">Falar com Atendimento</span>
          </a>
        </div>
      </div>
    </div>
  );
};
