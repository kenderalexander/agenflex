import { Tenant, Appointment } from '../types/index.ts';
import { DEFAULT_TENANTS } from '../data/defaultTenants.ts';
import { insertSupabaseAppointment, updateSupabaseAppointmentStatus as updateRemoteStatus } from '../lib/supabase.ts';

const TENANTS_STORAGE_KEY = 'vibe_style_tenants_v1';
const APPOINTMENTS_STORAGE_KEY = 'vibe_style_appointments_v1';

export function getStoredTenants(): Record<string, Tenant> {
  try {
    const raw = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(DEFAULT_TENANTS));
      return DEFAULT_TENANTS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_TENANTS, ...parsed };
  } catch (e) {
    console.error('Error loading tenants from storage', e);
    return DEFAULT_TENANTS;
  }
}

export function saveTenants(tenants: Record<string, Tenant>): void {
  try {
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
  } catch (e) {
    console.error('Error saving tenants to storage', e);
  }
}

export function saveSingleTenant(tenant: Tenant): void {
  const current = getStoredTenants();
  current[tenant.slug] = tenant;
  saveTenants(current);
}

export function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      // Seed some initial realistic bookings for demonstration
      const initialBookings: Appointment[] = [
        {
          id: 'apt-101',
          tenantSlug: 'glamour-studio-spa',
          tenantName: 'Studio Glam & Vibe',
          serviceId: 'srv1',
          serviceName: 'Mechas Balayage & Tonalização',
          serviceCategory: 'Coloração',
          duration: 120,
          price: 380.0,
          specialistId: 'collab-1',
          specialistName: 'Dra. Camila Gestora',
          date: new Date().toISOString().split('T')[0],
          time: '14:30',
          clientName: 'Mariana Duarte',
          clientPhone: '(11) 99876-5432',
          clientNotes: 'Prefere mechas em tom pérola e mel.',
          paymentMethod: 'presencial',
          status: 'confirmado',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'apt-102',
          tenantSlug: 'barbearia-vibe',
          tenantName: 'Barbearia Vibe Style',
          serviceId: 'barb3',
          serviceName: 'Combo Executivo: Cabelo + Barba',
          serviceCategory: 'Combo',
          duration: 55,
          price: 95.0,
          specialistId: 'barb-1',
          specialistName: 'Lucas Rocha',
          date: new Date().toISOString().split('T')[0],
          time: '16:00',
          clientName: 'Gabriel Medeiros',
          clientPhone: '(11) 98123-4567',
          status: 'em_atendimento',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading appointments', e);
    return [];
  }
}

export function saveAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Error saving appointments', e);
  }
}

export function addAppointment(newAppt: Appointment): void {
  const current = getStoredAppointments();
  current.unshift(newAppt);
  saveAppointments(current);
  
  // Sincroniza com Supabase em segundo plano
  insertSupabaseAppointment(newAppt).catch(err => {
    console.warn('[Supabase Sync] Falha ao enviar para Supabase:', err);
  });
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): void {
  const current = getStoredAppointments();
  const updated = current.map(a => a.id === id ? { ...a, status } : a);
  saveAppointments(updated);

  // Sincroniza atualização com Supabase
  updateRemoteStatus(id, status).catch(err => {
    console.warn('[Supabase Sync] Falha ao atualizar status no Supabase:', err);
  });
}

// Helpers
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function formatDatePtBR(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    return `${weekdays[dateObj.getDay()]}, ${day} de ${months[dateObj.getMonth()]} de ${year}`;
  } catch (e) {
    return dateStr;
  }
}

export function generateWhatsAppLink(tenantPhone: string, appt: {
  serviceName: string;
  date: string;
  time: string;
  specialistName: string;
  tenantName: string;
  clientName: string;
  price: number;
}): string {
  const cleanPhone = tenantPhone.replace(/\D/g, '');
  const message = `✨ Olá, ${appt.tenantName}!

Acabei de realizar um agendamento online pelo portal oficial:
👤 *Cliente:* ${appt.clientName}
💇‍♀️ *Serviço:* ${appt.serviceName}
✂️ *Profissional:* ${appt.specialistName}
📅 *Data:* ${formatDatePtBR(appt.date)}
⏰ *Horário:* ${appt.time}
💰 *Valor:* ${formatCurrency(appt.price)}

Por favor, poderiam confirmar a reserva na agenda? Obrigado(a)!`;

  return `https://api.whatsapp.com/send?phone=55${cleanPhone || '11977778888'}&text=${encodeURIComponent(message)}`;
}

export function generateGoogleCalendarLink(appt: {
  serviceName: string;
  date: string;
  time: string;
  tenantName: string;
  tenantAddress: string;
  duration: number;
}): string {
  try {
    const [year, month, day] = appt.date.split('-');
    const [hour, minute] = appt.time.split(':');
    const start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    const end = new Date(start.getTime() + appt.duration * 60000);

    const pad = (n: number) => (n < 10 ? '0' : '') + n;
    const formatUtc = (d: Date) => 
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const datesParam = `${formatUtc(start)}/${formatUtc(end)}`;
    const title = encodeURIComponent(`Agendamento: ${appt.serviceName} no ${appt.tenantName}`);
    const details = encodeURIComponent(`Atendimento agendado via Vibe Style no estabelecimento ${appt.tenantName}.\nEndereço: ${appt.tenantAddress}`);
    const location = encodeURIComponent(appt.tenantAddress);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
  } catch (e) {
    return '#';
  }
}
