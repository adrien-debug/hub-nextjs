// Types et interfaces pour le backend

export type ProjectStatus = 'live' | 'coming' | 'future' | 'archived';

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  category: string;
  description: string;
  tech_stack: string[]; // JSON array
  port?: number;
  urls: {
    local?: string;
    production?: string;
    github?: string;
    api?: string;
  };
  logo?: string;
  screenshots: string[]; // JSON array
  location: string;
  features?: string[]; // JSON array
  created_at: string;
  updated_at: string;
  published: boolean;
  order_index: number;
}

export interface Media {
  id: string;
  project_id: string;
  type: 'logo' | 'screenshot' | 'banner';
  filename: string;
  original_filename: string;
  path: string;
  url: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  last_login?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: 'project' | 'media' | 'user';
  entity_id: string;
  details?: string; // JSON
  ip_address?: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  category?: string[];
  search?: string;
  published?: boolean;
}

// ============= INCUBATION SYSTEM =============

export type PhaseStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';

export interface Phase {
  id: number;
  slug: string;
  name: string;
  description: string;
  typical_duration_days: number;
  validation_criteria: string[];
  deliverables: string[];
  kpis: string[];
  order_index: number;
}

export interface StartupPhase {
  id: string;
  startup_id: string;
  phase_id: number;
  status: PhaseStatus;
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  actual_deliverables?: string[];
  kpi_values?: Record<string, any>;
  notes?: string;
  blockers?: string;
  created_at: string;
  updated_at: string;
}

export interface Startup {
  id: string;
  name: string;
  slug: string;
  founders: string[];
  pitch_deck_url?: string;
  one_pager_url?: string;
  product_url?: string;
  repo_url?: string;
  category?: string;
  problem?: string;
  solution?: string;
  market_size?: string;
  current_phase_id?: number;
  overall_score?: number;
  mentor_ids?: string[];
  cohort?: string;
  status: 'applicant' | 'screening' | 'accepted' | 'active' | 'graduated' | 'alumni' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface IncubationKPI {
  id: string;
  startup_id: string;
  phase_id: number;
  kpi_key: string;
  kpi_value: string | number;
  recorded_at: string;
  week_number?: number;
}

export interface IncubationFilters {
  status?: string[];
  cohort?: string;
  phase_id?: number;
  search?: string;
}
