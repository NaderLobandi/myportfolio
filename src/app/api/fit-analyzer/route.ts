import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync } from 'fs'
import { rateLimiter } from '@/lib/rate-limiter'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'anonymous'

  const limited = rateLimiter.check(`fit:${ip}`, 5)
  if (limited) return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })

  const { jobDescription } = await request.json()
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.length > 5000)
    return Response.json({ error: 'jobDescription must be a non-empty string under 5000 characters.' }, { status: 400 })

  const content = JSON.parse(readFileSync('data/content.json', 'utf-8'))

  const systemInstruction = `You are a hiring fit analyzer. Compare the candidate profile against the job description.
Return ONLY valid JSON with this exact shape:
{
  "score": <integer 0–100>,
  "verdict": "<one sentence summary>",
  "strongMatches": ["<matching skill or experience>"],
  "gaps": ["<requirement the candidate lacks>"],
  "recommendations": ["<actionable suggestion>"]
}
CANDIDATE PROFILE:
${JSON.stringify({ skills: content.skills, experience: content.experience })}`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: jobDescription.trim() }] }],
      generationConfig: { maxOutputTokens: 2000, responseMimeType: 'application/json' },
    })

    const parsed = JSON.parse(result.response.text())
    return Response.json(parsed)
  } catch (err: unknown) {
    console.error('[fit-analyzer]', err)
    if (err instanceof SyntaxError)
      return Response.json({ error: 'Failed to parse model response.' }, { status: 500 })
    const msg = err instanceof Error ? err.message : String(err)
    const status = msg.includes('429') ? 429 : 500
    return Response.json({ error: msg }, { status })
  }
}
