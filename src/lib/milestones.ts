import content from '../../data/content.json'

export { typeConfig, formatDate } from './milestone-style'

/** Milestones newest-first. Entries are hand-authored in order; sort so an
 *  appended-in-the-wrong-place entry can't quietly become "latest". */
export function sortedMilestones() {
  return [...content.phd.milestones].sort((a, b) => b.date.localeCompare(a.date))
}

export function latestMilestones(n = 3) {
  return sortedMilestones()
    .slice(0, n)
    .map(({ date, title, type }) => ({ date, title, type }))
}
