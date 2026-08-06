/** Presentation helpers for milestones — deliberately free of any
 *  `content.json` import so client components can use them without pulling the
 *  whole 27 KB data file into the browser bundle. */

export const typeConfig: Record<string, { label: string; color: string; dot: string }> = {
  award:       { label: 'Award',       color: '#f97316', dot: '#f97316' },
  conference:  { label: 'Conference',  color: '#3b82f6', dot: '#3b82f6' },
  publication: { label: 'Publication', color: '#22c55e', dot: '#22c55e' },
  milestone:   { label: 'Milestone',   color: '#a855f7', dot: '#a855f7' },
}

export function formatDate(ym: string): string {
  const [year, month] = ym.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  })
}

export type MilestonePreview = { date: string; title: string; type: string }
