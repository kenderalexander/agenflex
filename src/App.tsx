import React, { useState, useEffect } from 'react';
import { Tenant, Service, Specialist, Appointment, AppointmentStatus } from './types/index.ts';
import { 
  getStoredTenants, 
  saveTenants, 
  saveSingleTenant, 
  getStoredAppointments, 
  saveAppointments,
  addAppointment, 
  updateAppointmentStatus 
} from './utils/storage.ts';
import { 
  getSupabaseAppointments, 
  getSupabaseTenants,
  subscribeToAllSupabaseTables
} from './lib/supabase.ts';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { Stepper } from './components/Stepper.tsx';
import { StepServices } from './components/StepServices.tsx';
import { StepSpecialists } from './components/StepSpecialists.tsx';
import { StepDateTime } from './components/StepDateTime.tsx';
import { StepClientData } from './components/StepClientData.tsx';
import { StepSuccess } from './components/StepSuccess.tsx';
import { ManagerDashboard } from './components/ManagerDashboard.tsx';
import { TenantDirectoryModal } from './components/TenantDirectoryModal.tsx';
import { NewTenantModal } from './components/NewTenantModal.tsx';
import { MyAppointmentsModal } from './components/MyAppointmentsModal.tsx';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Search, 
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Carrega estabelecimentos e agendamentos
  const [tenants, setTenants] = useState<Record<string, Tenant>>(() => getStoredTenants());
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStoredAppointments());
  
  // Sincronização em tempo real com Supabase (appointments, clients, collaborators, services, tenants)
  useEffect(() => {
    // 1. Busca inicial remota
    async function loadInitialRemoteData() {
      const [remoteAppointments, remoteTenants] = await Promise.all([
        getSupabaseAppointments(),
        getSupabaseTenants()
      ]);

      if (remoteAppointments && remoteAppointments.length > 0) {
        setAppointments(remoteAppointments);
        saveAppointments(remoteAppointments);
      }

      if (remoteTenants && remoteTenants.length > 0) {
        const tenantMap: Record<string, Tenant> = {};
        remoteTenants.forEach(t => {
          tenantMap[t.slug] = t;
        });
        setTenants(prev => ({ ...prev, ...tenantMap }));
        saveTenants({ ...getStoredTenants(), ...tenantMap });
      }
    }
    loadInitialRemoteData();

    // 2. Assinatura em tempo real para as 5 tabelas do PostgreSQL
    const unsubscribe = subscribeToAllSupabaseTables({
      onAppointmentsChange: (updatedAppointments) => {
        setAppointments(updatedAppointments);
        saveAppointments(updatedAppointments);
      },
      onTenantsChange: (updatedTenants) => {
        if (updatedTenants && updatedTenants.length > 0) {
          const tenantMap: Record<string, Tenant> = {};
          updatedTenants.forEach(t => {
            tenantMap[t.slug] = t;
          });
          setTenants(prev => ({ ...prev, ...tenantMap }));
          saveTenants({ ...getStoredTenants(), ...tenantMap });
        }
      },
      onServicesChange: (updatedServices) => {
        if (updatedServices && updatedServices.length > 0) {
          setTenants(prevTenants => {
            const next = { ...prevTenants };
            // Atualiza serviços dos tenants correspondentes
            Object.keys(next).forEach(slug => {
              const matched = updatedServices.filter(s => !s.tenantSlug || s.tenantSlug === slug);
              if (matched.length > 0) {
                next[slug] = { ...next[slug], services: matched };
              }
            });
            saveTenants(next);
            return next;
          });
        }
      },
      onCollaboratorsChange: (updatedCollabs) => {
        if (updatedCollabs && updatedCollabs.length > 0) {
          setTenants(prevTenants => {
            const next = { ...prevTenants };
            // Atualiza colaboradores dos tenants correspondentes
            Object.keys(next).forEach(slug => {
              const matched = updatedCollabs.filter(c => !c.tenantSlug || c.tenantSlug === slug);
              if (matched.length > 0) {
                next[slug] = { ...next[slug], specialists: matched };
              }
            });
            saveTenants(next);
            return next;
          });
        }
      },
      onClientsChange: (clients) => {
        console.log('[Supabase Realtime] Clientes atualizados:', clients.length);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  // Extrai slug inicial da URL ou hash
  const getInitialSlug = (): string => {
    const params = new URLSearchParams(window.location.search);
    const qTenant = params.get('tenant') || params.get('slug');
    if (qTenant) return qTenant.toLowerCase().trim();

    const hash = window.location.hash.replace('#', '').replace('/agendar/', '').replace('/portal/', '').trim().toLowerCase();
    if (hash && hash !== '') return hash;

    const pathname = window.location.pathname.replace('/agendar/', '').replace('/portal/', '').replace('/', '').trim().toLowerCase();
    if (pathname && !pathname.includes('.') && pathname !== '') return pathname;

    return 'glamour-studio-spa';
  };

  const [currentSlug, setCurrentSlug] = useState<string>(getInitialSlug);
  const [isManagerMode, setIsManagerMode] = useState<boolean>(false);

  // Modais
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);

  // Stepper
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);

  // Tenant atual
  const currentTenant = tenants[currentSlug] || null;

  // Estado do formulário
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'presencial' | 'pix_online'>('presencial');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Escuta hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const slug = getInitialSlug();
      if (slug && slug !== currentSlug) {
        setCurrentSlug(slug);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSlug]);

  // Especialista padrão
  useEffect(() => {
    if (currentTenant && currentTenant.specialists.length > 0) {
      if (!selectedSpecialist || !currentTenant.specialists.some(s => s.name === selectedSpecialist.name)) {
        setSelectedSpecialist(currentTenant.specialists[0]);
      }
    }
  }, [currentSlug, currentTenant]);

  const handleSelectTenant = (slug: string) => {
    setCurrentSlug(slug);
    setIsDirectoryOpen(false);
    handleResetBooking();
    window.location.hash = `/agendar/${slug}`;
  };

  const handleCreateTenant = (newTenant: Tenant) => {
    saveSingleTenant(newTenant);
    setTenants(getStoredTenants());
    setCurrentSlug(newTenant.slug);
    setIsNewTenantOpen(false);
    handleResetBooking();
    window.location.hash = `/agendar/${newTenant.slug}`;
  };

  const handleUpdateTenant = (updatedTenant: Tenant) => {
    saveSingleTenant(updatedTenant);
    setTenants(getStoredTenants());
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    updateAppointmentStatus(id, status);
    setAppointments(getStoredAppointments());
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= maxReachedStep) {
      setCurrentStep(targetStep);
      setValidationError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!selectedService) {
        setValidationError('Por favor, selecione um serviço para continuar.');
        return;
      }
      setCurrentStep(2);
      setMaxReachedStep(Math.max(maxReachedStep, 2));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 2) {
      if (!selectedSpecialist) {
        setValidationError('Por favor, escolha um profissional.');
        return;
      }
      setCurrentStep(3);
      setMaxReachedStep(Math.max(maxReachedStep, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 3) {
      if (!selectedTime) {
        setValidationError('Por favor, selecione um horário disponível na lista.');
        return;
      }
      setCurrentStep(4);
      setMaxReachedStep(Math.max(maxReachedStep, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 4) {
      handleSubmitBooking();
    }
  };

  const handleGoToPreviousStep = () => {
    if (currentStep > 1) {
      setValidationError(null);
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitBooking = () => {
    setValidationError(null);

    if (!clientName.trim()) {
      setValidationError('Por favor, digite seu Nome Completo.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.replace(/\D/g, '').length < 10) {
      setValidationError('Por favor, informe um número de WhatsApp válido com DDD.');
      return;
    }
    if (!selectedService || !selectedSpecialist || !currentTenant) return;

    setIsSubmitting(true);

    const bookingId = `VB-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAppt: Appointment = {
      id: bookingId,
      tenantSlug: currentTenant.slug,
      tenantName: currentTenant.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      serviceCategory: selectedService.category,
      duration: selectedService.duration,
      price: selectedService.price,
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      date: selectedDate,
      time: selectedTime || '14:00',
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes.trim() || undefined,
      paymentMethod: paymentMethod,
      status: 'confirmado',
      createdAt: new Date().toISOString()
    };

    addAppointment(newAppt);
    setAppointments(getStoredAppointments());
    setConfirmedAppointment(newAppt);

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleResetBooking = () => {
    setCurrentStep(1);
    setMaxReachedStep(1);
    setSelectedService(null);
    setSelectedTime(null);
    setConfirmedAppointment(null);
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fallback se o tenant não existir
  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#FFFFFF] flex items-center justify-center p-4">
        <div className="bg-[#141416] border border-[#222226] rounded-[16px] max-w-sm w-full p-6 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 bg-[#1A1A1E] border border-[#222226] rounded-xl flex items-center justify-center mx-auto text-[#8E8E93]">
            <Search className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#FFFFFF]">
              Estabelecimento Não Encontrado
            </h1>
            <p className="text-xs text-[#8E8E93] mt-1">
              Não encontramos o salão: /agendar/{currentSlug}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {Object.values(tenants).slice(0, 3).map(t => (
              <button
                key={t.slug}
                onClick={() => handleSelectTenant(t.slug)}
                className="w-full p-2.5 bg-[#1A1A1E] hover:bg-[#3A4D6F] border border-[#222226] text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all"
              >
                <span>{t.name}</span>
                <span className="text-[#8E8E93] text-[10px]">{t.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#FFFFFF] flex flex-col selection:bg-[#3A4D6F] selection:text-white pb-28">
      {/* Header Sticky Mobile */}
      <Header tenant={currentTenant} />

      {/* Main Container Mobile-First (Otimizado para Smartphones) */}
      {isManagerMode ? (
        <main className="max-w-md mx-auto px-3.5 pt-3 flex-1 w-full">
          <ManagerDashboard
            tenant={currentTenant}
            onUpdateTenant={handleUpdateTenant}
            appointments={appointments}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onCloseManagerMode={() => setIsManagerMode(false)}
          />
        </main>
      ) : (
        <main className="max-w-md mx-auto px-3.5 flex-1 w-full">
          {/* Cartão de Apresentação Mobile */}
          <HeroBanner tenant={currentTenant} />

          {/* Stepper de Progresso Mobile */}
          <div className="pt-2">
            <Stepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
              maxReachedStep={maxReachedStep}
            />

            {/* Banner de Validação */}
            {validationError && (
              <div className="mb-3 p-3 bg-[#1A1A1E] border border-rose-500/40 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* ETAPA 1: Serviços */}
            {currentStep === 1 && (
              <StepServices
                services={currentTenant.services}
                selectedService={selectedService}
                onSelectService={(service) => {
                  setSelectedService(service);
                  setValidationError(null);
                }}
                tenantName={currentTenant.name}
              />
            )}

            {/* ETAPA 2: Especialistas */}
            {currentStep === 2 && (
              <StepSpecialists
                specialists={currentTenant.specialists}
                selectedSpecialist={selectedSpecialist}
                onSelectSpecialist={(specialist) => {
                  setSelectedSpecialist(specialist);
                  setValidationError(null);
                }}
                selectedService={selectedService}
              />
            )}

            {/* ETAPA 3: Data e Horário */}
            {currentStep === 3 && (
              <StepDateTime
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setValidationError(null);
                }}
                onSelectTime={(time) => {
                  setSelectedTime(time);
                  setValidationError(null);
                }}
                existingAppointments={appointments}
                tenantSlug={currentTenant.slug}
              />
            )}

            {/* ETAPA 4: Dados do Cliente */}
            {currentStep === 4 && selectedService && selectedSpecialist && (
              <StepClientData
                tenant={currentTenant}
                service={selectedService}
                specialist={selectedSpecialist}
                date={selectedDate}
                time={selectedTime || '14:00'}
                clientName={clientName}
                clientPhone={clientPhone}
                clientNotes={clientNotes}
                paymentMethod={paymentMethod}
                onChangeClientName={(val) => {
                  setClientName(val);
                  setValidationError(null);
                }}
                onChangeClientPhone={(val) => {
                  setClientPhone(val);
                  setValidationError(null);
                }}
                onChangeClientNotes={setClientNotes}
                onChangePaymentMethod={setPaymentMethod}
                onSubmitBooking={handleSubmitBooking}
                isSubmitting={isSubmitting}
              />
            )}

            {/* ETAPA 5: Sucesso */}
            {currentStep === 5 && confirmedAppointment && (
              <StepSuccess
                appointment={confirmedAppointment}
                tenant={currentTenant}
                onReset={handleResetBooking}
                onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
              />
            )}
          </div>
        </main>
      )}

      {/* Barra de Ação Inferior Fixa (Sticky Mobile Footer) */}
      {!isManagerMode && currentStep < 5 && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#141416]/95 backdrop-blur-md border-t border-[#222226] p-3">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
            {/* Botão Voltar */}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleGoToPreviousStep}
                className="px-3.5 py-3 rounded-xl bg-[#1A1A1E] border border-[#222226] hover:bg-[#222226] text-[#8E8E93] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}

            {/* Botão Avançar / Confirmar */}
            <button
              type="button"
              onClick={handleGoToNextStep}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedSpecialist) ||
                (currentStep === 3 && !selectedTime) ||
                isSubmitting
              }
              className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedSpecialist) ||
                (currentStep === 3 && !selectedTime) ||
                isSubmitting
                  ? 'bg-[#1A1A1E] text-[#8E8E93] opacity-40 cursor-not-allowed border border-[#222226]'
                  : 'bg-[#3A4D6F] hover:bg-[#4A5D80] text-white shadow-sm active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <span>Confirmando...</span>
              ) : currentStep === 1 ? (
                <>
                  <span>Escolher Profissional</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : currentStep === 2 ? (
                <>
                  <span>Escolher Horário</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : currentStep === 3 ? (
                <>
                  <span>Preencher Dados</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirmar Agendamento</span>
                </>
              )}
            </button>
          </div>
        </footer>
      )}

      {/* Modais com o mesmo tema escuro e azul aço */}
      <TenantDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        tenants={tenants}
        currentSlug={currentSlug}
        onSelectTenant={handleSelectTenant}
        onOpenNewTenantModal={() => setIsNewTenantOpen(true)}
      />

      <NewTenantModal
        isOpen={isNewTenantOpen}
        onClose={() => setIsNewTenantOpen(false)}
        onCreateTenant={handleCreateTenant}
      />

      <MyAppointmentsModal
        isOpen={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        appointments={appointments}
        tenants={tenants}
        onCancelAppointment={(id) => handleUpdateAppointmentStatus(id, 'cancelado')}
      />
    </div>
  );
}
