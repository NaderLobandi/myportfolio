'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const AVATAR_SRC = '/ChatbotLogo.png'

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input whenever panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [open])

  async function sendMessage() {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]

    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: messages }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Request failed')
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value.slice(0, 500))
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`
  }

  return (
    <>
      {/* Toggle button — cartoonish profile image */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-xl ring-2 ring-[#f97316]/50 hover:ring-[#f97316] hover:scale-105 transition-all duration-200"
      >
        <Image
          src={AVATAR_SRC}
          alt="Chat with Nader"
          width={56}
          height={56}
          className="w-full h-full object-cover"
          priority
        />
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/[0.07] bg-[#111]"
          style={{ width: 350, height: 500 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#181818] border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#f97316]/50 flex-shrink-0">
                <Image
                  src={AVATAR_SRC}
                  alt="Nader"
                  fill
                  sizes="32px"
                  className="object-cover"
                        />
              </div>
              <div>
                <p className="text-[#ededed] text-sm font-semibold leading-tight">
                  Nader&apos;s Digital Twin <span className="text-[#f97316] text-[10px] font-mono">AI</span>
                </p>
                <p className="text-[#ededed]/35 text-[10px]">Ask about Nader</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-[#ededed]/30 hover:text-[#ededed]/80 transition-colors text-xl leading-none pb-0.5"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
            {messages.length === 0 && (
              <p className="text-[#ededed]/25 text-sm text-center mt-10 leading-relaxed">
                Ask about Nader&apos;s research,<br />experience, or projects.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#f97316] text-white rounded-tr-sm'
                      : 'bg-[#1e1e1e] text-[#ededed]/80 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-[#ededed]">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mt-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mt-1">{children}</ol>,
                        li: ({ children }) => <li className="text-sm">{children}</li>,
                        code: ({ children }) => <code className="bg-black/30 rounded px-1 py-0.5 text-xs font-mono text-[#f97316]">{children}</code>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e1e] rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-[#ededed]/35 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inline error */}
            {error && (
              <p className="text-red-400/80 text-xs text-center px-3 py-1 bg-red-500/10 rounded-lg">
                {error}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#181818] px-3 py-3">
            <div className="flex items-end gap-2">
              {/* Textarea + char counter */}
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  rows={1}
                  disabled={loading}
                  className="w-full resize-none bg-[#0d0d0d] text-[#ededed] text-sm placeholder-[#ededed]/20 rounded-xl px-3.5 pt-2.5 pb-6 border border-white/[0.06] outline-none focus:border-[#f97316]/40 transition-colors disabled:opacity-50 overflow-hidden"
                />
                <span
                  className={`absolute bottom-2 right-3 text-[10px] pointer-events-none transition-colors ${
                    input.length > 450 ? 'text-[#f97316]' : 'text-[#ededed]/18'
                  }`}
                >
                  {input.length}/500
                </span>
              </div>

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={loading || input.trim().length === 0}
                aria-label="Send message"
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#f97316] text-white flex items-center justify-center hover:bg-[#fb923c] active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-150"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
