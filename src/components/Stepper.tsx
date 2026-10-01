import React from 'react';
import { Check } from 'lucide-react';

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
    { id: 1, label: 'SERVIÇO' },
    { id: 2, label: 'PROFISSIONAL' },
    { id: 3, label: 'HORÁRIO' },
    { id: 4, label: 'CONFIRMAR' }
  ];

  if (currentStep === 5) return null;

  return (
    <nav aria-label="Progresso do Agendamento" className="w-full mb-3">
      <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-1.5">
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
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-[#3A4D6F] text-[#FFFFFF] shadow-sm'
                    : isDone
                    ? 'text-[#FFFFFF] cursor-pointer hover:bg-[#1A1A1E]'
                    : 'text-[#8E8E93] opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#141416]'
                      : isDone
                      ? 'bg-[#3A4D6F] text-white'
                      : 'bg-[#222226] text-[#8E8E93]'
                  }`}
                >
                  {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : step.id}
                </div>
                <span className="truncate text-[9px] sm:text-[10px]">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
