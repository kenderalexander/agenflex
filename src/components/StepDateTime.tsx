import React, { useMemo } from 'react';
import { Appointment } from '../types/index.ts';
import { formatDatePtBR } from '../utils/storage.ts';
import { Clock } from 'lucide-react';

interface StepDateTimeProps {
  selectedDate: string;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  existingAppointments: Appointment[];
  tenantSlug: string;
}

export const StepDateTime: React.FC<StepDateTimeProps> = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  existingAppointments,
  tenantSlug
}) => {
  // Próximos 14 dias
  const upcomingDays = useMemo(() => {
    const days = [];
    const weekdaysShort = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const monthsShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      days.push({
        date: dateString,
        dayOfWeek: weekdaysShort[d.getDay()],
        dayNumber: dd,
        month: monthsShort[d.getMonth()],
        isToday: i === 0,
        isSunday: d.getDay() === 0
      });
    }
    return days;
  }, []);

  // Períodos de horários
  const timeSlots = useMemo(() => {
    return {
      morning: ['09:00', '09:30', '10:00', '10:30', '11:15', '11:45'],
      afternoon: ['13:00', '13:30', '14:00', '14:30', '15:15', '16:00', '16:30', '17:15'],
      evening: ['18:00', '18:30', '19:15', '19:45', '20:00']
    };
  }, []);

  const isSlotBooked = (time: string) => {
    return existingAppointments.some(
      a => a.tenantSlug === tenantSlug && 
           a.date === selectedDate && 
           a.time === time && 
           a.status !== 'cancelado'
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Título da Seção em Caixa Alta */}
      <div className="pt-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
          SELEÇÃO DE HORÁRIO
        </h2>
        <p className="text-[11px] text-[#8E8E93] mt-0.5">
          Escolha o dia e o horário mais conveniente
        </p>
      </div>

      {/* 1. Carrossel de Datas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] px-1">
          <span>1. Data Selecionada</span>
          <span className="text-[#FFFFFF]">{formatDatePtBR(selectedDate)}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          {upcomingDays.map((item) => {
            const isSelected = selectedDate === item.date;

            return (
              <button
                key={item.date}
                type="button"
                onClick={() => onSelectDate(item.date)}
                className={`min-w-[65px] p-2.5 rounded-[16px] border text-center transition-all flex flex-col items-center justify-center flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#3A4D6F] border-[#3A4D6F] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#141416] border-[#222226] text-[#8E8E93] hover:border-[#3A4D6F]/60'
                }`}
              >
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}`}>
                  {item.isToday ? 'Hoje' : item.dayOfWeek}
                </span>
                <strong className="text-base font-extrabold my-0.5 block leading-none text-white">
                  {item.dayNumber}
                </strong>
                <span className={`text-[9px] uppercase font-semibold ${isSelected ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}`}>
                  {item.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Horários por Turno */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] px-1">
          <span>2. Horários Disponíveis</span>
          {selectedTime && (
            <span className="text-[#FFFFFF] flex items-center gap-1 font-bold">
              <Clock className="w-3 h-3 text-[#3A4D6F]" /> {selectedTime}
            </span>
          )}
        </div>

        {/* Manhã */}
        <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-3.5">
          <div className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2.5">
            Manhã (09:00 - 12:00)
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {timeSlots.morning.map((time) => {
              const booked = isSlotBooked(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  type="button"
                  disabled={booked}
                  onClick={() => onSelectTime(time)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center border ${
                    isSelected
                      ? 'bg-[#3A4D6F] border-[#3A4D6F] text-[#FFFFFF] shadow-sm'
                      : booked
                      ? 'bg-[#0D0D0D] border-[#222226] text-[#8E8E93] opacity-30 line-through cursor-not-allowed'
                      : 'bg-[#1A1A1E] border-[#222226] text-[#FFFFFF] hover:border-[#3A4D6F] hover:bg-[#3A4D6F]/30'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarde */}
        <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-3.5">
          <div className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2.5">
            Tarde (13:00 - 17:30)
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.afternoon.map((time) => {
              const booked = isSlotBooked(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  type="button"
                  disabled={booked}
                  onClick={() => onSelectTime(time)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center border ${
                    isSelected
                      ? 'bg-[#3A4D6F] border-[#3A4D6F] text-[#FFFFFF] shadow-sm'
                      : booked
                      ? 'bg-[#0D0D0D] border-[#222226] text-[#8E8E93] opacity-30 line-through cursor-not-allowed'
                      : 'bg-[#1A1A1E] border-[#222226] text-[#FFFFFF] hover:border-[#3A4D6F] hover:bg-[#3A4D6F]/30'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Noite */}
        <div className="bg-[#141416] border border-[#222226] rounded-[16px] p-3.5">
          <div className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2.5">
            Noite (18:00 - 20:00)
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSlots.evening.map((time) => {
              const booked = isSlotBooked(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  type="button"
                  disabled={booked}
                  onClick={() => onSelectTime(time)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center border ${
                    isSelected
                      ? 'bg-[#3A4D6F] border-[#3A4D6F] text-[#FFFFFF] shadow-sm'
                      : booked
                      ? 'bg-[#0D0D0D] border-[#222226] text-[#8E8E93] opacity-30 line-through cursor-not-allowed'
                      : 'bg-[#1A1A1E] border-[#222226] text-[#FFFFFF] hover:border-[#3A4D6F] hover:bg-[#3A4D6F]/30'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
