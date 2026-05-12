// ─────────────────────────────────────────────────────────────────────────────
//  lib/utils/validate.ts
//
//  Lightweight validation helpers for API routes.
//  We deliberately avoid a heavy library (zod, joi) to keep the bundle tiny
//  on Vercel's free tier. Add zod if the project grows.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  ok:    boolean;
  error?: string;
}

// ── String validators ─────────────────────────────────────────────────────────

/**
 * Validates a string field: present, non-empty, within length bounds.
 */
export function validateString(
  value: unknown,
  fieldName: string,
  { min = 1, max = 5000 }: { min?: number; max?: number } = {}
): ValidationResult {
  if (value === undefined || value === null) {
    return { ok: false, error: `${fieldName} is required.` };
  }
  if (typeof value !== "string") {
    return { ok: false, error: `${fieldName} must be a string.` };
  }
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return { ok: false, error: `${fieldName} must be at least ${min} character(s).` };
  }
  if (trimmed.length > max) {
    return {
      ok:    false,
      error: `${fieldName} is too long (max ${max} characters, got ${trimmed.length}).`,
    };
  }
  return { ok: true };
}

// ── Prompt-specific validators ────────────────────────────────────────────────

export const PROMPT_MIN_LENGTH = 10;
export const PROMPT_MAX_LENGTH = 2000;

/**
 * Full validation for the Prompt Improver input.
 * Returns the sanitised value on success.
 */
export function validatePromptInput(body: unknown): {
  ok:     true;
  prompt: string;
} | {
  ok:     false;
  error:  string;
  status: number;
} {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be JSON.", status: 400 };
  }

  const { prompt } = body as Record<string, unknown>;

  const v = validateString(prompt, "prompt", {
    min: PROMPT_MIN_LENGTH,
    max: PROMPT_MAX_LENGTH,
  });

  if (!v.ok) {
    return { ok: false, error: v.error!, status: 400 };
  }

  // Trim whitespace and normalise internal runs of 3+ newlines
  const clean = (prompt as string)
    .trim()
    .replace(/\n{3,}/g, "\n\n");

  return { ok: true, prompt: clean };
}

// ── Rate-limit (simple in-memory, per-IP) ─────────────────────────────────────
//
// Vercel Serverless Functions are stateless — this map resets whenever the
// cold-start fires. Good enough to block aggressive bursts; not a substitute
// for Redis-based rate limiting in production.
//
// Upgrade path: replace with Upstash Redis (free tier: 10k req/day).

interface RateLimitEntry {
  count:     number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Returns true if the key is WITHIN the allowed rate, false if blocked.
 *
 * @param key        Usually the client IP from x-forwarded-for.
 * @param maxPerWindow  Max allowed requests in the window.
 * @param windowMs   Window duration in ms. Default: 60 000 (1 minute).
 */
export function checkRateLimit(
  key: string,
  maxPerWindow = 10,
  windowMs     = 60_000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now   = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxPerWindow - 1, resetIn: windowMs };
  }

  if (entry.count >= maxPerWindow) {
    const resetIn = windowMs - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count += 1;
  return {
    allowed:   true,
    remaining: maxPerWindow - entry.count,
    resetIn:   windowMs - (now - entry.windowStart),
  };
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

/** Build a consistent error JSON response for API routes. */
export function errorResponse(
  message: string,
  status: number
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Build a consistent success JSON response for API routes. */
export function successResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
