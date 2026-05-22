'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl px-8 py-10 shadow-2xl">
          <h1 className="text-[#ededed] text-2xl font-bold mb-1">Private Access</h1>
          <p className="text-[#ededed]/40 text-sm mb-8">
            Dashboard is restricted. Enter the site password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-[#ededed]/60 text-xs font-medium mb-2 uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                disabled={loading}
                className="w-full bg-[#0a0a0a] text-[#ededed] placeholder-[#ededed]/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f97316]/50 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || password.length === 0}
              className="w-full bg-[#f97316] hover:bg-[#fb923c] text-white font-semibold text-sm py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
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
