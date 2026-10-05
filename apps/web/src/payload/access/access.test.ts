import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import {
  authenticated,
  hiddenFromEditors,
  isAdmin,
  isAdminOrSelf,
  publishedOrAuthenticated,
} from '.'

const admin = { id: 1, role: 'admin' } as PayloadRequest['user']
const editor = { id: 2, role: 'editor' } as PayloadRequest['user']
const args = (user: PayloadRequest['user']) => ({ req: { user } as PayloadRequest })

describe('access', () => {
  it('only lets admins through isAdmin', () => {
    expect(isAdmin(args(admin))).toBe(true)
    expect(isAdmin(args(editor))).toBe(false)
    expect(isAdmin(args(null))).toBe(false)
  })

  it('requires a login for authenticated', () => {
    expect(authenticated(args(editor))).toBe(true)
    expect(authenticated(args(null))).toBe(false)
  })

  it('limits non-admins to their own user document', () => {
    expect(isAdminOrSelf(args(admin))).toBe(true)
    expect(isAdminOrSelf(args(editor))).toEqual({ id: { equals: 2 } })
    expect(isAdminOrSelf(args(null))).toBe(false)
  })

  it('shows the public only published documents', () => {
    expect(publishedOrAuthenticated(args(editor))).toBe(true)
    expect(publishedOrAuthenticated(args(null))).toEqual({ _status: { equals: 'published' } })
  })

  it('hides admin-only collections from editors', () => {
    expect(hiddenFromEditors({ user: editor })).toBe(true)
    expect(hiddenFromEditors({ user: admin })).toBe(false)
  })
})
