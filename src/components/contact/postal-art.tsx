// Hand-drawn postal pieces for the contact page: a red pillar box and four
// Aipan-style stamp motifs. Line art only, so each stays a few hundred bytes.

export function PillarBox({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 120 200" aria-hidden="true">
    <defs>
      <linearGradient id="pillar-body" x1="0" x2="1">
        <stop offset="0" stopColor="#8f2318" /><stop offset=".35" stopColor="#d23b2c" /><stop offset=".6" stopColor="#c13023" /><stop offset="1" stopColor="#7c1d14" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="194" rx="46" ry="5" fill="#2f241d" opacity=".18" />
    <rect x="22" y="176" width="76" height="16" rx="3" fill="#7c1d14" />
    <rect x="26" y="52" width="68" height="128" fill="url(#pillar-body)" />
    <path d="M22 54c0-30 17-46 38-46s38 16 38 46Z" fill="url(#pillar-body)" />
    <rect x="18" y="50" width="84" height="9" rx="3" fill="#7c1d14" />
    <circle cx="60" cy="9" r="5" fill="#7c1d14" />
    <rect x="36" y="70" width="48" height="7" rx="3.5" fill="#2a1410" />
    <rect x="35" y="90" width="50" height="34" rx="2" fill="#fffaf1" />
    <text x="60" y="104" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7c1d14" letterSpacing=".6">POST</text>
    <text x="60" y="117" textAnchor="middle" fontSize="9" fill="#7c1d14" lang="hi">डाक</text>
    <path d="M44 140h32M44 148h32" stroke="#7c1d14" strokeWidth="2" opacity=".5" />
  </svg>;
}

// Stamp motifs, white line work on geru like an Aipan floor drawing.
const motif = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function StampArt({ kind }: { kind: number }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...motif}>
    {kind === 0 && <>{/* A framed piece: a square with a lotus */}
      <rect x="9" y="9" width="30" height="30" rx="1" /><rect x="13" y="13" width="22" height="22" rx="1" strokeDasharray="1 2.4" />
      <path d="M24 31c-5-3-6-8-6-11 3 1 5 3 6 6 1-3 3-5 6-6 0 3-1 8-6 11Zm0 0c-1-6 0-10 0-13 1 3 1 7 0 13Z" />
    </>}
    {kind === 1 && <>{/* Personal: a name plate with a heart */}
      <path d="M8 18h32v16H8z" /><path d="M14 18l10-8 10 8" /><path d="M24 30c-4-3-6-5-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2-2 4-6 7Z" />
      <path d="M11 38h26" strokeDasharray="1 2.4" />
    </>}
    {kind === 2 && <>{/* A gift: hamper with a bow */}
      <path d="M10 20h28l-3 18H13Z" /><path d="M10 20c0-7 6-12 14-12s14 5 14 12" /><path d="M17 26h14M16 32h16" strokeDasharray="1 2.4" />
      <path d="M24 20c-3-4-8-4-8-1s5 1 8 1c3 0 8 2 8-1s-5-3-8 1Z" />
    </>}
    {kind === 3 && <>{/* An order: a tied parcel */}
      <path d="M9 16l15-7 15 7v18l-15 7-15-7Z" /><path d="M9 16l15 7 15-7M24 23v18" /><path d="M16.5 12.5l15 7v6" />
    </>}
    <circle cx="24" cy="24" r="21" strokeDasharray="0.5 3.2" opacity=".55" />
  </svg>;
}
