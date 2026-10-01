import React, { useState } from 'react';
import { Appointment, Tenant } from '../types/index.ts';
import { Users, Phone, Calendar, MessageCircle, Search } from 'lucide-react';
import { formatCurrency } from '../utils/storage.ts';

interface ClientsScreenProps {
  tenant: Tenant;
  appointments: Appointment[];
}

export const ClientsScreen: React.FC<ClientsScreenProps> = ({
  tenant,
  appointments
}) => {
  const [search, setSearch] = useState('');

  // Extract unique clients
  const clientMap = new Map<string, {
    name: string;
    phone: string;
    totalBookings: number;
    totalSpent: number;
    lastDate: string;
  }>();

  appointments.forEach(a => {
    const key = (a.clientPhone || a.clientName).toLowerCase();
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        name: a.clientName,
        phone: a.clientPhone,
        totalBookings: 1,
        totalSpent: a.price || 0,
        lastDate: a.date
      });
    } else {
      const existing = clientMap.get(key)!;
      existing.totalBookings += 1;
      existing.totalSpent += a.price || 0;
      if (a.date > existing.lastDate) existing.lastDate = a.date;
    }
  });

  const clients = Array.from(clientMap.values()).filter(c => 
    !search || 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="space-y-4 animate-in fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Base de Clientes</h1>
        <p className="text-xs text-[#A1A1AA] mt-0.5">
          Histórico de contatos e frequência de agendamentos
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente por nome ou WhatsApp..."
          className="w-full bg-[#121215] border border-[#222226] text-white placeholder-[#71717A] pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Client List */}
      <div className="space-y-2.5">
        {clients.length === 0 ? (
          <div className="bg-[#121215] border border-[#222226] rounded-2xl p-8 text-center">
            <Users className="w-10 h-10 text-[#3F3F46] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">Nenhum cliente cadastrado</h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              Os dados dos clientes que agendarem pelo portal aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          clients.map((c) => {
            const cleanPhone = c.phone.replace(/\D/g, '');
            return (
              <div
                key={c.phone || c.name}
                className="bg-[#121215] border border-[#222226] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {c.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{c.name}</h4>
                    <p className="text-[11px] text-[#A1A1AA] font-mono">{c.phone}</p>
                    <span className="text-[10px] text-blue-400 font-semibold block mt-0.5">
                      {c.totalBookings} {c.totalBookings === 1 ? 'atendimento' : 'atendimentos'} • {formatCurrency(c.totalSpent)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(`Olá ${c.name}! Tudo bem? Aqui é do ${tenant.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#222226] hover:bg-[#2A2A2E] text-emerald-400 border border-[#2E2E33] flex items-center justify-center flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
