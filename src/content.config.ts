import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Definimos la colección con el loader oficial de Astro 5+
const apuntesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apuntes' }),
  schema: z.object({
    title: z.string().max(120, "El título es demasiado largo para SEO."),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
    date: z.string().transform((str) => new Date(str)),
    categoria: z.enum(['sistemas', 'programacion', 'redes']),
    subcategoria: z.enum(['som', 'sor', 'backend', 'frontend', 'routing-switching', 'servicios-red']),
    dificultad: z.enum(['Basico', 'Intermedio', 'Avanzado', 'Masterclass']).default('Basico'),
    xp_recompensa: z.number().default(50),
    monedas_recompensa: z.number().default(10),
    draft: z.boolean().default(false),
  })
});

export const collections = {
  'apuntes': apuntesCollection,
};