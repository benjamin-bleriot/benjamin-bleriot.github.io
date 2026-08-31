import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string(),
  url: z.url(),
});

const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string(),
    shortDescription: z.string(),
    category: z.string(),
    status: z.enum(['available', 'coming-soon', 'in-development']).default('in-development'),
    featuredOrder: z.number().int().positive(),
    appStoreUrl: z.union([z.url(), z.literal('')]).default(''),
    appStoreId: z.string().default(''),
    icon: z.string().default(''),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
    }),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).default([]),
    screenshots: z.array(z.object({
      image: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),
    reviews: z.array(z.object({
      quote: z.string(),
      author: z.string(),
      source: z.string(),
    })).default([]),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    technologies: z.array(z.string()).default([]),
    links: z.array(linkSchema).default([]),
    privacy: z.object({
      lastUpdated: z.coerce.date(),
      isPlaceholder: z.boolean().default(true),
      summary: z.string(),
      sections: z.array(z.object({ heading: z.string(), content: z.string() })),
    }),
    terms: z.object({
      lastUpdated: z.coerce.date(),
      isPlaceholder: z.boolean().default(true),
      summary: z.string(),
      sections: z.array(z.object({ heading: z.string(), content: z.string() })),
    }),
    changelog: z.array(z.object({
      version: z.string(),
      date: z.coerce.date().optional(),
      label: z.string().optional(),
      additions: z.array(z.string()).default([]),
      fixes: z.array(z.string()).default([]),
    })).default([]),
  }),
});

export const collections = { apps };
