'use client'

import Link from 'next/link'

const tools = [
  {
    href: '/dashboard/resume-tailor',
    title: 'Resume Tailor',
    description: 'Paste a job description and get your experience bullets rewritten to match.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/cover-letter',
    title: 'Cover Letter',
    description: 'Generate a tailored cover letter in your preferred tone from a job posting.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#ededed] mb-2">Dashboard</h1>
          <p className="text-[#ededed]/40 text-sm">AI-powered job application tools.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#111] p-6 hover:border-[#f97316]/30 hover:bg-[#f97316]/[0.03] transition-all duration-300"
            >
              <span className="text-[#f97316] group-hover:scale-110 transition-transform duration-300 w-fit">
                {tool.icon}
              </span>
              <div>
                <h2 className="text-[#ededed] font-semibold text-base mb-1">{tool.title}</h2>
                <p className="text-[#ededed]/45 text-sm leading-relaxed">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="text-[#ededed]/30 hover:text-[#ededed]/70 text-sm transition-colors"
          >
            ← Back to site
          </Link>
        </div>

      </div>
    </main>
  )
}
