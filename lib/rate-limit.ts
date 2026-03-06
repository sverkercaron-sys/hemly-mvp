const ipStore = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(ip: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.reset) {
    ipStore.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}
