import { z } from 'zod';

export const pokemonSchema = z.object({
  id: z.coerce.string().min(1),
  hp: z.coerce
    .number()
    .min(1, { message: 'HP must be a valid number greater than 0' }),
  types: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.string())
    )
    .optional()
    .default([]),
  subtypes: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.string())
    )
    .optional()
    .default([]),
  supertype: z.coerce.string().nullable().optional().default(null),
});
