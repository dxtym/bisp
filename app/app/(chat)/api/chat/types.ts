import { z } from "zod";

export const Schema = z.object({
  table: z.string(),
  columns: z.array(z.string()),
})
export type Schema = z.infer<typeof Schema>;
