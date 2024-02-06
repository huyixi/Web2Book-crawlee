import {z} from 'zod'
import {Page} from 'playwright'

const Page: z.ZodType<Page> = z.any()

/**
 * Represents the configuration schema for the application.
 */
export const configSchema = z.object({
  url: z.string(),
  match: z.string().or(z.array(z.string())),
  exclude: z.string().or(z.array(z.string())).optional(),
  selector: z.string().optional(),
  outputFileType: z.enum(['json', 'html','epub']).optional(),
  waitForSelectorTimeout: z.number().int().nonnegative().optional(),
  resourceExclusions: z.array(z.string()).optional(),
  maxFileSize: z.number().int().nonnegative().optional(),
})

export type Config = z.infer<typeof configSchema>
