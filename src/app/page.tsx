import Hero from '@/components/Hero'
import AtAGlance from '@/components/AtAGlance'
import About from '@/components/About'
import SectionTracker from '@/components/SectionTracker'
import { latestMilestones } from '@/lib/milestones'
import content from '../../data/content.json'

export default function Home() {
  const { hero, meta } = content

  return (
    <main id="main" className="bg-surface">
      <SectionTracker />
      <Hero hero={hero} meta={{ tagline: meta.tagline }} latest={latestMilestones(3)} />
      <AtAGlance />
      <About />
    </main>
  )
}
