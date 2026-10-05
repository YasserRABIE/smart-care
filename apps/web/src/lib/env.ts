import { z } from 'zod'

// Production-only keys are enforced when the server runs, not during `next build`, so images
// can be built without secrets and receive them at runtime.
const isProduction =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build'

/** Server-only variables. Optional ones are only optional outside production. */
export function createServerEnvSchema(production: boolean) {
  const requiredInProduction = <T extends z.ZodType>(schema: T) =>
    production ? schema : schema.optional()

  return z.object({
    DATABASE_URI: z.url({ protocol: /^postgres(ql)?$/ }),
    PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
    NEXT_PUBLIC_SITE_URL: z.url(),
    RESEND_API_KEY: requiredInProduction(z.string().startsWith('re_')),
    CONTACT_FALLBACK_EMAIL: requiredInProduction(z.email()),
    TURNSTILE_SITE_KEY: requiredInProduction(z.string().min(1)),
    TURNSTILE_SECRET_KEY: requiredInProduction(z.string().min(1)),
    SEED_ADMIN_EMAIL: z.email().optional(),
    SEED_ADMIN_PASSWORD: z.string().min(12).optional(),
  })
}

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
})

export type ServerEnv = z.infer<ReturnType<typeof createServerEnvSchema>>
export type ClientEnv = z.infer<typeof clientEnvSchema>

type EnvSource = Record<string, string | undefined>

function parse<T extends z.ZodType>(schema: T, source: EnvSource): z.infer<T> {
  // Treat `KEY=` in .env files as unset.
  const cleaned = Object.fromEntries(Object.entries(source).filter(([, value]) => value !== ''))
  const result = schema.safeParse(cleaned)
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}

export function parseServerEnv(source: EnvSource, production = isProduction): ServerEnv {
  return parse(createServerEnvSchema(production), source)
}

export function parseClientEnv(source: EnvSource): ClientEnv {
  return parse(clientEnvSchema, source)
}

// SKIP_ENV_VALIDATION is for tooling (tests, image builds) where real values are injected later.
const skipValidation = Boolean(process.env.SKIP_ENV_VALIDATION)
const isServer = typeof window === 'undefined'

/** Server environment. Throws if read from client code. */
export const env: ServerEnv = !isServer
  ? new Proxy({} as ServerEnv, {
      get(_, key) {
        throw new Error(`Server env var "${String(key)}" was accessed on the client`)
      },
    })
  : skipValidation
    ? (process.env as unknown as ServerEnv)
    : parseServerEnv(process.env)

/** Public environment, safe to use in client components. Keys are referenced explicitly so Next inlines them. */
export const clientEnv: ClientEnv = skipValidation
  ? { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '' }
  : parseClientEnv({ NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL })
