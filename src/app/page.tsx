import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Publications from '@/components/Publications'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import SectionTracker from '@/components/SectionTracker'

export default function Home() {
  return (
    <main className="bg-surface">
      <SectionTracker />
      <Hero />
      <Experience />
      <Education />
      <Publications />
      <Projects />
      <Skills />
      <About />
    </main>
  )
}
