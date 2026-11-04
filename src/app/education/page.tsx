import type { Metadata } from 'next'
import Education from '@/components/Education'

export const metadata: Metadata = {
  title: 'Education',
  description: 'PhD in Computer Science at the University of Denver, M.S. in Data Science from Northeastern, B.S. in Electrical Engineering from Sharif.',
  alternates: { canonical: '/education' },
}

export default function EducationPage() {
  return (
    <main id="main" className="bg-surface pt-16 min-h-screen">
      <Education />
    </main>
  )
}
