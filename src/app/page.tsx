import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import ChatAssistant from '@/components/ChatAssistant'

export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <Hero />
      <Experience />
      <Skills />
      <ChatAssistant />
    </main>
  )
}
