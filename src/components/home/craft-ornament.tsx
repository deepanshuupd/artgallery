/** Decorative geometry inspired by Aipan linework, not a ritual diagram. */
export function CraftOrnament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="92" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="85" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="65" strokeWidth="0.8" />
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 22.5} 100 100)`}>
          <path d="M100 18 Q85 35 100 48 Q115 35 100 18Z" strokeWidth="1" />
          <circle cx="100" cy="11" r="1.7" fill="currentColor" stroke="none" />
        </g>
      ))}
      <path d="M100 50 Q66 70 100 100 Q134 70 100 50ZM150 100 Q130 66 100 100 Q130 134 150 100ZM100 150 Q134 130 100 100 Q66 130 100 150ZM50 100 Q70 134 100 100 Q70 66 50 100Z" />
      <circle cx="100" cy="100" r="7" fill="currentColor" stroke="none" />
    </svg>
  );
}
