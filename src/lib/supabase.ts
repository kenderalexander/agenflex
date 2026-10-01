import { createClient } from '@supabase/supabase-js';
import { Appointment, AppointmentStatus } from '../types/index.ts';

// Configuração fornecida do Supabase
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://oxusmmhkpesuubyyyyhx.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FVx2K9soCfJ_hczEuGRsOg_jjbqt4ds';

// Inicialização do cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Busca todos os agendamentos cadastrados no Supabase
 */
export async function getSupabaseAppointments(): Promise<Appointment[] | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Aviso ao buscar agendamentos remotos:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id || `VB-${item.id}`,
      tenantSlug: item.tenant_slug || item.tenantSlug || 'glamour-studio-spa',
      tenantName: item.tenant_name || item.tenantName || 'Studio Glam & Vibe',
      serviceId: item.service_id || item.serviceId || 'srv1',
      serviceName: item.service_name || item.serviceName || 'Serviço',
      serviceCategory: item.service_category || item.serviceCategory || 'Geral',
      duration: item.duration || 45,
      price: Number(item.price) || 0,
      specialistId: item.specialist_id || item.specialistId || null,
      specialistName: item.specialist_name || item.specialistName || 'Qualquer profissional',
      date: item.date || new Date().toISOString().split('T')[0],
      time: item.time || '14:00',
      clientName: item.client_name || item.clientName || 'Cliente',
      clientPhone: item.client_phone || item.clientPhone || '',
      clientNotes: item.client_notes || item.clientNotes,
      paymentMethod: item.payment_method || item.paymentMethod || 'presencial',
      status: (item.status as AppointmentStatus) || 'confirmado',
      createdAt: item.created_at || item.createdAt || new Date().toISOString()
    }));
  } catch (err) {
    console.error('[Supabase] Erro de rede:', err);
    return null;
  }
}

/**
 * Insere um novo agendamento no Supabase
 */
export async function insertSupabaseAppointment(appointment: Appointment): Promise<boolean> {
  try {
    const payload = {
      id: appointment.id,
      tenant_slug: appointment.tenantSlug,
      tenant_name: appointment.tenantName,
      service_id: appointment.serviceId,
      service_name: appointment.serviceName,
      service_category: appointment.serviceCategory,
      duration: appointment.duration,
      price: appointment.price,
      specialist_id: appointment.specialistId,
      specialist_name: appointment.specialistName,
      date: appointment.date,
      time: appointment.time,
      client_name: appointment.clientName,
      client_phone: appointment.clientPhone,
      client_notes: appointment.clientNotes,
      payment_method: appointment.paymentMethod,
      status: appointment.status,
      created_at: appointment.createdAt
    };

    const { error } = await supabase
      .from('appointments')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase Insert] Falha na inserção no banco remoto:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Supabase Insert Error]:', err);
    return false;
  }
}

/**
 * Atualiza o status de um agendamento no Supabase
 */
export async function updateSupabaseAppointmentStatus(
  id: string, 
  status: AppointmentStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: status })
      .eq('id', id);

    if (error) {
      console.warn('[Supabase Status Update]:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase Status Update Error]:', err);
    return false;
  }
}

/**
 * Subscreve às mudanças em tempo real na tabela 'appointments'
 */
export function subscribeToAppointmentsRealtime(
  onUpdate: (appointments: Appointment[]) => void
) {
  const channel = supabase
    .channel('realtime_appointments_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments'
      },
      async (payload) => {
        console.log('[Supabase Realtime] Notificação de alteração recebida:', payload);
        const latest = await getSupabaseAppointments();
        if (latest) {
          onUpdate(latest);
        }
      }
    )
    .subscribe((status) => {
      console.log('[Supabase Realtime] Status de conexão:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
