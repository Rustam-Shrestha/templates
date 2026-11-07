import { z } from "zod";

const ClientEnv = z.object({
  NEXT_PUBLIC_API_URL: z.url()
});

export const clientEnv = ClientEnv.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});

