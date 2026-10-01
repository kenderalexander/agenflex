import React from 'react';
import { Tenant } from '../types/index.ts';
import { MapPin, Star, MessageCircle, Clock } from 'lucide-react';

interface HeroPresentationProps {
  tenant: Tenant;
}

export const HeroBanner: React.FC<HeroPresentationProps> = ({ tenant }) => {
  const cleanPhone = tenant.phone.replace(/\D/g, '');

  return (
    <div className="w-full px-3 sm:px-4 pt-3 pb-1">
      {/* Contêiner de Apresentação Limpo sem imagem de portada e sem botões extras */}
      <div className="rounded-2xl bg-[#151D2F] border border-[#222F46] p-4 shadow-lg transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Salon Identification */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-base sm:text-lg flex-shrink-0 shadow-md shadow-purple-950/40 border border-purple-400/25">
              {tenant.initials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  {tenant.name}
                </h1>
                <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Aberto
                </span>
              </div>

              <p className="text-xs text-purple-300 font-semibold truncate mt-0.5">
                {tenant.category}
              </p>

              <div className="flex items-center gap-2.5 text-[11px] text-slate-300 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {tenant.rating.split(' ')[0]}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                  <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  {tenant.address.split('-')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Action */}
          <div className="flex items-center justify-end flex-shrink-0 border-t sm:border-t-0 border-[#222F46]/60 pt-2 sm:pt-0">
            <a
              href={`https://api.whatsapp.com/send?phone=55${cleanPhone || '11977778888'}&text=${encodeURIComponent(`Olá ${tenant.name}! Gostaria de tirar uma dúvida sobre os serviços.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-green-950/40 transition-transform active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp do Salão</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
