import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFileSync } from 'fs'
import { rateLimiter } from '@/lib/rate-limiter'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'anonymous'

  const limited = rateLimiter.check(`cover:${ip}`, 5)
  if (limited) return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })

  const { jobDescription, tone = 'formal' } = await request.json()
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.length > 5000)
    return Response.json({ error: 'jobDescription must be a non-empty string under 5000 characters.' }, { status: 400 })

  const validTones = ['formal', 'conversational', 'technical']
  const resolvedTone = validTones.includes(tone) ? tone : 'formal'

  const content = JSON.parse(readFileSync('data/content.json', 'utf-8'))

  const systemInstruction = `You are an expert cover letter writer. Write a 3–4 paragraph cover letter tailored to the job description.
Tone: ${resolvedTone}
Rules:
- Open with a strong hook — never "I am writing to apply"
- Reference specific experience entries and real metrics from the candidate profile
- Mirror terminology from the job description; no generic filler
- Close with a clear call to action
Return ONLY valid JSON with this exact shape:
{
  "coverLetter": "<full letter, paragraph breaks as \\n\\n>",
  "keyPoints": ["<concise strength or match, 5–8 words max>"]
}
keyPoints should be 4–6 items highlighting the strongest matches.
CANDIDATE PROFILE:
${JSON.stringify({ hero: content.hero, experience: content.experience, skills: content.skills, education: content.education })}`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: jobDescription.trim() }] }],
      generationConfig: { maxOutputTokens: 800, responseMimeType: 'application/json' },
    })

    const parsed = JSON.parse(result.response.text())
    return Response.json(parsed)
  } catch (err: unknown) {
    console.error('[cover-letter]', err)
    if (err instanceof SyntaxError)
      return Response.json({ error: 'Failed to parse model response.' }, { status: 500 })
    const msg = err instanceof Error ? err.message : String(err)
    const status = msg.includes('429') ? 429 : 500
    return Response.json({ error: msg }, { status })
  }
}
