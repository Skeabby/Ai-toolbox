// ─────────────────────────────────────────────────────────────────────────────
//  lib/ai/gemini.ts
//
//  Thin wrapper around the Google Gemini 1.5 Flash REST API.
//  Used by every AI API route — import callGemini() or callGeminiJSON()
//  instead of copy-pasting fetch logic into each route.
//
//  Free tier: 15 RPM · 1,000,000 tokens/day · $0
//  Docs: https://ai.google.dev/gemini-api/docs
// ─────────────────────────────────────────────────────────────────────────────

const GEMINI_BASE   = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-1.5-flash";
const TIMEOUT_MS    = 25_000; // 25 s — Vercel Node functions cap at 30 s

// ── Public types ──────────────────────────────────────────────────────────────

export interface GeminiOptions {
  model?:            string;
  systemInstruction?: string;
  temperature?:      number; // 0–1, default 0.7
  maxOutputTokens?:  number; // default 1024
  responseMimeType?: "text/plain" | "application/json";
}

export interface GeminiResponse {
  text:      string;
  truncated: boolean;
  usage:     { promptTokens: number; candidateTokens: number; totalTokens: number };
}

// ── Core fetch ────────────────────────────────────────────────────────────────

export async function callGemini(
  userMessage: string,
  opts: GeminiOptions = {}
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY is missing from .env.local", 500);

  const {
    model            = DEFAULT_MODEL,
    systemInstruction,
    temperature      = 0.7,
    maxOutputTokens  = 1024,
    responseMimeType = "text/plain",
  } = opts;

  const url  = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
  const body: Record<string, unknown> = {
    contents:         [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: { temperature, maxOutputTokens, responseMimeType },
  };
  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let raw: Response;
  try {
    raw = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  ctrl.signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new GeminiError("Gemini timed out.", 504);
    throw new GeminiError(`Network error: ${(e as Error).message}`, 502);
  } finally {
    clearTimeout(tid);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await raw.json();
  if (!raw.ok || json.error) {
    throw new GeminiError(json.error?.message ?? `Gemini API error ${raw.status}`, raw.status);
  }

  const candidate = json.candidates?.[0];
  if (!candidate) throw new GeminiError("No response from Gemini.", 500);

  return {
    text:      candidate.content.parts.map((p: { text: string }) => p.text).join(""),
    truncated: candidate.finishReason === "MAX_TOKENS",
    usage: {
      promptTokens:    json.usageMetadata?.promptTokenCount     ?? 0,
      candidateTokens: json.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens:     json.usageMetadata?.totalTokenCount      ?? 0,
    },
  };
}

// ── JSON helper ───────────────────────────────────────────────────────────────

export async function callGeminiJSON<T>(
  userMessage: string,
  opts: GeminiOptions = {}
): Promise<T> {
  const result = await callGemini(userMessage, { ...opts, responseMimeType: "application/json" });
  try {
    const clean = result.text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(clean) as T;
  } catch {
    throw new GeminiError(`Gemini returned invalid JSON: ${result.text.slice(0, 120)}`, 500);
  }
}

// ── Error class ───────────────────────────────────────────────────────────────

export class GeminiError extends Error {
  constructor(message: string, public readonly statusCode = 500) {
    super(message);
    this.name = "GeminiError";
  }
}
