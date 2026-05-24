import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync } from 'fs'
import { join } from 'path'
import { rateLimiter } from '@/lib/rate-limiter'
import content from '../../../../data/content.json'

const persona = readFileSync(
  join(process.cwd(), 'data', 'chatbot_system_prompt.txt'),
  'utf-8'
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

type Role = 'user' | 'model'

interface HistoryEntry {
  role: string
  content: string
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      'anonymous'

    const body = await request.json()
    const { message, history = [] } = body

    // Validate message
    if (
      typeof message !== 'string' ||
      message.trim().length < 1 ||
      message.trim().length > 500
    ) {
      return Response.json(
        { error: 'Message must be a string between 1 and 500 characters.' },
        { status: 400 }
      )
    }

    // Rate limit: 20 requests per minute per IP
    if (rateLimiter.check(`chat:${ip}`, 20)) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: persona + '\n\n' + JSON.stringify(content),
      generationConfig: { maxOutputTokens: 8192 },
    })

    // Map history: "assistant" → "model", wrap in parts
    const mappedHistory = (history as HistoryEntry[]).map((entry) => ({
      role: (entry.role === 'assistant' ? 'model' : entry.role) as Role,
      parts: [{ text: entry.content }],
    }))

    const chat = model.startChat({ history: mappedHistory })
    const result = await chat.sendMessage(message.trim())

    return Response.json({ reply: result.response.text() })
  } catch {
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
