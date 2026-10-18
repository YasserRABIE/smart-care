import { describe, expect, it } from 'vitest'

import { parseServerEnv } from './env'

const base = {
  DATABASE_URI: 'postgres://user:pass@localhost:5433/db',
  PAYLOAD_SECRET: 'a'.repeat(32),
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
}

describe('parseServerEnv', () => {
  it('accepts the required set', () => {
    expect(parseServerEnv(base).DATABASE_URI).toBe(base.DATABASE_URI)
  })

  it('treats empty strings as unset', () => {
    expect(parseServerEnv({ ...base, SEED_ADMIN_EMAIL: '' }).SEED_ADMIN_EMAIL).toBeUndefined()
  })

  it('rejects a non-Postgres database URI and a short secret', () => {
    expect(() => parseServerEnv({ ...base, DATABASE_URI: 'mongodb://localhost/db' })).toThrow(
      /DATABASE_URI/,
    )
    expect(() => parseServerEnv({ ...base, PAYLOAD_SECRET: 'short' })).toThrow(/PAYLOAD_SECRET/)
  })
})
