'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tone = 'formal' | 'conversational' | 'technical'

interface ApiResult {
  coverLetter: string
  keyPoints: string[]
}

const TONES: { value: Tone; label: string; description: string }[] = [
  { value: 'formal',         label: 'Formal',         description: 'Professional and structured' },
  { value: 'conversational', label: 'Conversational',  description: 'Warm and approachable' },
  { value: 'technical',      label: 'Technical',       description: 'Detail-oriented, skills-forward' },
]

export default function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState<Tone>('formal')
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    setCopied(false)

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, tone }),
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

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/dashboard"
          className="text-[#ededed]/30 hover:text-[#ededed]/70 text-sm transition-colors inline-block mb-8"
        >
          ← Back to dashboard
        </Link>

        <h1 className="text-[#ededed] text-3xl font-bold mb-1">Cover Letter Generator</h1>
        <p className="text-[#ededed]/40 text-sm mb-8">
          Paste a job description and pick a tone to generate a tailored cover letter.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mb-10">
          {/* Job description */}
          <div>
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
            <p className="text-[#ededed]/20 text-xs mt-1">{jobDescription.length}/5000</p>
          </div>

          {/* Tone selector */}
          <div>
            <p className="text-[#ededed]/60 text-xs font-medium mb-3 uppercase tracking-wider">Tone</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {TONES.map((t) => (
                <label
                  key={t.value}
                  className={`flex-1 flex items-start gap-3 cursor-pointer rounded-xl border px-4 py-3 transition-colors ${
                    tone === t.value
                      ? 'border-[#f97316]/60 bg-[#f97316]/5'
                      : 'border-white/[0.08] bg-[#111] hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={t.value}
                    checked={tone === t.value}
                    onChange={() => setTone(t.value)}
                    disabled={loading}
                    className="mt-0.5 accent-[#f97316]"
                  />
                  <span>
                    <span className={`block text-sm font-medium ${tone === t.value ? 'text-[#f97316]' : 'text-[#ededed]'}`}>
                      {t.label}
                    </span>
                    <span className="block text-xs text-[#ededed]/40 mt-0.5">{t.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || jobDescription.trim().length === 0}
            className="bg-[#f97316] hover:bg-[#fb923c] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating…' : 'Generate Cover Letter'}
          </button>
        </form>

        {result && (
          <section>
            {/* Key points */}
            <div className="mb-6">
              <p className="text-[#ededed]/50 text-xs font-medium uppercase tracking-wider mb-3">
                Key Strengths
              </p>
              <div className="flex flex-wrap gap-2">
                {result.keyPoints.map((point, i) => (
                  <span
                    key={i}
                    className="bg-[#f97316]/10 text-[#f97316]/80 border border-[#f97316]/20 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover letter */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <p className="text-[#ededed] text-sm font-semibold">Cover Letter</p>
                <button
                  onClick={handleCopy}
                  className="text-xs font-medium px-4 py-2 rounded-lg border border-white/[0.08] text-[#ededed]/60 hover:text-[#ededed] hover:border-[#f97316]/40 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="px-6 py-5">
                {result.coverLetter.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[#ededed]/80 text-sm leading-relaxed mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
