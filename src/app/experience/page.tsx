import type { Metadata } from 'next'
import Experience from '@/components/Experience'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Research and industry roles in machine learning, computer vision, and data science.',
  alternates: { canonical: '/experience' },
}

export default function ExperiencePage() {
  return (
    <main id="main" className="bg-surface pt-16 min-h-screen">
      <Experience />
    </main>
  )
}
