import { z } from 'zod';
import { UNSAFE_anyToNumber } from '~/utils';

export const configSchema = z.object({
  SERVER_PORT: z
    .preprocess(
      (x) => UNSAFE_anyToNumber(x),
      z.number().min(8080, 'SERVER_PORT must be greater than or equal to 8080'),
    )
    .default(8081),
  // DB_HOST: z.string(),
  // DB_PORT: z.preprocess((x) => UNSAFE_anyToNumber(x), z.number()),
  // DB_USERNAME: z.string(),
  // DB_PASSWORD: z.string(),
  // DB_DATABASE: z.string(),
  // JWT_SECRET: z.string(),
});
