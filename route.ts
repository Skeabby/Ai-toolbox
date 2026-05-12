// ─────────────────────────────────────────────────────────────────────────────
//  app/api/ai/improve-prompt/route.ts
//
//  POST /api/ai/improve-prompt
//  Body:    { prompt: string }
//  Returns: { improved, changes, category, tone }
//
//  Security layers:
//    1. Auth check    — valid Supabase session required
//    2. Rate limit    — 10 req / user / minute (in-memory)
//    3. Input validation — length, type, sanitisation
//    4. API key       — GEMINI_API_KEY is server-only, never sent to client
//    5. Error masking — raw Gemini errors are normalised before returning
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { callGeminiJSON, GeminiError } from "@/lib/ai/gemini";
import { IMPROVE_PROMPT_SYSTEM, buildImprovePromptMessage } from "@/lib/ai/prompts";
import { validatePromptInput, checkRateLimit, errorResponse, successResponse } from "@/lib/utils/validate";

interface ImproveResult {
  improved: string;
  changes:  string[];
  category: string;
  tone:     string;
}

export async function POST(req: NextRequest) {
  // 1 ── Auth ────────────────────────────────────────────────────────────────
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return errorResponse("Authentication required. Please log in.", 401);

  // 2 ── Rate limit (keyed to user, not IP — harder to bypass) ──────────────
  const rl = checkRateLimit(`improve:${user.id}`, 10, 60_000);
  if (!rl.allowed) {
    const retry = Math.ceil(rl.resetIn / 1000);
    return new Response(
      JSON.stringify({ error: `Too many requests. Retry in ${retry}s.` }),
      { status: 429, headers: { "Retry-After": String(retry), "Content-Type": "application/json" } }
    );
  }

  // 3 ── Parse & validate body ───────────────────────────────────────────────
  let body: unknown;
  try { body = await req.json(); }
  catch { return errorResponse("Request body must be valid JSON.", 400); }

  const v = validatePromptInput(body);
  if (!v.ok) return errorResponse(v.error, v.status);

  // 4 ── Call Gemini ─────────────────────────────────────────────────────────
  try {
    const result = await callGeminiJSON<ImproveResult>(
      buildImprovePromptMessage(v.prompt),
      {
        systemInstruction: IMPROVE_PROMPT_SYSTEM,
        temperature:       0.65,
        maxOutputTokens:   1024,
      }
    );

    // Guard against unexpected shapes from the model
    if (typeof result.improved !== "string" || !Array.isArray(result.changes)) {
      return errorResponse("AI returned an unexpected response. Please try again.", 500);
    }

    return successResponse<ImproveResult>({
      improved: result.improved.trim(),
      changes:  result.changes.map((c: string) => c.trim()).slice(0, 5),
      category: (result.category ?? "general").trim().toLowerCase(),
      tone:     (result.tone     ?? "neutral").trim().toLowerCase(),
    });

  } catch (err) {
    if (err instanceof GeminiError) {
      if (err.statusCode === 429)
        return errorResponse("Gemini rate limit hit. Wait a moment.", 429);
      return errorResponse("AI service temporarily unavailable.", 502);
    }
    console.error("[improve-prompt]", err);
    return errorResponse("Unexpected server error.", 500);
  }
}

// Block other HTTP methods
export const GET    = () => errorResponse("Method not allowed.", 405);
export const PUT    = () => errorResponse("Method not allowed.", 405);
export const DELETE = () => errorResponse("Method not allowed.", 405);
