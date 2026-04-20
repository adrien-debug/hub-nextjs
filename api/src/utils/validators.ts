import { z } from 'zod';

// Validation des projets
export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  description: z.string().min(10).max(2000),
  status: z.enum(['live', 'coming', 'future', 'archived']),
  tech_stack: z.array(z.string()).min(1),
  port: z.number().int().min(1).max(65535).optional(),
  urls: z.object({
    local: z.string().url().optional(),
    production: z.string().url().optional(),
    github: z.string().url().optional(),
    api: z.string().url().optional(),
  }).optional(),
  location: z.string().min(1).max(500),
  features: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  order_index: z.number().int().min(0).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

// Validation des médias
export const mediaUploadSchema = z.object({
  type: z.enum(['logo', 'screenshot', 'banner']),
  project_id: z.string().min(1),
});

// Validation des utilisateurs
export const userCreateSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['admin', 'editor', 'viewer']),
});

export const userLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const userUpdateSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(100).optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
});

// Validation de la pagination
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Validation des filtres de projets
export const projectFiltersSchema = z.object({
  status: z.array(z.enum(['live', 'coming', 'future', 'archived'])).optional(),
  category: z.array(z.string()).optional(),
  search: z.string().optional(),
  published: z.boolean().optional(),
});

// Helper pour valider les données
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function validateDataSafe<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: z.ZodError;
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
