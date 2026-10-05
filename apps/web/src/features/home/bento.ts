/**
 * Stat card widths for the bento grid (3 columns on desktop): rows alternate
 * wide + narrow, then narrow + wide.
 */
export function statSpan(index: number): 'wide' | 'narrow' {
  const row = Math.floor(index / 2)
  const isFirstInRow = index % 2 === 0
  return (row % 2 === 0) === isFirstInRow ? 'wide' : 'narrow'
}
