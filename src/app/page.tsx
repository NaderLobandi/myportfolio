import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Publications from '@/components/Publications'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import SectionTracker from '@/components/SectionTracker'
import content from '../../data/content.json'

export default function Home() {
  const { hero, meta } = content

  return (
    <main id="main" className="bg-surface">
      <SectionTracker />
      <Hero hero={hero} meta={{ tagline: meta.tagline }} />
      <Experience />
      <Education />
      <Publications />
      <Projects />
      <Skills />
      <About />
    </main>
  )
}
