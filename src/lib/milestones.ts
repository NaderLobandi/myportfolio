import content from '../../data/content.json'

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

/** Milestones newest-first. Entries are hand-authored in order; sort so an
 *  appended-in-the-wrong-place entry can't quietly become "latest". */
export function sortedMilestones() {
  return [...content.phd.milestones].sort((a, b) => b.date.localeCompare(a.date))
}

export function latestMilestones(n = 3) {
  return sortedMilestones().slice(0, n)
}
