import React, { useState } from 'react';
import { Tenant, Appointment, Service, Specialist, AppointmentStatus } from '../types/index.ts';
import { formatCurrency, formatDatePtBR } from '../utils/storage.ts';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  MessageCircle, 
  ExternalLink,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';

interface ManagerDashboardProps {
  tenant: Tenant;
  onUpdateTenant: (updatedTenant: Tenant) => void;
  appointments: Appointment[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onCloseManagerMode: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  tenant,
  onUpdateTenant,
  appointments,
  onUpdateAppointmentStatus,
  onCloseManagerMode
}) => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'servicos' | 'equipe' | 'config'>('agenda');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Service form state
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Cabelo');
  const [servicePrice, setServicePrice] = useState('120');
  const [serviceDuration, setServiceDuration] = useState('45');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePopular, setServicePopular] = useState(false);

  // Specialist form state
  const [isAddingSpecialist, setIsAddingSpecialist] = useState(false);
  const [specialistName, setSpecialistName] = useState('');
  const [specialistRole, setSpecialistRole] = useState('');

  // Settings form state
  const [settingsName, setSettingsName] = useState(tenant.name);
  const [settingsCategory, setSettingsCategory] = useState(tenant.category);
  const [settingsAddress, setSettingsAddress] = useState(tenant.address);
  const [settingsPhone, setSettingsPhone] = useState(tenant.phone);
  const [settingsHours, setSettingsHours] = useState(tenant.hours);
  const [settingsPixKey, setSettingsPixKey] = useState(tenant.pixKey || '');
  const [settingsBannerUrl, setSettingsBannerUrl] = useState(tenant.bannerUrl);
  const [settingsAbout, setSettingsAbout] = useState(tenant.about || '');
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Filter appointments for this tenant
  const tenantAppointments = appointments.filter(a => a.tenantSlug === tenant.slug);
  const filteredAppointments = tenantAppointments.filter(a => {
    if (statusFilter === 'todos') return true;
    return a.status === statusFilter;
  });

  // Financial and queue statistics
  const totalRevenue = tenantAppointments
    .filter(a => a.status !== 'cancelado')
    .reduce((sum, a) => sum + a.price, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const appointmentsToday = tenantAppointments.filter(a => a.date === todayStr && a.status !== 'cancelado').length;

  // Add new service handler
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const newService: Service = {
      id: 'srv-' + Date.now(),
      name: serviceName.trim(),
      category: serviceCategory.trim() || 'Serviço',
      price: parseFloat(servicePrice) || 50,
      duration: parseInt(serviceDuration, 10) || 30,
      desc: serviceDesc.trim() || 'Atendimento profissional personalizado.',
      popular: servicePopular
    };

    const updated = {
      ...tenant,
      services: [newService, ...tenant.services]
    };
    onUpdateTenant(updated);

    // Reset form
    setServiceName('');
    setServiceDesc('');
    setIsAddingService(false);
  };

  const handleDeleteService = (serviceId: string) => {
    const updated = {
      ...tenant,
      services: tenant.services.filter(s => s.id !== serviceId)
    };
    onUpdateTenant(updated);
  };

  // Add specialist handler
  const handleAddSpecialist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialistName.trim()) return;

    const initials = specialistName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('') || 'SP';

    const newSpecialist: Specialist = {
      id: 'collab-' + Date.now(),
      name: specialistName.trim(),
      role: specialistRole.trim() || 'Especialista',
      initials: initials,
      rating: '5.0 ★'
    };

    const updated = {
      ...tenant,
      specialists: [...tenant.specialists, newSpecialist]
    };
    onUpdateTenant(updated);

    setSpecialistName('');
    setSpecialistRole('');
    setIsAddingSpecialist(false);
  };

  const handleDeleteSpecialist = (specialistId: string | null) => {
    if (!specialistId) return; // cannot delete 'any'
    const updated = {
      ...tenant,
      specialists: tenant.specialists.filter(s => s.id !== specialistId)
    };
    onUpdateTenant(updated);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = settingsName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('') || 'VS';

    const updated: Tenant = {
      ...tenant,
      name: settingsName.trim(),
      category: settingsCategory.trim(),
      address: settingsAddress.trim(),
      phone: settingsPhone.trim(),
      hours: settingsHours.trim(),
      pixKey: settingsPixKey.trim(),
      bannerUrl: settingsBannerUrl.trim(),
      about: settingsAbout.trim(),
      initials: initials
    };
    onUpdateTenant(updated);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner & Mode Notice */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#151D2F] to-indigo-950/60 border border-purple-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Modo Gestão
            </span>
            <span className="text-xs text-purple-300 font-bold">{tenant.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Painel Administrativo do Estabelecimento
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie atendimentos, serviços, equipe e configurações da sua página pública.
          </p>
        </div>

        <button
          onClick={onCloseManagerMode}
          className="px-4 py-2.5 bg-[#222F46] hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto flex-shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-purple-400" />
          <span>Ver Portal do Cliente</span>
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Bookings */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">Total Reservas</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {tenantAppointments.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Na base deste salão</span>
        </div>

        {/* Expected Revenue */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">Receita Prevista</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[10px] text-emerald-500/80 mt-1 block">Agendamentos ativos</span>
        </div>

        {/* Today */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">Hoje</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {appointmentsToday}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Atendimentos previstos</span>
        </div>

        {/* Services Count */}
        <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">Serviços Ativos</span>
            <Scissors className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {tenant.services.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{tenant.specialists.length} profissionais</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[#222F46] no-scrollbar">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'agenda'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-[#151D2F] text-slate-400 hover:text-white border border-[#222F46]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda & Atendimentos</span>
          {tenantAppointments.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-200 text-[10px]">
              {tenantAppointments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('servicos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'servicos'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-[#151D2F] text-slate-400 hover:text-white border border-[#222F46]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Catálogo de Serviços ({tenant.services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('equipe')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'equipe'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-[#151D2F] text-slate-400 hover:text-white border border-[#222F46]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Equipe ({tenant.specialists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'config'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-[#151D2F] text-slate-400 hover:text-white border border-[#222F46]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações do Estabelecimento</span>
        </button>
      </div>

      {/* TAB 1: AGENDA & ATENDIMENTOS */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['todos', 'confirmado', 'em_atendimento', 'concluido', 'cancelado'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#151D2F] text-slate-400 hover:text-slate-200 border border-[#222F46]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">
              Mostrando {filteredAppointments.length} de {tenantAppointments.length} agendamentos
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-300">Nenhum agendamento neste filtro</h3>
              <p className="text-xs text-slate-500 mt-1">
                Novos agendamentos feitos na página pública aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appt) => {
                const cleanPhone = appt.clientPhone.replace(/\D/g, '');
                const clientWhatsAppMsg = encodeURIComponent(`Olá ${appt.clientName}! Aqui é do ${tenant.name}. Estamos confirmando seu horário para ${formatDatePtBR(appt.date)} às ${appt.time} (${appt.serviceName}).`);

                return (
                  <div
                    key={appt.id}
                    className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                          {appt.id}
                        </span>
                        <span
                          className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            appt.status === 'confirmado'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : appt.status === 'em_atendimento'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : appt.status === 'concluido'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {appt.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDatePtBR(appt.date)} às <strong className="text-white">{appt.time}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">{appt.clientName}</h4>
                        <span className="text-xs text-slate-400 font-mono">({appt.clientPhone})</span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                        <span>✂️ {appt.serviceName} ({appt.duration} min)</span>
                        <span>👤 {appt.specialistName}</span>
                        <strong className="text-emerald-400">{formatCurrency(appt.price)}</strong>
                      </div>

                      {appt.clientNotes && (
                        <p className="text-xs text-amber-200/80 bg-amber-950/20 p-2 rounded-lg border border-amber-900/30 mt-1">
                          💬 Obs: {appt.clientNotes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 border-[#222F46] pt-3 md:pt-0">
                      {/* WhatsApp Client */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${clientWhatsAppMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Chamar WhatsApp</span>
                      </a>

                      {/* Status Dropdown / Controls */}
                      <select
                        value={appt.status}
                        onChange={(e) => onUpdateAppointmentStatus(appt.id, e.target.value as AppointmentStatus)}
                        className="bg-[#0B0F19] border border-[#222F46] text-xs text-slate-200 font-bold px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                      >
                        <option value="confirmado">Confirmado</option>
                        <option value="em_atendimento">Em Atendimento</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATÁLOGO DE SERVIÇOS */}
      {activeTab === 'servicos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Serviços Oferecidos</h3>
            <button
              onClick={() => setIsAddingService(!isAddingService)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingService ? 'Fechar Formulário' : 'Novo Serviço'}</span>
            </button>
          </div>

          {/* Add Service Form */}
          {isAddingService && (
            <form onSubmit={handleAddService} className="bg-[#151D2F] border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-purple-300">Cadastrar Novo Serviço</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Procedimento *</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Ex: Escova Orgânica Alinhada"
                    className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoria *</label>
                  <input
                    type="text"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    placeholder="Ex: Cabelo, Barba, Unhas, Estética..."
                    className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duração (Minutos) *</label>
                  <input
                    type="number"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    placeholder="45"
                    className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Descrição Detalhada</label>
                <textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Explique o que inclui o serviço, benefícios, produtos utilizados..."
                  rows={2}
                  className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={servicePopular}
                  onChange={(e) => setServicePopular(e.target.checked)}
                  className="rounded border-[#222F46] text-purple-600 focus:ring-purple-500 bg-[#0B0F19]"
                />
                <label htmlFor="popularCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Destacar como "Mais Pedido" ⭐
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="px-4 py-2 bg-[#222F46] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          )}

          {/* List of services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tenant.services.map((s) => (
              <div
                key={s.id}
                className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                      {s.category}
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatCurrency(s.price)}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">{s.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.desc}</p>
                  <span className="text-[11px] text-slate-500 mt-2 block">⏱️ Duração: {s.duration} min</span>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#222F46]">
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Excluir serviço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EQUIPE */}
      {activeTab === 'equipe' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Especialistas e Profissionais</h3>
            <button
              onClick={() => setIsAddingSpecialist(!isAddingSpecialist)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingSpecialist ? 'Fechar' : 'Novo Colaborador'}</span>
            </button>
          </div>

          {isAddingSpecialist && (
            <form onSubmit={handleAddSpecialist} className="bg-[#151D2F] border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-3 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-purple-300">Cadastrar Profissional</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={specialistName}
                    onChange={(e) => setSpecialistName(e.target.value)}
                    placeholder="Ex: Juliana Vasconcelos"
                    className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Especialidade / Cargo *</label>
                  <input
                    type="text"
                    value={specialistRole}
                    onChange={(e) => setSpecialistRole(e.target.value)}
                    placeholder="Ex: Colorista Master & Mega Hair"
                    className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingSpecialist(false)}
                  className="px-4 py-2 bg-[#222F46] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tenant.specialists.map((sp) => (
              <div
                key={sp.name}
                className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#222F46] text-slate-200 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                    {sp.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">{sp.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{sp.role}</p>
                  </div>
                </div>

                {sp.id !== null && (
                  <button
                    onClick={() => handleDeleteSpecialist(sp.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Remover colaborador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURAÇÕES */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveSettings} className="bg-[#151D2F] border border-[#222F46] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222F46] pb-3">
            <h3 className="text-sm font-extrabold text-white">Dados do Estabelecimento</h3>
            {savedSettingsSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Salvo com sucesso!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Estabelecimento *</label>
              <input
                type="text"
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Segmento / Categoria *</label>
              <input
                type="text"
                value={settingsCategory}
                onChange={(e) => setSettingsCategory(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Endereço Completo *</label>
              <input
                type="text"
                value={settingsAddress}
                onChange={(e) => setSettingsAddress(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp de Atendimento *</label>
              <input
                type="text"
                value={settingsPhone}
                onChange={(e) => setSettingsPhone(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Horário de Funcionamento *</label>
              <input
                type="text"
                value={settingsHours}
                onChange={(e) => setSettingsHours(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Chave Pix (Opcional)</label>
              <input
                type="text"
                value={settingsPixKey}
                onChange={(e) => setSettingsPixKey(e.target.value)}
                placeholder="Ex: CNPJ, email ou telefone"
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">URL da Foto de Capa (Banner)</label>
              <input
                type="text"
                value={settingsBannerUrl}
                onChange={(e) => setSettingsBannerUrl(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Sobre o Estabelecimento</label>
              <textarea
                value={settingsAbout}
                onChange={(e) => setSettingsAbout(e.target.value)}
                rows={2}
                className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#222F46]">
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-900/30"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
