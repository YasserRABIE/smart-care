import { describe, expect, it } from 'vitest'

import { statSpan } from './bento'

describe('statSpan', () => {
  it('alternates wide/narrow then narrow/wide by row, like the design', () => {
    expect([0, 1, 2, 3, 4, 5].map(statSpan)).toEqual([
      'wide',
      'narrow',
      'narrow',
      'wide',
      'wide',
      'narrow',
    ])
  })
})
