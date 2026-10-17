import type { ProjectVisual as Visual } from "@/data";

// Generative SVG artwork for each project, used until real screenshots are added.
// Everything uses currentColor / CSS vars so it follows the active theme.

function Orbit() {
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
      <defs>
        <radialGradient id="earth" cx="40%" cy="40%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="150" r="58" fill="url(#earth)" stroke="var(--accent)" strokeOpacity="0.5" />
      {[0, 60, 120].map((rot, i) => (
        <g key={rot} transform={`rotate(${rot - 20} 200 150)`}>
          <ellipse cx="200" cy="150" rx={110 + i * 22} ry={38 + i * 8} fill="none" stroke="var(--accent)" strokeOpacity="0.28" strokeDasharray="3 5" />
          <circle r="4" fill="var(--accent)">
            <animateMotion dur={`${9 + i * 4}s`} repeatCount="indefinite" path={`M ${90 - i * 22} 150 a ${110 + i * 22} ${38 + i * 8} 0 1 0 ${2 * (110 + i * 22)} 0 a ${110 + i * 22} ${38 + i * 8} 0 1 0 ${-2 * (110 + i * 22)} 0`} />
          </circle>
        </g>
      ))}
      {/* conjunction warning */}
      <g transform="translate(300 78)">
        <circle r="14" fill="none" stroke="var(--fg)" strokeOpacity="0.8">
          <animate attributeName="r" values="6;22;6" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="var(--accent)" />
      </g>
      <text x="318" y="66" fontFamily="var(--font-code)" fontSize="9" fill="var(--accent-text)">P(c) HIGH</text>
    </svg>
  );
}

function Attendance() {
  const rows = [
    ["CS-2041", "PRESENT", 1],
    ["CS-2042", "PRESENT", 1],
    ["CS-2043", "PROXY BLOCKED", 0],
    ["CS-2044", "PRESENT", 1],
  ] as const;
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
      <rect x="135" y="30" width="130" height="240" rx="22" fill="var(--bg-elev)" stroke="var(--accent)" strokeOpacity="0.45" />
      <text x="200" y="72" textAnchor="middle" fontFamily="var(--font-code)" fontSize="10" fill="var(--muted)">SESSION CODE</text>
      <text x="200" y="108" textAnchor="middle" fontFamily="var(--font-display)" fontSize="34" fontWeight="700" fill="var(--accent)" letterSpacing="6">4827</text>
      <rect x="160" y="120" width="80" height="4" rx="2" fill="var(--line-strong)" />
      <rect x="160" y="120" width="80" height="4" rx="2" fill="var(--accent)">
        <animate attributeName="width" values="80;0" dur="6s" repeatCount="indefinite" />
      </rect>
      {rows.map(([id, status, ok], i) => (
        <g key={id} transform={`translate(150 ${145 + i * 28})`}>
          <rect width="100" height="22" rx="6" fill={ok ? "var(--accent-soft)" : "var(--line)"} />
          <text x="8" y="14.5" fontFamily="var(--font-code)" fontSize="7.5" fill="var(--muted)">{id}</text>
          <text x="94" y="14.5" textAnchor="end" fontFamily="var(--font-code)" fontSize="7" fill={ok ? "var(--accent-text)" : "var(--fg)"}>{status}</text>
        </g>
      ))}
      <g fontFamily="var(--font-code)" fontSize="9" fill="var(--muted)">
        <text x="40" y="90">device ✓</text>
        <text x="300" y="130">socket.io ⇄</text>
        <text x="36" y="200">otp ✓</text>
        <text x="296" y="220">excel ↓</text>
      </g>
    </svg>
  );
}

