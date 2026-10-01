import React from 'react';
import { Specialist, Service } from '../types/index.ts';
import { Star, Check, User } from 'lucide-react';

interface StepSpecialistsProps {
  specialists: Specialist[];
  selectedSpecialist: Specialist | null;
  onSelectSpecialist: (specialist: Specialist) => void;
  selectedService: Service | null;
}

export const StepSpecialists: React.FC<StepSpecialistsProps> = ({
  specialists,
  selectedSpecialist,
  onSelectSpecialist,
  selectedService
}) => {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Título da Seção em Caixa Alta */}
      <div className="pt-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
          PROFISSIONAIS DISPONÍVEIS
        </h2>
        <p className="text-[11px] text-[#8E8E93] mt-0.5">
          {selectedService ? (
            <>Para o serviço <span className="text-white font-semibold">{selectedService.name}</span></>
          ) : (
            'Escolha o profissional de sua preferência'
          )}
        </p>
      </div>

      {/* Lista de Profissionais - 100% Width Mobile */}
      <div className="space-y-2.5">
        {specialists.map((specialist) => {
          const isSelected = selectedSpecialist?.name === specialist.name;
          const isAny = specialist.id === null;

          return (
            <div
              key={specialist.name}
              onClick={() => onSelectSpecialist(specialist)}
              className={`group w-full bg-[#141416] border rounded-[16px] p-3.5 sm:p-4 cursor-pointer transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${
                isSelected
                  ? 'border-[#3A4D6F] bg-[#1A1A1E] ring-1 ring-[#3A4D6F]'
                  : 'border-[#222226] hover:border-[#3A4D6F]/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar / Iniciais */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#3A4D6F] text-white shadow-sm'
                      : isAny
                      ? 'bg-[#1A1A1E] text-[#FFFFFF] border border-[#222226]'
                      : 'bg-[#1A1A1E] text-[#8E8E93] border border-[#222226]'
                  }`}
                >
                  {isAny ? <User className="w-4 h-4 text-white" /> : specialist.initials}
                </div>

                {/* Detalhes */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#FFFFFF] truncate">
                      {specialist.name}
                    </h3>
                    {specialist.rating && (
                      <span className="text-[9px] font-bold text-[#FFFFFF] bg-[#1A1A1E] border border-[#222226] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {specialist.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-[#8E8E93] mt-0.5 truncate font-medium">
                    {specialist.role}
                  </p>
                </div>
              </div>

              {/* Botão / Check de Seleção */}
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#3A4D6F] text-[#FFFFFF]'
                      : 'bg-[#1A1A1E] border border-[#222226] text-[#8E8E93] group-hover:bg-[#3A4D6F] group-hover:text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Selecionado</span>
                    </>
                  ) : (
                    <span>Selecionar</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
