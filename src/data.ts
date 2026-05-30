import { Institution, Leader, ReligiousEvent, UserSession } from './types';

// Real municipalities of the Huambo Province, Angola
export const HUAMBO_MUNICIPALITIES = [
  'Huambo',
  'Caála',
  'Bailundo',
  'Cachiungo',
  'Ecunha',
  'Londuimbali',
  'Ukuma',
  'Chinjenje',
  'Longonjo',
  'Chicala-Choloanga',
  'Mungo'
];

export const RELIGION_TYPES = [
  'Católica',
  'Protestante',
  'Pentecostal',
  'Evangélica',
  'Igreja de Jesus Cristo dos Santos dos Últimos Dias',
  'Outra'
];

export const LEADER_CARGOS = [
  'Padre',
  'Pastor',
  'Bispo',
  'Elder',
  'Presbítero',
  'Zelador',
  'Missionário',
  'Diácono'
];

// Initial realistic leaders data
export const INITIAL_LEADERS: Leader[] = [
  {
    id: 'l1',
    name: 'Padre Francisco Katito',
    role: 'Padre',
    phone: '+244923456789',
    email: 'francisco.katito@igrejacatolica.ao',
    institutionId: 'i1'
  },
  {
    id: 'l2',
    name: 'Pastor Samuel Chivinda',
    role: 'Pastor',
    phone: '+244934112233',
    email: 'samuel.chivinda@ieca.org',
    institutionId: 'i2'
  },
  {
    id: 'l3',
    name: 'Bispo Manuel Catchiungo',
    role: 'Bispo',
    phone: '+244912998877',
    email: 'm.catchiungo@adp.org',
    institutionId: 'i3'
  },
  {
    id: 'l4',
    name: 'Elder André Sampaio',
    role: 'Elder',
    phone: '+244951445566',
    email: 'a.sampaio@ldschurch.org',
    institutionId: 'i4'
  },
  {
    id: 'l5',
    name: 'Padre João Baptista Kassenda',
    role: 'Padre',
    phone: '+244944556677',
    email: 'jb.kassenda@paroquiacachiungo.ao',
    institutionId: 'i5'
  },
  {
    id: 'l6',
    name: 'Pastora Teresa Ngueve',
    role: 'Pastor',
    phone: '+244922334455',
    email: 'teresa.ngueve@iesa.org',
    institutionId: 'i6'
  }
];

// Initial realistic institutions in Huambo Province
export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'i1',
    name: 'Sé Catedral de Nossa Senhora da Conceição',
    religionType: 'Católica',
    municipality: 'Huambo',
    neighborhood: 'Cidade Alta',
    foundedYear: 1940,
    phone: '+244241220110',
    email: 'secatedral.huambo@igrejacatolica.ao',
    status: 'Ativa',
    leaderId: 'l1'
  },
  {
    id: 'i2',
    name: 'Igreja Evangélica Congregacional em Angola (IECA) - Templo Central',
    religionType: 'Evangélica',
    municipality: 'Huambo',
    neighborhood: 'Bairro Chiva',
    foundedYear: 1880,
    phone: '+244921445588',
    email: 'templo.central@ieca.org',
    status: 'Ativa',
    leaderId: 'l2'
  },
  {
    id: 'i3',
    name: 'Assembleia de Deus Pentecostal - Grande Templo de Caála',
    religionType: 'Pentecostal',
    municipality: 'Caála',
    neighborhood: 'Bairro Cantão',
    foundedYear: 1972,
    phone: '+244933221100',
    email: 'adp.caala@gmail.com',
    status: 'Ativa',
    leaderId: 'l3'
  },
  {
    id: 'i4',
    name: 'Capela de Huambo da Igreja de Jesus Cristo dos Santos dos Últimos Dias',
    religionType: 'Igreja de Jesus Cristo dos Santos dos Últimos Dias',
    municipality: 'Huambo',
    neighborhood: 'Bairro Académico',
    foundedYear: 2005,
    phone: '+244955778844',
    email: 'huambo.capela@lds.org',
    status: 'Ativa',
    leaderId: 'l4'
  },
  {
    id: 'i5',
    name: 'Paróquia de São Tiago Maior do Cachiungo',
    religionType: 'Católica',
    municipality: 'Cachiungo',
    neighborhood: 'Centro da Vila',
    foundedYear: 1952,
    phone: '+244941122334',
    email: 'paroquia.cachiungo@diocesedehuambo.ao',
    status: 'Ativa',
    leaderId: 'l5'
  },
  {
    id: 'i6',
    name: 'Igreja Evangélica Sinodal de Angola (IESA) - Missão de Bailundo',
    religionType: 'Protestante',
    municipality: 'Bailundo',
    neighborhood: 'Missão de Mbalundu',
    foundedYear: 1915,
    phone: '+244911002233',
    email: 'mbalundu.iesa@outlook.com',
    status: 'Ativa',
    leaderId: 'l6'
  }
];

// Initial realistic events in Huambo
export const INITIAL_EVENTS: ReligiousEvent[] = [
  {
    id: 'e1',
    title: 'Missa Dominical Solene',
    description: 'Celebração litúrgica dominical com a comunidade com a presença especial do Bispo Diocesano.',
    date: '2026-06-07',
    time: '08:00',
    institutionId: 'i1',
    status: 'Agendado',
    type: 'Missa'
  },
  {
    id: 'e2',
    title: 'Conferência Geral da Juventude IECA',
    description: 'Encontro provincial da juventude focado em liderança comunitária, ética e capacitação espiritual.',
    date: '2026-06-15',
    time: '09:00',
    institutionId: 'i2',
    status: 'Agendado',
    type: 'Conferência'
  },
  {
    id: 'e3',
    title: 'Culto de Ação de Graças e Clamor por Cachiungo',
    description: 'Campanha de oração pela paz e prosperidade da nossa vila de Cachiungo e suas famílias.',
    date: '2026-05-31',
    time: '15:30',
    institutionId: 'i5',
    status: 'Agendado',
    type: 'Culto'
  },
  {
    id: 'e4',
    title: 'Ação de Solidariedade Social - Distribuição de Alimentos',
    description: 'Distribuição de cestas de alimentos básicos e assistência às famílias vulneráveis do Cantão.',
    date: '2026-06-02',
    time: '10:00',
    institutionId: 'i3',
    status: 'Agendado',
    type: 'Ação Social'
  },
  {
    id: 'e5',
    title: 'Seminário de História e Fé em Bailundo',
    description: 'Encontro comemorativo do aniversário da Missão Evangélica do Bailundo e mesa redonda de debate.',
    date: '2026-05-25',
    time: '14:00',
    institutionId: 'i6',
    status: 'Realizado',
    type: 'Conferência'
  }
];

// Helper to initialize and retrieve from localStorage
const STORAGE_PREFIX = 'sgo_huambo_';

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key ' + key, error);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key ' + key, error);
  }
}
