export type PageRangeItem = number | 'ellipsis'

/**
 * Page numbers to show in a pagination control: always the first and last page, the current
 * page with `siblings` on each side, and an ellipsis for each gap. Keeps a constant length once
 * there are enough pages, so the control does not jump around.
 */
export function getPageRange(current: number, total: number, siblings = 1): PageRangeItem[] {
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)

  // first + last + current + siblings + two ellipses
  const slots = siblings * 2 + 5
  if (total <= slots) return range(1, total)

  const page = Math.min(Math.max(current, 1), total)
  const start = Math.max(page - siblings, 2)
  const end = Math.min(page + siblings, total - 1)
  const showStartGap = start > 3
  const showEndGap = end < total - 2

  if (!showStartGap) return [...range(1, slots - 2), 'ellipsis', total]
  if (!showEndGap) return [1, 'ellipsis', ...range(total - (slots - 3), total)]
  return [1, 'ellipsis', ...range(start, end), 'ellipsis', total]
}
