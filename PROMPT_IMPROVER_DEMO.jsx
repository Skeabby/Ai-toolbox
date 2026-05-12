
import { useState, useRef, useCallback } from "react";

const EXAMPLES = [
  "write me a story",
  "explain machine learning",
  "help fix my code",
  "make a marketing email for my app",
  "summarise this research paper",
  "give me feedback on my essay",
];

const CAT_COLORS = {
  creative:       { bg: "rgba(244,63,94,.1)",   border: "rgba(244,63,94,.3)",   text: "#fb7185" },
  technical:      { bg: "rgba(59,130,246,.1)",  border: "rgba(59,130,246,.3)",  text: "#60a5fa" },
  analytical:     { bg: "rgba(245,158,11,.1)",  border: "rgba(245,158,11,.3)",  text: "#fbbf24" },
  instructional:  { bg: "rgba(16,185,129,.1)",  border: "rgba(16,185,129,.3)",  text: "#34d399" },
  conversational: { bg: "rgba(139,92,246,.1)",  border: "rgba(139,92,246,.3)",  text: "#a78bfa" },
  research:       { bg: "rgba(6,182,212,.1)",   border: "rgba(6,182,212,.3)",   text: "#22d3ee" },
};

const TONE_LABEL = { formal: "Formal", neutral: "Neutral", casual: "Casual" };

const MAX = 2000;
const MIN = 10;

function Skeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {[100, 90, 80, 100, 75, 45, 55, 40].map((w, i) => (
        <div key={i} style={{
          height: 14, borderRadius: 7,
          background: i < 5 ? "#1e1e2e" : "#191926",
          width: `${w}%`,
          animation: "shimmer 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.07}s`,
        }} />
      ))}
    </div>
  );
}

