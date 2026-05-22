import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync } from 'fs'
import { rateLimiter } from '@/lib/rate-limiter'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')


export async function POST(request: Request) {
  // 1. Rate limit
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'anonymous'

  const limited = rateLimiter.check(`resume:${ip}`, 5)
  if (limited) return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })

  // 2. Parse + validate input
  const { jobDescription } = await request.json()
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.length > 5000)
    return Response.json({ error: 'jobDescription must be a non-empty string under 5000 characters.' }, { status: 400 })

  // 3. Load profile
  const content = JSON.parse(readFileSync('data/content.json', 'utf-8'))

  // 4. Call Gemini with structured prompt
  const systemInstruction = `You are an expert resume writer. Rewrite the candidate's experience bullets to match the job description.
Rules: stay grounded in real experience, start each bullet with an action verb, preserve metrics, mirror the job's terminology.
Return ONLY valid JSON — no markdown, no explanation:
{
  "tailoredExperience": [
    { "company": "<string>", "title": "<string>", "bullets": ["<rewritten bullet>", ...] }
  ],
  "summary": "<2-sentence tailored professional summary>"
}
CANDIDATE PROFILE:
${JSON.stringify({ experience: content.experience, skills: content.skills })}`

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: jobDescription.trim() }] }],
      generationConfig: { maxOutputTokens: 8192, responseMimeType: 'application/json' },
    })

    const raw = result.response.text()
    const parsed = JSON.parse(raw)

    return Response.json(parsed)
  } catch (err: unknown) {
    console.error('[resume-tailor]', err)
    if (err instanceof SyntaxError)
      return Response.json({ error: 'Failed to parse model response.' }, { status: 500 })
    const msg = err instanceof Error ? err.message : String(err)
    const status = msg.includes('429') ? 429 : 500
    return Response.json({ error: msg }, { status })
  }
}
