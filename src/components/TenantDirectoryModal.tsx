import React, { useState } from 'react';
import { Tenant } from '../types/index.ts';
import { 
  Building2, 
  Search, 
  X, 
  Plus, 
  Star, 
  MapPin, 
  ArrowRight
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#141416] border border-[#222226] rounded-t-[20px] sm:rounded-[20px] max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#222226] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3A4D6F] text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">Rede de Salões</h2>
              <p className="text-[10px] text-[#8E8E93]">Escolha o estabelecimento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E93] hover:text-white hover:bg-[#1A1A1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-[#222226] space-y-2 bg-[#141416]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou endereço..."
              className="w-full bg-[#1A1A1E] border border-[#222226] text-white placeholder-[#8E8E93] pl-9 pr-3 py-2 rounded-xl text-xs font-medium outline-none focus:border-[#3A4D6F]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? 'bg-[#3A4D6F] text-white'
                    : 'bg-[#1A1A1E] text-[#8E8E93] hover:text-white border border-[#222226]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of Tenants */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2.5">
          {filteredTenants.map((t) => {
            const isCurrent = t.slug === currentSlug;

            return (
              <div
                key={t.slug}
                onClick={() => {
                  onSelectTenant(t.slug);
                  onClose();
                }}
                className={`group p-3 rounded-[16px] border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                  isCurrent
                    ? 'border-[#3A4D6F] bg-[#1A1A1E] ring-1 ring-[#3A4D6F]'
                    : 'border-[#222226] bg-[#141416] hover:border-[#3A4D6F]/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#3A4D6F] flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                    {t.initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-white truncate">
                        {t.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-[#3A4D6F] text-white px-1.5 py-0.5 rounded">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8E8E93] uppercase font-semibold truncate">{t.category}</p>
                    <p className="text-[10px] text-[#8E8E93] truncate flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#8E8E93]" />
                      <span>{t.address.split('-')[0]}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {t.rating.split(' ')[0]}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#222226] bg-[#141416]">
          <button
            onClick={() => {
              onClose();
              onOpenNewTenantModal();
            }}
            className="w-full py-2.5 bg-[#3A4D6F] hover:bg-[#4A5D80] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Estabelecimento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