function Rag() {
  const docs = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
      {docs.map((d) => (
        <g key={d} transform={`translate(30 ${40 + d * 46})`}>
          <rect width="58" height="36" rx="6" fill="var(--bg-elev)" stroke="var(--line-strong)" />
          <rect x="8" y="9" width="34" height="3" rx="1.5" fill="var(--faint)" />
          <rect x="8" y="17" width="42" height="3" rx="1.5" fill="var(--faint)" />
          <rect x="8" y="25" width="24" height="3" rx="1.5" fill="var(--faint)" />
        </g>
      ))}
      {/* vector space */}
      <g transform="translate(200 150)">
        <circle r="62" fill="none" stroke="var(--accent)" strokeOpacity="0.25" strokeDasharray="2 4" />
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i * 137.5 * Math.PI) / 180;
          const r = 12 + ((i * 29) % 48);
          const hit = i % 6 === 0;
          return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={hit ? 4 : 2.2} fill={hit ? "var(--accent)" : "var(--faint)"} />;
        })}
      </g>
      {docs.map((d) => (
        <line key={d} x1="90" y1={58 + d * 46} x2="140" y2="150" stroke="var(--line-strong)" />
      ))}
      <path d="M262 150 H 300" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="16;0" dur="0.8s" repeatCount="indefinite" />
      </path>
      <rect x="300" y="118" width="74" height="64" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x="337" y="146" textAnchor="middle" fontFamily="var(--font-code)" fontSize="10" fill="var(--accent-text)">LLM</text>
      <text x="337" y="162" textAnchor="middle" fontFamily="var(--font-code)" fontSize="7.5" fill="var(--muted)">grounded</text>
      <text x="200" y="240" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--muted)">embed → retrieve → rerank</text>
    </svg>
  );
}

function Recommender() {
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
      <g transform="translate(40 70)">
        <rect width="88" height="130" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" />
        <polygon points="36,50 36,80 60,65" fill="var(--accent)" />
        <text x="44" y="152" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--accent-text)">you picked</text>
      </g>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 170 + (i % 3) * 66;
        const y = 40 + Math.floor(i / 3) * 120;
        const sim = [0.94, 0.91, 0.88, 0.86, 0.83][i];
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <line x1="-42" y1="95" x2="0" y2="45" stroke="var(--line-strong)" />
            <rect width="54" height="86" rx="8" fill="var(--bg-elev)" stroke="var(--line-strong)" />
            <rect x="6" y="6" width="42" height="54" rx="4" fill="var(--faint)" fillOpacity="0.25" />
            <text x="27" y="76" textAnchor="middle" fontFamily="var(--font-code)" fontSize="8" fill="var(--accent-text)">{sim.toFixed(2)}</text>
          </g>
        );
      })}
      <text x="270" y="290" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--muted)">cosine similarity · top 5</text>
    </svg>
  );
}

function Neural() {
  const layers = [4, 6, 6, 3];
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
      {layers.map((n, li) =>
        Array.from({ length: n }).map((_, ni) => {
          const x = 70 + li * 87;
          const y = 150 + (ni - (n - 1) / 2) * 38;
          const next = layers[li + 1];
          return (
            <g key={`${li}-${ni}`}>
              {next &&
                Array.from({ length: next }).map((_, nj) => (
                  <line key={nj} x1={x} y1={y} x2={x + 87} y2={150 + (nj - (next - 1) / 2) * 38} stroke="var(--accent)" strokeOpacity="0.12" />
                ))}
              <circle cx={x} cy={y} r="7" fill="var(--bg-elev)" stroke="var(--accent)" />
            </g>
          );
        }),
      )}
    </svg>
  );
}

function Generic() {
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={60 + i * 36} y={230 - (i * 37) % 150 - 30} width="22" height={(i * 37) % 150 + 30} rx="4" fill="var(--accent)" fillOpacity={0.15 + (i % 3) * 0.2} />
      ))}
    </svg>
  );
}

const map: Record<Visual, () => React.JSX.Element> = {
  orbit: Orbit,
  attendance: Attendance,
  rag: Rag,
  recommender: Recommender,
  neural: Neural,
  generic: Generic,
};

export function ProjectVisual({ visual }: { visual: Visual }) {
  const Comp = map[visual];
  return <Comp />;
}
