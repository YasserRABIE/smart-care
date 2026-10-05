import { describe, expect, it } from 'vitest'

import { parseEmailFrom, parseServerEnv } from './env'

const base = {
  DATABASE_URI: 'postgres://user:pass@localhost:5433/db',
  PAYLOAD_SECRET: 'a'.repeat(32),
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
}

const productionExtras = {
  RESEND_API_KEY: 're_test',
  EMAIL_FROM: 'Smart Care <inquiries@example.com>',
  CONTACT_FALLBACK_EMAIL: 'contact@example.com',
  TURNSTILE_SITE_KEY: 'site',
  TURNSTILE_SECRET_KEY: 'secret',
}

describe('parseServerEnv', () => {
  it('accepts the minimal set in development', () => {
    expect(parseServerEnv(base, false).DATABASE_URI).toBe(base.DATABASE_URI)
  })

  it('treats empty strings as unset', () => {
    expect(parseServerEnv({ ...base, RESEND_API_KEY: '' }, false).RESEND_API_KEY).toBeUndefined()
  })

  it('requires email and spam keys in production', () => {
    expect(() => parseServerEnv(base, true)).toThrow(/RESEND_API_KEY/)
    expect(parseServerEnv({ ...base, ...productionExtras }, true).RESEND_API_KEY).toBe('re_test')
  })

  it('rejects a non-Postgres database URI and a short secret', () => {
    expect(() =>
      parseServerEnv({ ...base, DATABASE_URI: 'mongodb://localhost/db' }, false),
    ).toThrow(/DATABASE_URI/)
    expect(() => parseServerEnv({ ...base, PAYLOAD_SECRET: 'short' }, false)).toThrow(
      /PAYLOAD_SECRET/,
    )
  })
})

describe('parseEmailFrom', () => {
  it('splits "Name <address>"', () => {
    expect(parseEmailFrom('Smart Care <inquiries@example.com>')).toEqual({
      name: 'Smart Care',
      address: 'inquiries@example.com',
    })
  })

  it('accepts a plain address with a fallback name', () => {
    expect(parseEmailFrom('inquiries@example.com', 'Fallback')).toEqual({
      name: 'Fallback',
      address: 'inquiries@example.com',
    })
  })

  it('rejects malformed values', () => {
    expect(() => parseEmailFrom('not an email')).toThrow()
    expect(() => parseServerEnv({ ...base, EMAIL_FROM: 'nope' }, false)).toThrow(/EMAIL_FROM/)
  })
})
