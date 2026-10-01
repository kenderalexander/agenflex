import React, { useMemo } from 'react';
import { Appointment } from '../types/index.ts';
import { formatDatePtBR } from '../utils/storage.ts';
import { Calendar, Clock, Sun, Sunset, Moon, Sparkles } from 'lucide-react';

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
  // Generate next 14 upcoming days
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

  // Time periods
  const timeSlots = useMemo(() => {
    return {
      morning: ['09:00', '09:30', '10:00', '10:30', '11:15', '11:45'],
      afternoon: ['13:00', '13:30', '14:00', '14:30', '15:15', '16:00', '16:30', '17:15'],
      evening: ['18:00', '18:30', '19:15', '19:45', '20:00']
    };
  }, []);

  // Check if a slot is already booked for this tenant on selected date
  const isSlotBooked = (time: string) => {
    return existingAppointments.some(
      a => a.tenantSlug === tenantSlug && 
           a.date === selectedDate && 
           a.time === time && 
           a.status !== 'cancelado'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Data & Horário</span>
          <Calendar className="w-5 h-5 text-purple-400" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Selecione o dia e o melhor horário com confirmação imediata:
        </p>
      </div>

      {/* Date Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
          <span>1. Selecione o Dia</span>
          <span className="text-purple-400 font-semibold">{formatDatePtBR(selectedDate)}</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {upcomingDays.map((item) => {
            const isSelected = selectedDate === item.date;

            return (
              <button
                key={item.date}
                onClick={() => onSelectDate(item.date)}
                className={`min-w-[70px] sm:min-w-[80px] p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40 ring-2 ring-purple-400/40 scale-105'
                    : 'bg-[#151D2F] border-[#222F46] text-slate-300 hover:border-slate-500 hover:bg-[#182136]'
                }`}
              >
                <span className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                  {item.isToday ? 'Hoje' : item.dayOfWeek}
                </span>
                <strong className="text-lg sm:text-xl font-black my-0.5 block leading-none">
                  {item.dayNumber}
                </strong>
                <span className={`text-[10px] font-semibold ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                  {item.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Grid By Period */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
          <span>2. Selecione o Horário Disponível</span>
          {selectedTime && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {selectedTime} selecionado
            </span>
          )}
        </div>

        {/* Morning */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Manhã (09:00 - 12:00)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {timeSlots.morning.map((time) => {
              const booked = isSlotBooked(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  disabled={booked}
                  onClick={() => onSelectTime(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all text-center border ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-400/40'
                      : booked
                      ? 'bg-[#0B0F19]/40 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                      : 'bg-[#0B0F19] border-[#222F46] text-slate-200 hover:border-purple-500 hover:text-white hover:bg-purple-950/20'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Afternoon */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-3">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span>Tarde (13:00 - 17:30)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {timeSlots.afternoon.map((time) => {
              const booked = isSlotBooked(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  disabled={booked}
                  onClick={() => onSelectTime(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all text-center border ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-400/40'
                      : booked
                      ? 'bg-[#0B0F19]/40 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                      : 'bg-[#0B0F19] border-[#222F46] text-slate-200 hover:border-purple-500 hover:text-white hover:bg-purple-950/20'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Evening */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-3">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Noite (18:00 - 20:30)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSlots.evening.map((time) => {
              const booked = isSlotBooked(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  disabled={booked}
                  onClick={() => onSelectTime(time)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all text-center border ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-400/40'
                      : booked
                      ? 'bg-[#0B0F19]/40 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                      : 'bg-[#0B0F19] border-[#222F46] text-slate-200 hover:border-purple-500 hover:text-white hover:bg-purple-950/20'
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
