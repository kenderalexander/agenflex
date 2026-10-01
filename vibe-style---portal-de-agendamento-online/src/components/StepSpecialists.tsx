import React from 'react';
import { Specialist, Service } from '../types/index.ts';
import { UserCheck, Star, Sparkles, Check, Users } from 'lucide-react';

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
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Profissional de Preferência</span>
          <Users className="w-5 h-5 text-purple-400" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          {selectedService ? (
            <>
              Para o serviço <strong className="text-purple-300">{selectedService.name}</strong>, escolha seu especialista favorito:
            </>
          ) : (
            'Escolha o especialista de sua preferência:'
          )}
        </p>
      </div>

      {/* Specialists List */}
      <div className="space-y-3">
        {specialists.map((specialist) => {
          const isSelected = selectedSpecialist?.name === specialist.name;
          const isAny = specialist.id === null;

          return (
            <div
              key={specialist.name}
              onClick={() => onSelectSpecialist(specialist)}
              className={`group bg-[#151D2F] border rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/20 shadow-lg shadow-purple-950/40 ring-2 ring-purple-500/30'
                  : 'border-[#222F46] hover:border-slate-600 hover:bg-[#182136]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar / Initials */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-400/40'
                      : isAny
                      ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-[#222F46] text-slate-200 group-hover:bg-slate-700'
                  }`}
                >
                  {isAny ? '⭐' : specialist.initials}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                      {specialist.name}
                    </h3>
                    {specialist.rating && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {specialist.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {specialist.role}
                  </p>
                  {isAny && (
                    <span className="inline-block mt-1 text-[11px] text-emerald-400 font-semibold">
                      ⚡ Maior disponibilidade de horários
                    </span>
                  )}
                </div>
              </div>

              {/* Selection Check Circle */}
              <div className="flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'border-2 border-[#222F46] group-hover:border-slate-500 bg-[#0B0F19]'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