export default function PromptImprover() {
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [copied,  setCopied]  = useState(false);
  const outputRef = useRef(null);

  const tooShort = input.trim().length < MIN;
  const tooLong  = input.length > MAX;

  const improve = useCallback(async () => {
    if (tooShort || tooLong || loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const sys = `You are an expert prompt engineer. Rewrite the user's rough prompt to be specific, clear, and highly effective for AI models.

Rules:
1. ADD specificity — replace vague words with concrete ones
2. ADD context the AI needs  
3. SPECIFY desired output format when helpful
4. ADD constraints: length, tone, audience
5. PRESERVE the original intent exactly
6. NO meta-commentary — output the improved prompt directly

Classify as: creative | technical | analytical | instructional | conversational | research
List exactly 3 specific improvements made.

Respond ONLY with JSON, no markdown fences:
{"improved":"...","changes":["...","...","..."],"category":"...","tone":"formal|neutral|casual"}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sys,
          messages: [{ role: "user", content: `Improve this prompt: "${input.trim()}"` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text ?? "";
      const clean = raw.replace(/^```json\s*/i,"").replace(/```\s*$/i,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 80);
    } catch(e) {
      setError("Failed to improve prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, tooShort, tooLong]);

  const copy = () => {
    if (!result?.improved) return;
    navigator.clipboard.writeText(result.improved).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const catC = result ? (CAT_COLORS[result.category] ?? CAT_COLORS.conversational) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a12", fontFamily:"'DM Sans',system-ui,sans-serif", padding:"28px 20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box }
        textarea:focus { outline:none }
        button { font-family:inherit; cursor:pointer }
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.7} }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        .fade-in { animation: fadeIn .3s ease forwards }
        .pill-btn:hover { border-color:#4a4470 !important; color:#a09ad0 !important }
        .improve-btn:hover:not(:disabled) { background:#342d48 !important; border-color:#6c63a8 !important; box-shadow: 0 8px 24px rgba(108,99,168,.15) !important }
        .improve-btn:active:not(:disabled) { transform:scale(.98) }
        .copy-btn:hover { border-color:#4a4470 !important; color:#a09ad0 !important }
        .retry-btn:hover { border-color:#4a4470 !important; color:#a09ad0 !important }
        .ex-btn:hover { border-color:#4a4470 !important; color:#a09ad0 !important }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth:900, margin:"0 auto 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#1e1a30", border:"1px solid #3d3660", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🪄</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#e8e5f5", margin:0 }}>Prompt Improver</h1>
        </div>
        <p style={{ fontSize:13, color:"#484868", lineHeight:1.6, margin:0 }}>
          Paste any rough prompt and AI rewrites it to be specific, clear, and highly effective — with a breakdown of every change made.
        </p>
      </div>

      {/* Two columns */}
      <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

        {/* LEFT — Input */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Example chips */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {EXAMPLES.map(ex => (
              <button key={ex} className="ex-btn" onClick={() => { setInput(ex); setResult(null); setError(null); }} style={{
                display:"flex", alignItems:"center", gap:5,
                borderRadius:99, border:"1px solid #1e1e2c", background:"#111119",
                padding:"4px 11px", fontSize:11, color:"#484868",
                transition:"all .14s",
              }}>💡 {ex}</button>
            ))}
          </div>

          {/* Textarea card */}
          <div style={{
            borderRadius:18, border:`1px solid ${tooLong ? "rgba(244,63,94,.5)" : error ? "rgba(244,63,94,.3)" : "#1e1e2c"}`,
            background:"#111119", transition:"border-color .2s",
          }}>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setError(null); if(result) setResult(null); }}
              onKeyDown={e => { if((e.metaKey||e.ctrlKey)&&e.key==="Enter") improve(); }}
              placeholder={"e.g. write me a story about space\n\nTip: even one sentence works — the vaguer, the more dramatic the difference."}
              rows={11}
              style={{
                width:"100%", resize:"none", borderRadius:"16px 16px 0 0",
                background:"transparent", padding:"16px", fontSize:13, lineHeight:1.7,
                color:"#d0ccec", border:"none",
                fontFamily:"inherit",
              }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 16px", borderTop:"1px solid #181825" }}>
              <span style={{ fontSize:11, color: tooLong ? "#fb7185" : input.length > MAX-200 ? "#fbbf24" : "#303050" }}>
                {input.length} / {MAX}
              </span>
              <span style={{ fontSize:11, color:"#252540" }}>⌘ Enter</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="fade-in" style={{ display:"flex", gap:10, padding:"12px 14px", borderRadius:12, border:"1px solid rgba(244,63,94,.2)", background:"rgba(244,63,94,.06)" }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <p style={{ fontSize:12, color:"#fca5a5", margin:0, lineHeight:1.5 }}>{error}</p>
            </div>
          )}

          {/* Button */}
          <button
            className="improve-btn"
            onClick={improve}
            disabled={tooShort || tooLong || loading}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              borderRadius:14, border:"1px solid #3d3660",
              background:"#1e1a30", padding:"13px",
              fontSize:14, fontWeight:600, color:"#c4bbf0",
              transition:"all .2s", opacity: (tooShort||tooLong) ? .4 : 1,
            }}
          >
            {loading ? (
              <>
                <span style={{ width:16, height:16, border:"2px solid #4a4470", borderTopColor:"#9d94d8", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
                Improving…
              </>
            ) : (
              <> ✨ Improve Prompt &nbsp;›</>
            )}
          </button>

          {/* Validation hint */}
          {tooShort && input.length > 0 && (
            <p style={{ fontSize:11, color:"#484868", textAlign:"center", margin:"-4px 0" }}>
              Add a bit more detail ({MIN - input.trim().length} more char{MIN - input.trim().length !== 1 ? "s" : ""} needed)
            </p>
          )}
        </div>

        {/* RIGHT — Output */}
        <div ref={outputRef} style={{ borderRadius:18, border:"1px solid #1e1e2c", background:"#111119", display:"flex", flexDirection:"column" }}>

          {/* Output header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px", borderBottom:"1px solid #181825" }}>
            <span style={{ fontSize:12, color:"#424260", fontWeight:500 }}>→ Improved prompt</span>
            {result && (
              <div style={{ display:"flex", gap:7 }}>
                <button className="retry-btn" onClick={() => { setResult(null); improve(); }} disabled={loading} style={{
                  display:"flex", alignItems:"center", gap:5, borderRadius:8,
                  border:"1px solid #1e1e2c", background:"none", padding:"5px 10px",
                  fontSize:11, color:"#484868", transition:"all .14s",
                }}>
                  <span style={{ display:"inline-block", animation: loading ? "spin .7s linear infinite" : "none" }}>↻</span> Retry
                </button>
                <button className="copy-btn" onClick={copy} style={{
                  display:"flex", alignItems:"center", gap:5, borderRadius:8, padding:"5px 10px",
                  border: copied ? "1px solid rgba(16,185,129,.35)" : "1px solid #1e1e2c",
                  background: copied ? "rgba(16,185,129,.1)" : "none",
                  fontSize:11, color: copied ? "#34d399" : "#484868",
                  transition:"all .14s",
                }}>
                  {copied ? "✓ Copied" : "⧉ Copy"}
                </button>
              </div>
            )}
          </div>

          {/* Output body */}
          <div style={{ flex:1, padding:"18px", minHeight:280 }}>
            {loading ? (
              <Skeleton />
            ) : result ? (
              <div className="fade-in">
                {/* Improved text */}
                <p style={{ fontSize:13, color:"#ccc8e8", lineHeight:1.75, whiteSpace:"pre-wrap", margin:0 }}>
                  {result.improved}
                </p>

                <div style={{ borderTop:"1px solid #181825", margin:"18px 0" }} />

                {/* Badges */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                  {result.category && catC && (
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:5,
                      borderRadius:99, border:`1px solid ${catC.border}`,
                      background: catC.bg, padding:"3px 10px",
                      fontSize:11, fontWeight:500, color: catC.text,
                      textTransform:"capitalize",
                    }}>
                      🏷 {result.category}
                    </span>
                  )}
                  {result.tone && (
                    <span style={{ borderRadius:99, border:"1px solid #2a2a3d", background:"#181826", padding:"3px 10px", fontSize:11, color:"#484868" }}>
                      {TONE_LABEL[result.tone] ?? result.tone} tone
                    </span>
                  )}
                </div>

                {/* Changes */}
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"#303050", marginBottom:10 }}>
                  What changed
                </p>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:8 }}>
                  {(result.changes ?? []).map((c, i) => (
                    <li key={i} style={{ display:"flex", gap:10, fontSize:12, color:"#606080", lineHeight:1.5 }}>
                      <span style={{
                        flexShrink:0, width:20, height:20, borderRadius:"50%",
                        background:"#1e1a30", border:"1px solid #3a3660",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, fontWeight:600, color:"#9d94d8",
                      }}>{i+1}</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              /* Empty state */
              <div style={{ height:"100%", minHeight:240, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"#151520", border:"1px solid #1e1e2c", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>🪄</div>
                <p style={{ fontSize:13, fontWeight:500, color:"#303050", margin:"0 0 6px" }}>Your improved prompt appears here</p>
                <p style={{ fontSize:12, color:"#252538", margin:0 }}>Type a prompt on the left, then click Improve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
