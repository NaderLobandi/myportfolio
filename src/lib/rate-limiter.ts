interface Entry {
  count: number
  timestamp: number
}

const store = new Map<string, Entry>()
const WINDOW_MS = 60_000

export const rateLimiter = {
  check(ip: string, limit: number): boolean {
    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now - entry.timestamp > WINDOW_MS) {
      store.set(ip, { count: 1, timestamp: now })
      return false
    }

    if (entry.count < limit) {
      entry.count++
      return false
    }

    return true
  },
}
