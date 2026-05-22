'use client'

import { useState } from 'react'
import Link from 'next/link'
import content from '../../../../data/content.json'

interface TailoredEntry {
  company: string
  title: string
  bullets: string[]
}

interface ApiResult {
  tailoredExperience: TailoredEntry[]
  summary?: string
}

export default function ResumeTailorPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const originalByCompany = Object.fromEntries(
    content.experience.map((e) => [e.company, e])
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    setCopied(false)

    try {
      const res = await fetch('/api/resume-tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function buildCopyText(data: ApiResult): string {
    const lines: string[] = []
    if (data.summary) {
      lines.push('PROFESSIONAL SUMMARY', data.summary, '')
    }
    lines.push('EXPERIENCE')
    data.tailoredExperience.forEach(({ company, title, bullets }) => {
      lines.push(`${title} — ${company}`)
      bullets.forEach((b) => lines.push(`• ${b}`))
      lines.push('')
    })
    return lines.join('\n').trim()
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(buildCopyText(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/dashboard"
          className="text-[#ededed]/30 hover:text-[#ededed]/70 text-sm transition-colors inline-block mb-8"
        >
          ← Back to dashboard
        </Link>

        <h1 className="text-[#ededed] text-3xl font-bold mb-1">Resume Tailor</h1>
        <p className="text-[#ededed]/40 text-sm mb-8">
          Paste a job description to rewrite your experience bullets for that role.
        </p>

        <form onSubmit={handleSubmit} className="mb-10">
          <label
            htmlFor="jd"
            className="block text-[#ededed]/60 text-xs font-medium mb-2 uppercase tracking-wider"
          >
            Job Description
          </label>
          <textarea
            id="jd"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here…"
            rows={8}
            required
            disabled={loading}
            maxLength={5000}
            className="w-full bg-[#111] text-[#ededed] placeholder-[#ededed]/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f97316]/50 transition-colors resize-y disabled:opacity-50"
          />
          <div className="flex items-center justify-between mt-1 mb-4">
            <span className="text-[#ededed]/20 text-xs">{jobDescription.length}/5000</span>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading || jobDescription.trim().length === 0}
            className="bg-[#f97316] hover:bg-[#fb923c] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Tailoring…' : 'Tailor Resume'}
          </button>
        </form>

        {result && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#ededed] text-xl font-semibold">Results</h2>
              <button
                onClick={handleCopy}
                className="text-xs font-medium px-4 py-2 rounded-lg border border-white/[0.08] text-[#ededed]/60 hover:text-[#ededed] hover:border-[#f97316]/40 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy tailored version'}
              </button>
            </div>

            {result.summary && (
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl px-6 py-5 mb-6">
                <p className="text-[#ededed]/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Tailored Summary
                </p>
                <p className="text-[#ededed]/80 text-sm leading-relaxed">{result.summary}</p>
              </div>
            )}

            <div className="space-y-6">
              {result.tailoredExperience.map((entry) => {
                const original = originalByCompany[entry.company]
                return (
                  <div
                    key={entry.company}
                    className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-white/[0.07]">
                      <p className="text-[#ededed] font-semibold text-base">{entry.company}</p>
                      <p className="text-[#ededed]/50 text-sm">{entry.title}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">
                      {/* Before */}
                      <div className="px-6 py-5">
                        <p className="text-[#ededed]/30 text-xs font-medium uppercase tracking-wider mb-3">
                          Original
                        </p>
                        <ul className="space-y-2">
                          {(original?.bullets ?? []).map((b, i) => (
                            <li key={i} className="text-[#ededed]/50 text-sm leading-relaxed flex gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#ededed]/20 flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* After */}
                      <div className="px-6 py-5">
                        <p className="text-[#f97316]/70 text-xs font-medium uppercase tracking-wider mb-3">
                          Tailored
                        </p>
                        <ul className="space-y-2">
                          {entry.bullets.map((b, i) => (
                            <li key={i} className="text-[#ededed]/80 text-sm leading-relaxed flex gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f97316]/50 flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
