import { createClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Appointment, AppointmentStatus, Client, Service, Specialist, Tenant } from '../types/index.ts';

// Configuração do Supabase
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

// ==========================================
// 1. APPOINTMENTS (AGENDAMENTOS)
// ==========================================

export async function getSupabaseAppointments(): Promise<Appointment[] | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Aviso ao buscar agendamentos:', error.message);
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
    console.error('[Supabase] Erro de rede ao buscar agendamentos:', err);
    return null;
  }
}

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
      console.warn('[Supabase Insert Appointment]:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase Insert Appointment Error]:', err);
    return false;
  }
}

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
 * Subscription Realtime para a tabela 'appointments'
 */
export function subscribeToAppointments(
  onUpdate: (appointments: Appointment[]) => void,
  onPayload?: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const channel = supabase
    .channel('realtime_appointments')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'appointments' },
      async (payload) => {
        console.log('[Supabase Realtime] Alteração em appointments:', payload);
        if (onPayload) onPayload(payload);
        const latest = await getSupabaseAppointments();
        if (latest) onUpdate(latest);
      }
    )
    .subscribe((status) => {
      console.log('[Supabase Realtime appointments status]:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

// Mantendo compatibilidade com código existente
export const subscribeToAppointmentsRealtime = subscribeToAppointments;

// ==========================================
// 2. CLIENTS (CLIENTES)
// ==========================================

export async function getSupabaseClients(): Promise<Client[] | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Aviso ao buscar clientes:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id || `cli-${Math.random()}`,
      tenantSlug: item.tenant_slug || item.tenantSlug,
      name: item.name || item.client_name || 'Cliente',
      phone: item.phone || item.client_phone || '',
      email: item.email,
      notes: item.notes,
      createdAt: item.created_at || item.createdAt || new Date().toISOString()
    }));
  } catch (err) {
    console.error('[Supabase] Erro de rede ao buscar clientes:', err);
    return null;
  }
}

/**
 * Subscription Realtime para a tabela 'clients'
 */
export function subscribeToClients(
  onUpdate: (clients: Client[]) => void,
  onPayload?: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const channel = supabase
    .channel('realtime_clients')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'clients' },
      async (payload) => {
        console.log('[Supabase Realtime] Alteração em clients:', payload);
        if (onPayload) onPayload(payload);
        const latest = await getSupabaseClients();
        if (latest) onUpdate(latest);
      }
    )
    .subscribe((status) => {
      console.log('[Supabase Realtime clients status]:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 3. COLLABORATORS (COLABORADORES / ESPECIALISTAS)
// ==========================================

export async function getSupabaseCollaborators(tenantSlug?: string): Promise<Specialist[] | null> {
  try {
    let query = supabase.from('collaborators').select('*');
    if (tenantSlug) {
      query = query.eq('tenant_slug', tenantSlug);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Aviso ao buscar colaboradores:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id || null,
      tenantSlug: item.tenant_slug || item.tenantSlug,
      name: item.name || 'Profissional',
      role: item.role || 'Especialista',
      initials: item.initials || (item.name ? item.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'PR'),
      avatarUrl: item.avatar_url || item.avatarUrl,
      rating: item.rating ? String(item.rating) : '5.0 (20+)'
    }));
  } catch (err) {
    console.error('[Supabase] Erro de rede ao buscar colaboradores:', err);
    return null;
  }
}

/**
 * Subscription Realtime para a tabela 'collaborators'
 */
export function subscribeToCollaborators(
  onUpdate: (collaborators: Specialist[]) => void,
  onPayload?: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const channel = supabase
    .channel('realtime_collaborators')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'collaborators' },
      async (payload) => {
        console.log('[Supabase Realtime] Alteração em collaborators:', payload);
        if (onPayload) onPayload(payload);
        const latest = await getSupabaseCollaborators();
        if (latest) onUpdate(latest);
      }
    )
    .subscribe((status) => {
      console.log('[Supabase Realtime collaborators status]:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 4. SERVICES (SERVIÇOS)
// ==========================================

export async function getSupabaseServices(tenantSlug?: string): Promise<Service[] | null> {
  try {
    let query = supabase.from('services').select('*');
    if (tenantSlug) {
      query = query.eq('tenant_slug', tenantSlug);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Aviso ao buscar serviços:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id || `srv-${Math.random()}`,
      tenantSlug: item.tenant_slug || item.tenantSlug,
      name: item.name || 'Serviço',
      category: item.category || 'Geral',
      duration: Number(item.duration) || 45,
      price: Number(item.price) || 0,
      desc: item.desc || item.description || '',
      popular: Boolean(item.popular)
    }));
  } catch (err) {
    console.error('[Supabase] Erro de rede ao buscar serviços:', err);
    return null;
  }
}

/**
 * Subscription Realtime para a tabela 'services'
 */
export function subscribeToServices(
  onUpdate: (services: Service[]) => void,
  onPayload?: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const channel = supabase
    .channel('realtime_services')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'services' },
      async (payload) => {
        console.log('[Supabase Realtime] Alteração em services:', payload);
        if (onPayload) onPayload(payload);
        const latest = await getSupabaseServices();
        if (latest) onUpdate(latest);
      }
    )
    .subscribe((status) => {
      console.log('[Supabase Realtime services status]:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 5. TENANTS (ESTABELECIMENTOS)
// ==========================================

export async function getSupabaseTenants(): Promise<Tenant[] | null> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*');

    if (error) {
      console.warn('[Supabase] Aviso ao buscar tenants:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id || item.slug,
      slug: item.slug,
      name: item.name || 'Estabelecimento',
      category: item.category || 'Salão de Beleza',
      address: item.address || 'São Paulo - SP',
      phone: item.phone || '(11) 97777-8888',
      hours: item.hours || 'Ter a Sáb das 09h às 20h',
      rating: item.rating ? String(item.rating) : '4.9 ★ (100+)',
      initials: item.initials || (item.name ? item.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'ST'),
      bannerUrl: item.banner_url || item.bannerUrl || '',
      services: item.services || [],
      specialists: item.specialists || [],
      pixKey: item.pix_key || item.pixKey,
      about: item.about
    }));
  } catch (err) {
    console.error('[Supabase] Erro de rede ao buscar tenants:', err);
    return null;
  }
}

