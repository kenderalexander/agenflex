import { Tenant } from '../types/index.ts';

export const DEFAULT_TENANTS: Record<string, Tenant> = {
  'glamour-studio-spa': {
    id: 'tenant-vibe-01',
    slug: 'glamour-studio-spa',
    name: 'Studio Glam & Vibe',
    category: 'Salão de Beleza & Estética Capilar',
    address: 'Rua Oscar Freire, 1052 - Jardins, São Paulo - SP',
    phone: '(11) 97777-8888',
    hours: 'Segunda a Sábado: 09:00 às 20:00',
    rating: '4.9 ★ (184 avaliações)',
    initials: 'SG',
    bannerUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    about: 'Referência em tratamentos capilares personalizados, mechas iluminadas, corte visagista e spa de luxo no coração dos Jardins.',
    pixKey: 'financeiro@studioglamvibe.com.br',
    services: [
      {
        id: 'srv1',
        name: 'Mechas Balayage & Tonalização',
        category: 'Coloração',
        duration: 120,
        price: 380.0,
        desc: 'Clareamento personalizado com proteção capilar Olaplex e tonalização com nuances sofisticadas sob medida.',
        popular: true
      },
      {
        id: 'srv2',
        name: 'Corte Feminino + Hidratação Laser',
        category: 'Cabelo',
        duration: 60,
        price: 180.0,
        desc: 'Visagismo de corte com lavagem relaxante, massagem craniana e selagem profunda por fototerapia laser.',
        popular: true
      },
      {
        id: 'srv3',
        name: 'Escova Modelada & Botox Capilar',
        category: 'Cabelo',
        duration: 45,
        price: 120.0,
        desc: 'Alinhamento imediato dos fios, brilho espelhado e redução de frizz com escova modelada de alta durabilidade.'
      },
      {
        id: 'srv4',
        name: 'Corte Masculino + Barba Terapia',
        category: 'Barbearia',
        duration: 45,
        price: 90.0,
        desc: 'Corte degradê na tesoura e máquina com toalha quente aromática e barba alinhada.'
      },
      {
        id: 'srv5',
        name: 'Manicure Gel & Cutilagem Russa',
        category: 'Unhas',
        duration: 50,
        price: 85.0,
        desc: 'Cutilagem a seco de alta precisão com esmaltação em gel duradoura (até 21 dias intacta).'
      },
      {
        id: 'srv6',
        name: 'Design de Sobrancelha & Henna',
        category: 'Estética',
        duration: 35,
        price: 75.0,
        desc: 'Mapeamento facial geométrico com pinçamento minucioso e pigmento orgânico de henna.'
      },
      {
        id: 'srv7',
        name: 'Terapia Capilar Detox & Ozonioterapia',
        category: 'Tratamento',
        duration: 60,
        price: 210.0,
        desc: 'Desobstrução do bulbo capilar com vapor de ozônio e nutrição de aminoácidos para crescimento acelerado.'
      }
    ],
    specialists: [
      {
        id: null,
        name: 'Qualquer profissional / Sem preferência',
        role: 'Direcionamento presencial inteligente',
        initials: '⭐'
      },
      {
        id: 'collab-1',
        name: 'Dra. Camila Gestora',
        role: 'Master Colorista & Terapeuta Capilar',
        initials: 'CG',
        rating: '5.0 ★'
      },
      {
        id: 'collab-2',
        name: 'Lucas Rocha',
        role: 'Barbeiro & Visagista Masculino',
        initials: 'LR',
        rating: '4.9 ★'
      },
      {
        id: 'collab-3',
        name: 'Beatriz Lima',
        role: 'Nail Designer & Manicure Avançada',
        initials: 'BL',
        rating: '4.9 ★'
      }
    ]
  },
  'barbearia-vibe': {
    id: 'tenant-barb-01',
    slug: 'barbearia-vibe',
    name: 'Barbearia Vibe Style',
    category: 'Barbearia Clássica & Visagismo',
    address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
    phone: '(11) 98888-7777',
    hours: 'Segunda a Sábado: 10:00 às 21:00',
    rating: '5.0 ★ (210 avaliações)',
    initials: 'BV',
    bannerUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    about: 'Ambiente premium exclusivo com cerveja artesanal, toalha quente, navalha afiada e os melhores visagistas masculinos.',
    pixKey: 'pagamentos@barbeariavibe.com.br',
    services: [
      {
        id: 'barb1',
        name: 'Corte Fade & Visagismo',
        category: 'Cabelo',
        duration: 35,
        price: 60.0,
        desc: 'Corte degradê na tesoura e máquina com acabamento milimétrico na navalha e pomada matte.',
        popular: true
      },
      {
        id: 'barb2',
        name: 'Barba Terapia com Toalha Quente',
        category: 'Barba',
        duration: 30,
        price: 45.0,
        desc: 'Tratamento com óleos essenciais de eucalipto, massagem facial relaxante, toalha quente e lâmina descartável.',
        popular: true
      },
      {
        id: 'barb3',
        name: 'Combo Executivo: Cabelo + Barba',
        category: 'Combo',
        duration: 55,
        price: 95.0,
        desc: 'Experiência completa com corte personalizado, barba terapia e alinhamento facial completo com direito a café/bebida.',
        popular: true
      },
      {
        id: 'barb4',
        name: 'Selagem & Alinhamento Térmico',
        category: 'Química',
        duration: 45,
        price: 80.0,
        desc: 'Redução natural de volume e controle de frizz com produtos masculinos sem cheiro forte.'
      },
      {
        id: 'barb5',
        name: 'Pigmentação de Barba',
        category: 'Barba',
        duration: 25,
        price: 40.0,
        desc: 'Camuflagem de fios brancos e preenchimento harmônico de falhas com pigmento natural de efeito fosco.'
      }
    ],
    specialists: [
      {
        id: null,
        name: 'Qualquer barbeiro / Sem preferência',
        role: 'Direcionamento presencial inteligente',
        initials: '⭐'
      },
      {
        id: 'barb-1',
        name: 'Lucas Rocha',
        role: 'Barbeiro Master & Visagista',
        initials: 'LR',
        rating: '5.0 ★'
      },
      {
        id: 'barb-2',
        name: 'Carlos Eduardo',
        role: 'Especialista em Fade & Navalha',
        initials: 'CE',
        rating: '4.9 ★'
      },
      {
        id: 'barb-3',
        name: 'Rodrigo Fontes',
        role: 'Colorimetrista & Barbeiro Clássico',
        initials: 'RF',
        rating: '4.8 ★'
      }
    ]
  },
  'studio-nails-chic': {
    id: 'tenant-nails-01',
    slug: 'studio-nails-chic',
    name: 'Studio Nails Chic',
    category: 'Esmalteria & Spa dos Pés',
    address: 'Rua Augusta, 2200 - Consolação, São Paulo - SP',
    phone: '(11) 96666-5555',
    hours: 'Terça a Sábado: 09:00 às 19:00',
    rating: '4.8 ★ (95 avaliações)',
    initials: 'SN',
    bannerUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
    about: 'Especialistas em alongamentos de unhas em fibra de vidro slim, nail art contemporânea e plástica podal relaxante.',
    pixKey: 'contato@studionailschic.com.br',
    services: [
      {
        id: 'nail1',
        name: 'Alongamento em Fibra de Vidro Slim',
        category: 'Alongamento',
        duration: 90,
        price: 160.0,
        desc: 'Estrutura ultrafina, natural, resistente e leve com acabamento curvado impecável.',
        popular: true
      },
      {
        id: 'nail2',
        name: 'Esmaltação em Gel & Cutilagem Russa',
        category: 'Unhas',
        duration: 50,
        price: 85.0,
        desc: 'Cutilagem combinada a seco de alta durabilidade que não descasca por até 21 dias.',
        popular: true
      },
      {
        id: 'nail3',
        name: 'Spa dos Pés com Plástica Podal',
        category: 'Pés',
        duration: 45,
        price: 90.0,
        desc: 'Remoção de calosidades e ressecamentos, esfoliação profunda com parafina térmica e massagem relaxante.'
      },
      {
        id: 'nail4',
        name: 'Manicure Tradicional & Esfoliação',
        category: 'Unhas',
        duration: 35,
        price: 45.0,
        desc: 'Cutilagem tradicional com esmaltação premium nacional/importada e hidratação profunda das cutículas.'
      },
      {
        id: 'nail5',
        name: 'Manutenção Fibra de Vidro',
        category: 'Alongamento',
        duration: 70,
        price: 110.0,
        desc: 'Reposição da estrutura de fibra, nivelamento e novo acabamento brilhante.'
      }
    ],
    specialists: [
      {
        id: null,
        name: 'Qualquer profissional / Sem preferência',
        role: 'Direcionamento presencial inteligente',
        initials: '⭐'
      },
      {
        id: 'nail-1',
        name: 'Beatriz Lima',
        role: 'Nail Designer & Fibra de Vidro',
        initials: 'BL',
        rating: '4.9 ★'
      },
      {
        id: 'nail-2',
        name: 'Fernanda Santos',
        role: 'Especialista em Esmaltação em Gel',
        initials: 'FS',
        rating: '4.8 ★'
      }
    ]
  },
  'vibe-spa-estetica': {
    id: 'tenant-spa-01',
    slug: 'vibe-spa-estetica',
    name: 'Vibe Spa & Estética Facial',
    category: 'Clínica de Estética & Bem-Estar',
    address: 'Al. Lorena, 800 - Jardins, São Paulo - SP',
    phone: '(11) 95555-4444',
    hours: 'Segunda a Sábado: 08:30 às 20:30',
    rating: '4.9 ★ (140 avaliações)',
    initials: 'VS',
    bannerUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    about: 'Santuário de autocuidado urbano com protocolos faciais e corporais de alta tecnologia e dermocosméticos de ponta.',
    pixKey: 'agendamentos@vibespa.com.br',
    services: [
      {
        id: 'spa1',
        name: 'Limpeza de Pele Profunda com Fototerapia',
        category: 'Facial',
        duration: 75,
        price: 190.0,
        desc: 'Extração indolor de cravos, peeling de diamante, máscara de hidratação calmante e laser LED regenerador.',
        popular: true
      },
      {
        id: 'spa2',
        name: 'Massagem Relaxante com Óleos e Pedras Quentes',
        category: 'Corporal',
        duration: 60,
        price: 160.0,
        desc: 'Alívio instantâneo de dores musculares profundas com pedras vulcânicas aquecidas e aromaterapia com lavanda.',
        popular: true
      },
      {
        id: 'spa3',
        name: 'Drenagem Linfática Método Renata França',
        category: 'Corporal',
        duration: 50,
        price: 180.0,
        desc: 'Redução imediata de inchaço e retenção de líquidos com manobras exclusivas de bombeamento e modelagem.'
      },
      {
        id: 'spa4',
        name: 'Revitalização Facial com Ácido Hialurônico',
        category: 'Facial',
        duration: 50,
        price: 150.0,
        desc: 'Super hidratação dérmica com micro-infusão de sérum com ácido hialurônico e vitaminas C e E.'
      }
    ],
    specialists: [
      {
        id: null,
        name: 'Qualquer profissional / Sem preferência',
        role: 'Direcionamento presencial inteligente',
        initials: '⭐'
      },
      {
        id: 'spa-1',
        name: 'Dra. Patricia Mendes',
        role: 'Fisioterapeuta Dermato-Funcional',
        initials: 'PM',
        rating: '5.0 ★'
      },
      {
        id: 'spa-2',
        name: 'Amanda Torres',
        role: 'Massoterapeuta & Terapeuta Holística',
        initials: 'AT',
        rating: '4.9 ★'
      }
    ]
  }
};
