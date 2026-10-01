import React, { useState, useEffect } from 'react';
import { Tenant, Service, Specialist, Appointment, AppointmentStatus } from './types/index.ts';
import { 
  getStoredTenants, 
  saveTenants, 
  saveSingleTenant, 
  getStoredAppointments, 
  addAppointment, 
  updateAppointmentStatus 
} from './utils/storage.ts';
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
  Sparkles, 
  Building2, 
  Search, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Load tenants and appointments from storage
  const [tenants, setTenants] = useState<Record<string, Tenant>>(() => getStoredTenants());
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStoredAppointments());
  
  // Extract initial slug from URL query or hash
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

  // Modals state
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);

  // Stepper state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);

  // Current Tenant
  const currentTenant = tenants[currentSlug] || null;

  // Booking Form State
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

  // Listen to hash changes for deep linking
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

  // Set default specialist when tenant changes
  useEffect(() => {
    if (currentTenant && currentTenant.specialists.length > 0) {
      setSelectedSpecialist(currentTenant.specialists[0]);
    }
    // Reset booking state when tenant changes
    setCurrentStep(1);
    setMaxReachedStep(1);
    setSelectedService(null);
    setSelectedTime(null);
    setConfirmedAppointment(null);
  }, [currentSlug]);

  // Switch tenant
  const handleSelectTenant = (slug: string) => {
    window.location.hash = slug;
    setCurrentSlug(slug);
    setIsManagerMode(false);
  };

  // Create new tenant
  const handleCreateTenant = (newTenant: Tenant) => {
    saveSingleTenant(newTenant);
    const updated = { ...tenants, [newTenant.slug]: newTenant };
    setTenants(updated);
    setCurrentSlug(newTenant.slug);
    window.location.hash = newTenant.slug;
  };

  // Update tenant from manager dashboard
  const handleUpdateTenant = (updated: Tenant) => {
    saveSingleTenant(updated);
    setTenants(prev => ({ ...prev, [updated.slug]: updated }));
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    updateAppointmentStatus(id, status);
    setAppointments(getStoredAppointments());
  };

  // Step transitions
  const handleGoToNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!selectedService) {
        setValidationError('Por favor, selecione um serviço para continuar.');
        return;
      }
      setCurrentStep(2);
      setMaxReachedStep(prev => Math.max(prev, 2));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!selectedSpecialist) {
        setValidationError('Por favor, selecione um profissional ou a opção "Qualquer profissional".');
        return;
      }
      setCurrentStep(3);
      setMaxReachedStep(prev => Math.max(prev, 3));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else if (currentStep === 3) {
      if (!selectedDate || !selectedTime) {
        setValidationError('Por favor, selecione um dia e um horário disponível.');
        return;
      }
      setCurrentStep(4);
      setMaxReachedStep(prev => Math.max(prev, 4));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else if (currentStep === 4) {
      handleSubmitBooking();
    }
  };

  const handleGoToPreviousStep = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId: number) => {
    setValidationError(null);
    if (stepId <= maxReachedStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Confirm booking
  const handleSubmitBooking = () => {
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

    // Save to storage
    addAppointment(newAppt);
    setAppointments(getStoredAppointments());
    setConfirmedAppointment(newAppt);

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(5);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 400);
  };

  // Reset for new booking
  const handleResetBooking = () => {
    setCurrentStep(1);
    setMaxReachedStep(1);
    setSelectedService(null);
    setSelectedTime(null);
    setConfirmedAppointment(null);
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fallback 404 View if tenant is not found
  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-[#151D2F] border border-[#222F46] rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <Search className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-rose-400">
              Estabelecimento Não Encontrado
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Não encontramos nenhum negócio cadastrado com o identificador:
            </p>
            <div className="mt-2 inline-block bg-[#0B0F19] text-purple-400 border border-purple-500/30 px-3 py-1 rounded-lg font-mono text-xs font-bold">
              /agendar/{currentSlug}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Selecione um dos estabelecimentos parceiros em destaque para agendar:
          </p>

          <div className="space-y-2 pt-2">
            {Object.values(tenants).slice(0, 4).map(t => (
              <button
                key={t.slug}
                onClick={() => handleSelectTenant(t.slug)}
                className="w-full p-3 bg-[#0B0F19] hover:bg-[#1f2a42] border border-[#222F46] hover:border-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all"
              >
                <span>✨ {t.name}</span>
                <span className="text-slate-400 font-normal">{t.category}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewTenantOpen(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            + Cadastrar Meu Salão Agora
          </button>
        </div>

        <NewTenantModal
          isOpen={isNewTenantOpen}
          onClose={() => setIsNewTenantOpen(false)}
          onCreateTenant={handleCreateTenant}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col selection:bg-purple-600 selection:text-white pb-24">
      {/* Top Header Navbar */}
      <Header tenant={currentTenant} />

      {/* Main Content Area */}
      {isManagerMode ? (
        <main className="max-w-4xl mx-auto px-4 pt-4 flex-1 w-full">
          <ManagerDashboard
            tenant={currentTenant}
            onUpdateTenant={handleUpdateTenant}
            appointments={appointments}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onCloseManagerMode={() => setIsManagerMode(false)}
          />
        </main>
      ) : (
        <main className="max-w-3xl mx-auto flex-1 w-full">
          {/* Contêiner de Apresentação Limpo do Estabelecimento */}
          <HeroBanner tenant={currentTenant} />

          {/* Stepper and Booking Flow (Foco Direto nas Opções) */}
          <div className="px-3 sm:px-4 pt-2">
            {/* Stepper Navigation */}
            <Stepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
              maxReachedStep={maxReachedStep}
            />

            {/* Validation Notice Banner */}
            {validationError && (
              <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: Services (Opções de Escolha do Cliente) */}
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

            {/* STEP 2: Specialists */}
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

            {/* STEP 3: Date and Time */}
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

            {/* STEP 4: Client Identification */}
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

            {/* STEP 5: Success & Receipt */}
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

      {/* Sticky Bottom Action Bar (when not in success step and not in manager mode) */}
      {!isManagerMode && currentStep < 5 && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#151D2F]/95 backdrop-blur-md border-t border-[#222F46] p-3 sm:p-4 shadow-2xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            {/* Back Button */}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleGoToPreviousStep}
                className="px-4 py-3 rounded-xl bg-[#222F46] hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            )}

            {/* Summary preview on mobile/desktop */}
            <div className="hidden sm:flex flex-col text-left">
              {selectedService && (
                <span className="text-xs font-extrabold text-white truncate">
                  {selectedService.name}
                </span>
              )}
              {selectedTime && (
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {selectedDate.split('-').reverse().slice(0, 2).join('/')} às {selectedTime}
                </span>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleGoToNextStep}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedSpecialist) ||
                (currentStep === 3 && !selectedTime) ||
                isSubmitting
              }
              className={`flex-1 sm:flex-initial sm:min-w-[220px] py-3.5 px-6 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedSpecialist) ||
                (currentStep === 3 && !selectedTime) ||
                isSubmitting
                  ? 'bg-[#222F46] text-slate-500 cursor-not-allowed border border-slate-800'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40 hover:scale-[1.01]'
              }`}
            >
              {isSubmitting ? (
                <span>Confirmando Reserva...</span>
              ) : currentStep === 1 ? (
                <>
                  <span>Escolher Profissional</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : currentStep === 2 ? (
                <>
                  <span>Escolher Horário</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : currentStep === 3 ? (
                <>
                  <span>Preencher Identificação</span>
                  <ArrowRight className="w-4 h-4" />
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

      {/* Directory & Switcher Modal */}
      <TenantDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        tenants={tenants}
        currentSlug={currentSlug}
        onSelectTenant={handleSelectTenant}
        onOpenNewTenantModal={() => setIsNewTenantOpen(true)}
      />

      {/* New Salon Creation Modal */}
      <NewTenantModal
        isOpen={isNewTenantOpen}
        onClose={() => setIsNewTenantOpen(false)}
        onCreateTenant={handleCreateTenant}
      />

      {/* Client's Bookings History Modal */}
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
