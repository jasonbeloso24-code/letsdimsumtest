import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { MENU_CATEGORIES } from './data/menu';

const categoryIds = MENU_CATEGORIES.map((c) => c.id) as [string, ...string[]];

const menu = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/menu' }),
  schema: z.object({ name: z.string(), zh: z.string(), category: z.enum(categoryIds), order: z.number() }),
});

const dishes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/dishes' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      zh: z.string(),
      image: image(),
      alt: z.string().min(1),
      featured: z.boolean().default(false),
      note: z.string().default(''),
      order: z.number(),
    }),
});

const photos = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/photos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      section: z.enum(['about', 'place', 'visit']),
      image: image(),
      alt: z.string().min(1),
      order: z.number(),
    }),
});

// Singleton edited in Keystatic. `days` holds JS day numbers (0 = Sunday) as strings.
const hours = defineCollection({
  loader: glob({ pattern: 'hours.yaml', base: 'src/content' }),
  schema: z.object({
    confirmed: z.boolean(),
    rows: z.array(z.object({ label: z.string(), days: z.array(z.string()), opens: z.string(), closes: z.string() })).min(1),
    holidays: z.array(z.object({ date: z.coerce.date(), label: z.string(), hours: z.string() })).default([]),
  }),
});

export const collections = { menu, dishes, photos, hours };
