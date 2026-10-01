export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // minutes
  price: number;
  desc: string;
  popular?: boolean;
}

export interface Specialist {
  id: string | null;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  rating?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  rating: string;
  initials: string;
  bannerUrl: string;
  services: Service[];
  specialists: Specialist[];
  pixKey?: string;
  about?: string;
}

export type AppointmentStatus = 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado';

export interface Appointment {
  id: string;
  tenantSlug: string;
  tenantName: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  duration: number;
  price: number;
  specialistId: string | null;
  specialistName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  paymentMethod?: 'presencial' | 'pix_online';
  status: AppointmentStatus;
  createdAt: string;
}
