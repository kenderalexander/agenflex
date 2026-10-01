import React, { useState } from 'react';
import { Tenant, Service, Specialist } from '../types/index.ts';
import { Building2, X, Sparkles, Check, Scissors, MapPin, Phone } from 'lucide-react';

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTenant: (newTenant: Tenant) => void;
}

export const NewTenantModal: React.FC<NewTenantModalProps> = ({
  isOpen,
  onClose,
  onCreateTenant
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [templateType, setTemplateType] = useState<'salao' | 'barbearia' | 'unhas' | 'spa'>('salao');
  const [address, setAddress] = useState('Rua das Flores, 450 - Centro, São Paulo - SP');
  const [phone, setPhone] = useState('(11) 97777-5555');
  const [hours, setHours] = useState('Segunda a Sábado: 09:00 às 19:30');

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('') || 'VB';

    let services: Service[] = [];
    let specialists: Specialist[] = [
      { id: null, name: 'Qualquer profissional / Sem preferência', role: 'Direcionamento presencial inteligente', initials: '⭐' }
    ];
    let category = 'Salão & Estética';
    let bannerUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';

    if (templateType === 'salao') {
      category = 'Salão de Beleza & Cabelo';
      bannerUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';
      services = [
        { id: 's1', name: 'Corte Feminino & Escova Modelada', category: 'Cabelo', duration: 60, price: 140.0, desc: 'Lavagem relaxante, corte visagista e finalização glam.', popular: true },
        { id: 's2', name: 'Mechas & Iluminação de Fios', category: 'Coloração', duration: 120, price: 320.0, desc: 'Clareamento com proteção e tonalização sob medida.', popular: true },
        { id: 's3', name: 'Hidratação Profunda & Botox', category: 'Tratamento', duration: 45, price: 110.0, desc: 'Reposição de massa e brilho espelhado.' }
      ];
      specialists.push(
        { id: 'c1', name: 'Juliana Vasconcelos', role: 'Colorista Master', initials: 'JV', rating: '5.0 ★' },
        { id: 'c2', name: 'Marcio Silva', role: 'Cabeleireiro & Visagista', initials: 'MS', rating: '4.9 ★' }
      );
    } else if (templateType === 'barbearia') {
      category = 'Barbearia Clássica & Visagismo';
      bannerUrl = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80';
      services = [
        { id: 'b1', name: 'Corte Degradê / Fade Navalhado', category: 'Cabelo', duration: 35, price: 55.0, desc: 'Acabamento perfeito na tesoura e máquina.', popular: true },
        { id: 'b2', name: 'Barba com Toalha Quente & Ozônio', category: 'Barba', duration: 30, price: 45.0, desc: 'Toalha aquecida, óleos essenciais e massagem.', popular: true },
        { id: 'b3', name: 'Combo Cabelo + Barba Completo', category: 'Combo', duration: 55, price: 90.0, desc: 'Experiência executiva completa com finalização.', popular: true }
      ];
      specialists.push(
        { id: 'c1', name: 'Gabriel Barbeiro', role: 'Master Barber', initials: 'GB', rating: '5.0 ★' }
      );
    } else if (templateType === 'unhas') {
      category = 'Esmalteria & Nail Bar';
      bannerUrl = 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80';
      services = [
        { id: 'u1', name: 'Alongamento em Fibra de Vidro', category: 'Alongamento', duration: 90, price: 150.0, desc: 'Estrutura leve e natural de altíssima durabilidade.', popular: true },
        { id: 'u2', name: 'Esmaltação em Gel & Cutilagem Russa', category: 'Unhas', duration: 50, price: 80.0, desc: 'Acabamento impecável que dura semanas.' },
        { id: 'u3', name: 'Spa dos Pés Hidratante', category: 'Pés', duration: 40, price: 75.0, desc: 'Remoção de calosidades e massagem relaxante.' }
      ];
      specialists.push(
        { id: 'c1', name: 'Renata Nail Designer', role: 'Especialista em Fibra de Vidro', initials: 'RN', rating: '5.0 ★' }
      );
    } else {
      category = 'Spa & Clínica de Estética';
      bannerUrl = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80';
      services = [
        { id: 'sp1', name: 'Limpeza de Pele Profunda', category: 'Facial', duration: 75, price: 180.0, desc: 'Extração, peeling de diamante e fototerapia LED.', popular: true },
        { id: 'sp2', name: 'Massagem Relaxante com Aromaterapia', category: 'Corporal', duration: 60, price: 150.0, desc: 'Alívio de tensões com óleos essenciais puros.', popular: true }
      ];
      specialists.push(
        { id: 'c1', name: 'Dra. Luiza Esteticista', role: 'Dermato Funcional', initials: 'LE', rating: '5.0 ★' }
      );
    }

    const newTenant: Tenant = {
      id: 'tenant-' + Date.now(),
      slug: slug.trim().toLowerCase(),
      name: name.trim(),
      category: category,
      address: address.trim(),
      phone: phone.trim(),
      hours: hours.trim(),
      rating: '5.0 ★ (Novo na Vibe Style)',
      initials: initials,
      bannerUrl: bannerUrl,
      services: services,
      specialists: specialists,
      about: `Bem-vindo ao ${name.trim()}! Agende seu horário online de forma simples e rápida.`
    };

    onCreateTenant(newTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#151D2F] border border-[#222F46] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222F46] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Criar Estabelecimento</h2>
              <p className="text-xs text-slate-400">Configure sua página de agendamento em segundos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222F46] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Estabelecimento *</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Ex: Studio Bela Moça, Barbearia Nobre..."
              className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Identificador de URL (Slug) *</label>
            <div className="flex items-center bg-[#0B0F19] border border-[#222F46] rounded-xl px-3 py-2 text-xs font-mono text-slate-400">
              <span>vibe.style/agendar/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="meu-negocio"
                className="bg-transparent text-purple-400 font-bold outline-none flex-1 ml-0.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tipo de Estabelecimento</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'salao', label: '✨ Salão de Beleza' },
                { id: 'barbearia', label: '💈 Barbearia' },
                { id: 'unhas', label: '💅 Esmalteria' },
                { id: 'spa', label: '🌿 Spa & Estética' }
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateType(tpl.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    templateType === tpl.id
                      ? 'border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500'
                      : 'border-[#222F46] bg-[#0B0F19] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Endereço Completo</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp de Contato</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#0B0F19] border border-[#222F46] focus:border-purple-500 text-white text-xs p-2.5 rounded-xl outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#222F46]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#222F46] text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-900/30"
            >
              Criar & Abrir Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
