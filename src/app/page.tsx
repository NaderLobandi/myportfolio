import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import ChatAssistant from '@/components/ChatAssistant'
import SectionTracker from '@/components/SectionTracker'

export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <SectionTracker />
      <Hero />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <About />
      <ChatAssistant />
    </main>
  )
}
