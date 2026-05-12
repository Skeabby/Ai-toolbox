// ─────────────────────────────────────────────────────────────────────────────
//  lib/ai/prompts.ts
//
//  Central registry for every system prompt + message builder in the app.
//  Keeping prompts here means easy iteration, A/B testing, and readability.
// ─────────────────────────────────────────────────────────────────────────────

// ── Prompt Improver ───────────────────────────────────────────────────────────

export const IMPROVE_PROMPT_SYSTEM = `\
You are an expert prompt engineer with deep knowledge of how to craft \
effective instructions for AI models such as GPT-4, Claude, and Gemini.

Your task: rewrite the user's rough, vague, or poorly-structured prompt \
into a precise, professional, and highly effective version.

Rules:
1. ADD specificity — replace vague words ("good", "nice") with concrete ones.
2. ADD context — include relevant background the AI needs to answer well.
3. SPECIFY format — request a numbered list, table, JSON, or markdown when appropriate.
4. ADD constraints — length, tone, audience, style, what to avoid.
5. PRESERVE intent — never change what the user is actually asking for.
6. DO NOT pad — every sentence must earn its place. No filler.
7. NO meta-commentary — output the improved prompt directly, not "Here is…".

Categorise the prompt as one of:
  creative | technical | analytical | instructional | conversational | research

Describe exactly 3–5 specific improvements you made.

Respond ONLY with valid JSON — no markdown, no extra text — matching this schema exactly:
{
  "improved": "<the full rewritten prompt>",
  "changes":  ["<specific change 1>", "<specific change 2>", "<specific change 3>"],
  "category": "<one of the six categories>",
  "tone":     "<formal | neutral | casual>"
}`;

export function buildImprovePromptMessage(rawPrompt: string): string {
  return `Improve this prompt:\n\n"${rawPrompt}"`;
}

// ── Quiz Generator (Phase 4) ──────────────────────────────────────────────────

export const QUIZ_SYSTEM = `\
You are an expert educator creating multiple-choice quiz questions.
Generate clear questions with four options (A–D), one correct answer, and a short explanation.
Respond only with valid JSON.`;

export function buildQuizMessage(topic: string, count: number, difficulty: string): string {
  return `Generate ${count} ${difficulty} multiple-choice questions about: "${topic}".
JSON: { "questions": [{ "question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"answer":"A","explanation":"..." }] }`;
}

// ── Flashcard Generator (Phase 5) ─────────────────────────────────────────────

export const FLASHCARD_SYSTEM = `\
You are an expert educator creating concise flashcard pairs.
Front: question or term. Back: clear, memorable answer. Respond only with valid JSON.`;

export function buildFlashcardMessage(topic: string, count: number): string {
  return `Create ${count} flashcard pairs about: "${topic}".
JSON: { "cards": [{ "front":"...","back":"..." }] }`;
}

// ── Debate Helper (Phase 8) ───────────────────────────────────────────────────

export const DEBATE_SYSTEM = `\
You are a debate coach. Generate well-reasoned arguments for and against a position.
Each argument: 1–2 sentences, evidence-based. Respond only with valid JSON.`;

export function buildDebateMessage(topic: string, position: string): string {
  return `Topic: "${topic}". Position: "${position}".
JSON: { "for":["...","...","..."],"against":["...","...","..."],"verdict":"balanced one-sentence summary" }`;
}
