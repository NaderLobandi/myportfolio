# Portfolio Project — New Chat Context

## What this is
Next.js 14 App Router portfolio site for **Nader Lobandi** (Data Scientist / PhD researcher, University of Denver). Built from scratch in a prior session. Run with `npm run dev`.

---

## Tech stack
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Framer Motion (scroll animations)
- Google Generative AI SDK (`@google/generative-ai`) — chatbot + resume tailor
- Anthropic SDK (`@anthropic-ai/sdk`) — fit analyzer, cover letter
- Cookie-based auth (no NextAuth, no DB)
- In-memory rate limiter (`src/lib/rate-limiter.ts`)

## Theme
- Background: `#0a0a0a`
- Text: `#ededed`
- Accent: `#f97316` (orange)

## Content source
All content comes from `data/content.json`. No database. Shape:
```
hero: { name, credentials, title, company, pitch, profileImage, contact }
experience[]: { company, title, type, location, startDate, end, bullets[] }
skills: { categories[], strong[], gaps[] }
projects[]: { name, description, stack[], impact }
education[]: { institution, degree, start, end, focus, gpa, honors }
meta: { siteTitle, siteDescription, tagline }
```
Note: experience uses `startDate` (not `start`).

---

## File tree — what EXISTS

```
data/
  content.json                  ← primary content source
  chatbot_system_prompt.txt     ← Gemini chatbot persona

src/
  middleware.ts                 ← edge auth guard (protects /dashboard/*, /api/fit-analyzer, /api/resume-tailor, /api/cover-letter)
  lib/
    rate-limiter.ts             ← in-memory Map rate limiter
  app/
    layout.tsx                  ← root layout (fonts, metadata only)
    page.tsx                    ← homepage: <Hero/> <Experience/> <Skills/> <ChatAssistant/>
    globals.css
    login/page.tsx              ← 'use client' password form → POST /api/auth → router.push('/dashboard')
    api/
      auth/route.ts             ← POST sets auth-token cookie="authenticated"; DELETE clears it
      chat/route.ts             ← Gemini 2.5 flash chatbot, 8192 tokens, 20 req/min
      fit-analyzer/route.ts     ← Anthropic claude-sonnet-4-5, returns {score,verdict,strongMatches,gaps,recommendations}
      resume-tailor/route.ts    ← Gemini 2.5 flash, responseMimeType:'application/json', returns {tailoredExperience[],summary}
      cover-letter/route.ts     ← Anthropic claude-sonnet-4-5, returns {subject,body,wordCount}
    dashboard/
      resume-tailor/page.tsx    ← full UI: textarea → API → side-by-side before/after bullets + copy button
  components/
    Hero.tsx                    ← framer-motion staggered fadeUp, next/image width=56 height=56
    Experience.tsx              ← vertical timeline, alternating left/right cards, whileInView slide-in
    Skills.tsx                  ← 3 tiers: categories grid, strong pills, gap pills (dashed)
    ChatAssistant.tsx           ← fixed bottom-right widget, ReactMarkdown, 3-dot typing indicator

public/
  ChatbotLogo.png               ← chatbot toggle button logo
  profile.jpg                   ← Nader's profile photo (used in Hero)
```

---

## File tree — MISSING (not yet built)

```
src/components/Projects.tsx
src/components/Education.tsx
src/components/Contact.tsx
src/components/Navigation.tsx   ← sticky nav with smooth scroll
src/components/Footer.tsx
src/app/dashboard/page.tsx      ← tool hub / landing
src/app/dashboard/fit-analyzer/page.tsx
src/app/dashboard/cover-letter/page.tsx
src/components/dashboard/DashboardNav.tsx
```

---

## Key implementation details

### Auth
- Middleware checks cookie `auth-token === "authenticated"` (not compared to password)
- Auth route sets cookie value `"authenticated"`, maxAge 86400
- `SITE_PASSWORD` env var used only in auth route for login comparison

### Rate limiter
```ts
// Returns true = rate limited (block), false = allow
rateLimiter.check(`chat:${ip}`, 20)  // chatbot: 20/min
rateLimiter.check(`fit:${ip}`, 5)    // private tools: 5/min
```

### Gemini routes (chat, resume-tailor)
- Use `responseMimeType: 'application/json'` in `generationConfig` to force raw JSON output
- Parse with `JSON.parse(result.response.text())` — no extractJson needed

### Anthropic routes (fit-analyzer, cover-letter)
- Use `extractJson()` helper to strip optional markdown fences before `JSON.parse`
- `extractJson` tries regex first, then falls back to `text.indexOf('{')` / `text.lastIndexOf('}')`

### ChatAssistant logo
- Uses `width={56} height={56}` on next/image (NOT `fill`) — `fill` breaks in `position:fixed` buttons

### content.json at request time
- API routes use `readFileSync('data/content.json', 'utf-8')` with relative path (works from project root)
- Chat route loads content at module level (import), not per-request

---

## Env vars needed
```
GEMINI_API_KEY          ← for /api/chat and /api/resume-tailor
ANTHROPIC_API_KEY       ← for /api/fit-analyzer and /api/cover-letter
SITE_PASSWORD           ← for /api/auth login check
```

---

## Known issues / recent bugs

1. **resume-tailor JSON parse error** — was caused by Gemini wrapping output in markdown fences when job description contained double quotes. Fixed by adding `responseMimeType: 'application/json'` to `generationConfig`. This forces Gemini to return raw JSON, bypassing the extractJson problem entirely.

2. **fit-analyzer / cover-letter** still use `extractJson` (Anthropic doesn't have a native JSON mode equivalent in this SDK version). If they show the same fence-wrapping issue, the fix is to add `"type": "json_object"` or switch models.

---

## What's working
- Homepage with Hero, Experience, Skills sections (animated)
- AMA chatbot widget (bottom-right, Gemini-powered, markdown rendering)
- Login page + cookie auth
- Middleware auth guard
- Dashboard resume tailor page (full UI)
- All 4 API routes wired up

## What to build next
1. `Projects.tsx`, `Education.tsx`, `Contact.tsx` — complete the public homepage
2. `Navigation.tsx` — sticky top nav
3. `Footer.tsx`
4. `src/app/dashboard/page.tsx` — dashboard hub
5. `src/app/dashboard/fit-analyzer/page.tsx` — UI for fit analyzer
6. `src/app/dashboard/cover-letter/page.tsx` — UI for cover letter generator
