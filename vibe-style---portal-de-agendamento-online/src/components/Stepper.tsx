import React from 'react';
import { Check, Sparkles, User, Calendar, FileText } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxReachedStep: number;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep
}) => {
  const steps = [
    { id: 1, label: 'Serviço' },
    { id: 2, label: 'Profissional' },
    { id: 3, label: 'Horário' },
    { id: 4, label: 'Confirmar' }
  ];

  if (currentStep === 5) return null;

  return (
    <nav aria-label="Progresso do Agendamento" className="w-full mb-3">
      <div className="bg-[#151D2F] border border-[#222F46] rounded-xl p-1.5 sm:p-2">
        <div className="grid grid-cols-4 gap-1">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            const isClickable = step.id <= maxReachedStep;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                    : isDone
                    ? 'text-emerald-400 cursor-pointer'
                    : 'text-slate-500 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                    isActive
                      ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#222F46] text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                </div>
                <span className="truncate text-[11px] sm:text-xs">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
