import React, { useState, useMemo, useEffect } from 'react';
import { Service } from '../types/index.ts';
import { formatCurrency } from '../utils/storage.ts';
import { Search, Clock, Check, Scissors } from 'lucide-react';

interface StepServicesProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  tenantName: string;
}

export const StepServices: React.FC<StepServicesProps> = ({
  services,
  selectedService,
  onSelectService,
  tenantName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Sincronização dinâmica das categorias com base nos serviços registrados
  const categories = useMemo(() => {
    const rawCategories = services
      .map(s => s.category?.trim().toUpperCase())
      .filter((cat): cat is string => Boolean(cat));
    const uniqueCats = Array.from(new Set(rawCategories));
    return ['TODOS', ...uniqueCats];
  }, [services]);

  // Se a categoria selecionada não existir mais nos serviços atuais, reseta para 'TODOS'
  useEffect(() => {
    if (selectedCategory !== 'TODOS' && !categories.includes(selectedCategory)) {
      setSelectedCategory('TODOS');
    }
  }, [categories, selectedCategory]);

  // Serviços filtrados de acordo com os filtros rápidos sincronizados e busca
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const catUpper = (service.category || '').toUpperCase();
      const matchesCat = selectedCategory === 'TODOS' || catUpper === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        service.name.toLowerCase().includes(q) || 
        (service.desc && service.desc.toLowerCase().includes(q)) ||
        (service.category && service.category.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Título da Seção em Caixa Alta e Subtexto Sutil */}
      <div className="pt-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
          CATÁLOGO DE SERVIÇOS
        </h2>
        <p className="text-[11px] text-[#8E8E93] mt-0.5">
          Selecione o procedimento para o seu atendimento
        </p>
      </div>

      {/* Campo de Busca Rápida */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar serviço..."
          className="w-full bg-[#141416] border border-[#222226] focus:border-[#3A4D6F] text-[#FFFFFF] placeholder-[#8E8E93] pl-9 pr-8 py-2.5 rounded-xl text-xs font-medium outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8E8E93] hover:text-white bg-[#1A1A1E] px-1.5 py-0.5 rounded font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros Rápidos Sincronizados (Pílulas Horizontais) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#3A4D6F] text-[#FFFFFF] shadow-sm'
                  : 'bg-[#141416] text-[#8E8E93] hover:text-white border border-[#222226]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lista de Opções de Serviços - 100% Width Mobile */}
      <div className="space-y-2.5 pt-1">
        {filteredServices.length === 0 ? (
          <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-6 text-center">
            <Scissors className="w-7 h-7 text-[#8E8E93] mx-auto mb-1.5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Nenhum serviço encontrado</h3>
            <p className="text-[11px] text-[#8E8E93] mt-0.5">
              Tente buscar com outra palavra ou selecione a aba "TODOS".
            </p>
          </div>
        ) : (
          filteredServices.map((service) => {
            const isSelected = selectedService?.id === service.id;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className={`group relative w-full bg-[#141416] border rounded-[16px] p-3.5 sm:p-4 cursor-pointer transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#3A4D6F] bg-[#1A1A1E] ring-1 ring-[#3A4D6F]'
                    : 'border-[#222226] hover:border-[#3A4D6F]/60'
                }`}
              >
                {/* Informações do Serviço */}
                <div className="flex-1 min-w-0 pr-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8E8E93]">
                    {service.category}
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-[#FFFFFF] leading-snug mt-0.5">
                    {service.name}
                  </h3>

                  <p className="text-[11px] text-[#8E8E93] mt-1 line-clamp-2 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[#8E8E93]">
                    <span className="flex items-center gap-1 font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-0.5 rounded-md border border-[#222226]">
                      <Clock className="w-3 h-3 text-[#8E8E93]" />
                      {service.duration} min
                    </span>
                  </div>
                </div>

                {/* Preço e Botão de Ação */}
                <div className="flex flex-col items-end justify-center flex-shrink-0">
                  <span className="text-sm sm:text-base font-black text-[#FFFFFF] tracking-tight">
                    {formatCurrency(service.price)}
                  </span>

                  <button
                    type="button"
                    className={`mt-2 px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#3A4D6F] text-[#FFFFFF]'
                        : 'bg-[#1A1A1E] border border-[#222226] text-[#8E8E93] group-hover:bg-[#3A4D6F] group-hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Escolhido</span>
                      </>
                    ) : (
                      <span>Escolher</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
