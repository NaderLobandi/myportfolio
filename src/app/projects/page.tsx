import type { Metadata } from 'next'
import Projects from '@/components/Projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected machine learning, computer vision, and agentic AI projects.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsPage() {
  return (
    <main id="main" className="bg-surface pt-16 min-h-screen">
      <Projects />
    </main>
  )
}
