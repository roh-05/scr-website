export interface RateLimitInfo {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let info = rateLimitMap.get(ip);

  if (!info) {
    info = { count: 1, lastReset: now };
    rateLimitMap.set(ip, info);
    return true; // Allowed
  }

  // Reset window if the time has elapsed
  if (now - info.lastReset > windowMs) {
    info.count = 1;
    info.lastReset = now;
    return true; // Allowed
  }

  // Increment counter and check if over limit
  info.count += 1;
  return info.count <= limit;
}
