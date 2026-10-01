import React, { useState, useMemo, useEffect } from 'react';
import { Service } from '../types/index.ts';
import { formatCurrency } from '../utils/storage.ts';
import { Search, Clock, Sparkles, Check, Flame, Scissors } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Sincronização dinâmica das categorias com base nos serviços registrados
  const categories = useMemo(() => {
    const rawCategories = services
      .map(s => s.category?.trim())
      .filter((cat): cat is string => Boolean(cat));
    const uniqueCats = Array.from(new Set(rawCategories));
    return ['Todos', ...uniqueCats];
  }, [services]);

  // Se a categoria selecionada não existir mais nos serviços atuais, reseta para 'Todos'
  useEffect(() => {
    if (selectedCategory !== 'Todos' && !categories.includes(selectedCategory)) {
      setSelectedCategory('Todos');
    }
  }, [categories, selectedCategory]);

  // Serviços filtrados de acordo com os filtros rápidos sincronizados e busca
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCat = selectedCategory === 'Todos' || 
        (service.category && service.category.toLowerCase() === selectedCategory.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        service.name.toLowerCase().includes(q) || 
        (service.desc && service.desc.toLowerCase().includes(q)) ||
        (service.category && service.category.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {/* Title (sem o badge de quantidade de opções) */}
      <div className="pt-1">
        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
          <span>Escolha o Serviço</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400">
          Selecione o procedimento desejado:
        </p>
      </div>

      {/* Fast Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar serviço (ex: corte, barba, mechas, unha)..."
          className="w-full bg-[#151D2F] border border-[#222F46] focus:border-purple-500 text-white placeholder-slate-500 pl-9 pr-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white bg-[#222F46] px-1.5 py-0.5 rounded font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros Rápidos Sincronizados com os Serviços Registrados */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-[#151D2F] text-slate-400 hover:text-slate-200 border border-[#222F46]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lista de Opções de Serviços - Touch Otimizado */}
      <div className="space-y-2.5 pt-1">
        {filteredServices.length === 0 ? (
          <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-6 text-center">
            <Scissors className="w-8 h-8 text-slate-600 mx-auto mb-1.5" />
            <h3 className="text-sm font-bold text-slate-300">Nenhum serviço encontrado</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tente buscar com outra palavra ou selecione o filtro "Todos".
            </p>
          </div>
        ) : (
          filteredServices.map((service) => {
            const isSelected = selectedService?.id === service.id;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className={`group relative bg-[#151D2F] border rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/25 shadow-lg shadow-purple-950/40 ring-2 ring-purple-500/40'
                    : 'border-[#222F46] hover:border-slate-600 hover:bg-[#182136]'
                }`}
              >
                {/* Informações do Serviço */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-md">
                      {service.category}
                    </span>
                    {service.popular && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/25 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 text-amber-400" /> Mais Pedido
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-300 bg-[#0B0F19]/80 px-2 py-0.5 rounded-md border border-slate-800">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {service.duration} min
                    </span>
                  </div>
                </div>

                {/* Preço e Botão de Ação Touch */}
                <div className="flex flex-col items-end justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                    {formatCurrency(service.price)}
                  </span>

                  <button
                    type="button"
                    className={`mt-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                        : 'bg-[#222F46] group-hover:bg-purple-600 text-slate-200 group-hover:text-white'
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
