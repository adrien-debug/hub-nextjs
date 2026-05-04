export type ProjectStatus = 'live' | 'coming' | 'future' | 'archived';

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  category: string;
  tagline?: string;
  description: string;
  tech_stack: string[];
  port?: number;
  urls: {
    local?: string;
    production?: string;
    github?: string;
    api?: string;
  };
  logo?: string;
  screenshots: string[];
  location: string;
  features?: string[];
  created_at: string;
  updated_at: string;
  published: boolean;
  order_index: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
