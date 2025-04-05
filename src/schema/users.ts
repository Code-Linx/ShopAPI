import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  passwod: z.string().min(6),
});
