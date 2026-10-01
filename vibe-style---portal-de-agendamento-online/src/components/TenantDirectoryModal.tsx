import React, { useState } from 'react';
import { Tenant } from '../types/index.ts';
import { 
  Building2, 
  Search, 
  X, 
  Plus, 
  Star, 
  MapPin, 
  Check, 
  ArrowRight,
  Scissors
} from 'lucide-react';

interface TenantDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: Record<string, Tenant>;
  currentSlug: string;
  onSelectTenant: (slug: string) => void;
  onOpenNewTenantModal: () => void;
}

export const TenantDirectoryModal: React.FC<TenantDirectoryModalProps> = ({
  isOpen,
  onClose,
  tenants,
  currentSlug,
  onSelectTenant,
  onOpenNewTenantModal
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todos');

  if (!isOpen) return null;

  const tenantList = Object.values(tenants);
  const categories = ['Todos', 'Salão', 'Barbearia', 'Unhas', 'Spa'];

  const filteredTenants = tenantList.filter(t => {
    const q = search.toLowerCase();
    const matchesSearch = !q || 
      t.name.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q) || 
      t.address.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q);

    let matchesCat = true;
    if (selectedCat === 'Salão') matchesCat = t.category.toLowerCase().includes('salão') || t.category.toLowerCase().includes('beleza');
    if (selectedCat === 'Barbearia') matchesCat = t.category.toLowerCase().includes('barba');
    if (selectedCat === 'Unhas') matchesCat = t.category.toLowerCase().includes('unha') || t.category.toLowerCase().includes('esmalteria');
    if (selectedCat === 'Spa') matchesCat = t.category.toLowerCase().includes('spa') || t.category.toLowerCase().includes('estética');

    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#151D2F] border border-[#222F46] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#222F46] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Rede de Estabelecimentos</h2>
              <p className="text-xs text-slate-400">Escolha onde deseja agendar ou cadastre seu próprio negócio:</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222F46] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-[#222F46] space-y-3 bg-[#0B0F19]/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar salão por nome, bairro ou especialidade..."
              className="w-full bg-[#151D2F] border border-[#222F46] text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#151D2F] text-slate-400 hover:text-slate-200 border border-[#222F46]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of Tenants */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filteredTenants.map((t) => {
            const isCurrent = t.slug === currentSlug;

            return (
              <div
                key={t.slug}
                onClick={() => {
                  onSelectTenant(t.slug);
                  onClose();
                }}
                className={`group p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-purple-500 bg-purple-950/20 shadow-md ring-1 ring-purple-500/40'
                    : 'border-[#222F46] bg-[#0B0F19]/60 hover:border-slate-500 hover:bg-[#182136]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0">
                    {t.initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                        {t.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold truncate">{t.category}</p>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{t.address}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222F46]">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {t.rating.split(' ')[0]}
                  </span>
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Acessar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer / Create New Salon Trigger */}
        <div className="p-4 border-t border-[#222F46] bg-[#0B0F19]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Você é dono de salão ou barbearia?
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenNewTenantModal();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Meu Estabelecimento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