/**
 * Subscription Realtime para a tabela 'tenants'
 */
export function subscribeToTenants(
  onUpdate: (tenants: Tenant[]) => void,
  onPayload?: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const channel = supabase
    .channel('realtime_tenants')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tenants' },
      async (payload) => {
        console.log('[Supabase Realtime] Alteração em tenants:', payload);
        if (onPayload) onPayload(payload);
        const latest = await getSupabaseTenants();
        if (latest) onUpdate(latest);
      }
    )
    .subscribe((status) => {
      console.log('[Supabase Realtime tenants status]:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 6. SUBSCRIBER UNIFICADO MULTI-TABELAS
// ==========================================

export interface RealtimeSubscriptionsCallbacks {
  onAppointmentsChange?: (appointments: Appointment[], payload?: RealtimePostgresChangesPayload<any>) => void;
  onClientsChange?: (clients: Client[], payload?: RealtimePostgresChangesPayload<any>) => void;
  onCollaboratorsChange?: (collaborators: Specialist[], payload?: RealtimePostgresChangesPayload<any>) => void;
  onServicesChange?: (services: Service[], payload?: RealtimePostgresChangesPayload<any>) => void;
  onTenantsChange?: (tenants: Tenant[], payload?: RealtimePostgresChangesPayload<any>) => void;
}

/**
 * Registra listeners de postgres_changes em todas as 5 tabelas principais
 * ('appointments', 'clients', 'collaborators', 'services', 'tenants')
 * e retorna uma única função de cleanup para cancelar todas as assinaturas.
 */
export function subscribeToAllSupabaseTables(callbacks: RealtimeSubscriptionsCallbacks) {
  const unsubscribers: Array<() => void> = [];

  if (callbacks.onAppointmentsChange) {
    unsubscribers.push(
      subscribeToAppointments((data) => callbacks.onAppointmentsChange!(data))
    );
  }

  if (callbacks.onClientsChange) {
    unsubscribers.push(
      subscribeToClients((data) => callbacks.onClientsChange!(data))
    );
  }

  if (callbacks.onCollaboratorsChange) {
    unsubscribers.push(
      subscribeToCollaborators((data) => callbacks.onCollaboratorsChange!(data))
    );
  }

  if (callbacks.onServicesChange) {
    unsubscribers.push(
      subscribeToServices((data) => callbacks.onServicesChange!(data))
    );
  }

  if (callbacks.onTenantsChange) {
    unsubscribers.push(
      subscribeToTenants((data) => callbacks.onTenantsChange!(data))
    );
  }

  return () => {
    unsubscribers.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (e) {
        console.warn('Erro ao cancelar assinatura realtime:', e);
      }
    });
  };
}
