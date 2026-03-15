import { z } from 'zod';

const Table = z.object({
  name: z.string(),
})
export type Table = z.infer<typeof Table>;

const Column = z.object({
  name: z.string(),
  type: z.string(),
})
export type Column = z.infer<typeof Column>;

const Schema = z.object({
  table: z.string(),
  columns: z.array(z.string()),
})
export type Schema = z.infer<typeof Schema>;
