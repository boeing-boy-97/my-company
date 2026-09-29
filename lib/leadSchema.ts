import { z } from 'zod';

export const LeadSchema = z.object({
  projectTypes: z.array(z.string().max(80)).min(1).max(8),
  objective: z.string().min(12).max(3000),
  existingAssets: z.array(z.string().max(80)).max(10).default([]),
  currentTech: z.string().max(2000).default(''),
  users: z.string().max(1200).default(''),
  success: z.string().max(1200).default(''),
  timeline: z.string().min(1).max(40),
  budgetRange: z.string().min(1).max(40),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP', 'AED']).default('USD'),
  companyName: z.string().max(160).default(''),
  website: z.string().max(300).default(''),
  industry: z.string().max(80).default(''),
  country: z.string().max(80).default(''),
  contactName: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).default(''),
  whatsapp: z.string().max(40).default(''),
  preferredChannel: z.string().max(40).default('Email'),
  sourceUrl: z.string().max(500).optional(),
  utm: z.object({ source: z.string().max(100), medium: z.string().max(100), campaign: z.string().max(100) }).partial().optional(),
});
