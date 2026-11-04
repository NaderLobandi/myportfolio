import type { Metadata } from 'next'
import Publications from '@/components/Publications'

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Peer-reviewed publications in IEEE Sensors Letters, Biosensors and Bioelectronics, IEEE CICC, and Journal of Applied Physics.',
  alternates: { canonical: '/publications' },
}

export default function PublicationsPage() {
  return (
    <main id="main" className="bg-surface pt-16 min-h-screen">
      <Publications />
    </main>
  )
}
