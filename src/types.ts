/**
 * Types and interfaces for S.G.O. - Sistema de Gestão Online
 * Gestão de Instituições Religiosas da Província do Huambo
 */

export type UserRole = 'ADMIN' | 'EDITOR' | 'VISITOR';

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
}

export type ReligionType = 
  | 'Católica' 
  | 'Protestante' 
  | 'Pentecostal' 
  | 'Evangélica' 
  | 'Igreja de Jesus Cristo dos Santos dos Últimos Dias'
  | 'Outra';

export type InstitutionStatus = 'Ativa' | 'Inativa' | 'Em Processo de Registo';

export interface Institution {
  id: string;
  name: string;
  religionType: ReligionType;
  municipality: string;
  neighborhood: string;
  foundedYear: number;
  phone: string;
  email: string;
  status: InstitutionStatus;
  leaderId: string; // References Leader.id
}

export interface Leader {
  id: string;
  name: string;
  role: string; // e.g., Pastor, Padre, Bispo, Presbítero
  phone: string;
  email: string;
  institutionId?: string; // References Institution.id
}

export interface ReligiousEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  institutionId: string; // References Institution.id
  status: 'Agendado' | 'Realizado' | 'Cancelado';
  type: 'Culto' | 'Missa' | 'Conferência' | 'Ação Social' | 'Outro';
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: UserRole | 'SYSTEM' | 'LEADER';
  senderTitle?: string; // e.g. "Padre", "Pastor" OR cargo
  content: string;
  timestamp: string; // HH:MM:SS
  dateStr: string; // YYYY-MM-DD
}

