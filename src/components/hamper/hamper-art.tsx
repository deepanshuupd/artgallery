import type { HamperPieceId } from "@/data/hamper-pieces";
import styles from "./hamper-art.module.css";

/** Small original vector illustrations: no photo downloads or runtime optimisation. */
export function HamperPieceArt({ id, className }: { id: HamperPieceId; className?: string }) {
  let drawing;
  switch (id) {
    case "pendant": drawing = <><path d="M27 14C8 61 27 61 50 76C73 61 92 61 73 14" stroke="#b58a46" strokeWidth="3" /><path d="M30 14C15 58 32 58 50 70C68 58 85 58 70 14" stroke="#e1b974" /><circle cx="50" cy="77" r="12" fill="#dab374" /><path d="m50 67 7 10-7 10-7-10Z" fill="#913d32" /><circle cx="50" cy="77" r="3" fill="#fff0cf" /></>; break;
    case "earrings": drawing = <>{[29, 71].map(x => <g key={x}><path d={`M${x-7} 19q0-16 10-11q7 4-3 15`} stroke="#b58a46" strokeWidth="2.5" /><path d={`M${x} 22q-19 25-14 39q14 24 28 0q5-14-14-39Z`} fill="#d6ae67" /><path d={`M${x} 31q-12 19-9 27q9 16 18 0q3-8-9-27Z`} fill="#31594b" /><circle cx={x} cy="81" r="4" fill="#e8c986" /></g>)}</>; break;
    case "clutcher": drawing = <g transform="rotate(-16 50 50)"><path d="M20 36Q17 28 27 27H73Q83 28 80 36L73 61H27Z" fill="#cf9a79" /><path d="M20 38Q50 51 80 38M30 29l-2 30m14-31-1 36m16-36 1 36m13-35 2 30" stroke="#8c593f" /><path d="M27 59v14q4 10 8 0V61m8 2v15q4 8 8 0V63m8-2v12q4 10 8 0V59" strokeWidth="4" stroke="#a66749" /><path d="M40 26q10-9 20 0" /></g>; break;
    case "scrunchie": drawing = <><path d="M45 14q8-8 15 1q11-3 16 8q13 2 13 15q10 9 2 19q5 12-8 17q-2 13-15 13q-9 10-19 2q-12 5-17-8q-13-2-13-15q-10-9-2-19q-5-12 8-17q2-13 13-13Z" fill="#c89499" /><circle cx="51" cy="51" r="18" fill="#fcf5e9" /><path d="m35 23 9 13m26-12-9 14m21 15-13-1M71 78 60 65m-27 13 9-13M22 50l13 2" stroke="#995f70" /></>; break;
    case "keychain": drawing = <><circle cx="51" cy="13" r="9" stroke="#ba985f" strokeWidth="3" /><path d="M51 22v12" stroke="#ba985f" strokeWidth="3" /><circle cx="32" cy="37" r="10" fill="#bd906a" /><circle cx="68" cy="37" r="10" fill="#bd906a" /><ellipse cx="50" cy="55" rx="24" ry="26" fill="#d5ae85" /><ellipse cx="50" cy="65" rx="12" ry="9" fill="#f4dfc6" /><circle cx="41" cy="52" r="2" fill="#554238" /><circle cx="59" cy="52" r="2" fill="#554238" /><path d="m47 60 3 3 3-3m-3 3v5" /><path d="M27 82q23-20 46 0l-7 9-16-8-16 8Z" fill="#a84530" /></>; break;
    case "bracelet": drawing = <>{Array.from({length:12}, (_,i) => { const a=i*Math.PI/6; return <circle key={i} cx={Number((50+28*Math.cos(a)).toFixed(3))} cy={Number((50+28*Math.sin(a)).toFixed(3))} r="6" fill={i%3===0 ? "#31594b" : "#d3ac66"} />; })}<path d="M50 78v8" stroke="#b58a46" /><path d="m50 84 7 6-7 6-7-6Z" fill="#a84530" /></>; break;
    case "bangles": drawing = <g transform="rotate(-18 50 50)">{[30,40,50,60,70].map((y,i)=><g key={y}><ellipse cx="50" cy={y} rx="29" ry="12" fill="none" stroke={i%2 ? "#b57d45" : "#a5443b"} strokeWidth="6" /><path d={`M23 ${y-2}q27 19 54 0`} stroke="#ebcb87" strokeWidth="2" /></g>)}</g>; break;
    case "lipstick": drawing = <g transform="rotate(15 50 50)"><path d="M38 43V22l24-12v33Z" fill="#a64443" /><path d="m38 22 24-12v7L38 29" fill="#ce7970" /><path d="M34 43h32v17H34Z" fill="#d4b072" /><path d="M33 60h34v30H33Z" fill="#2a493e" /><path d="M37 64h26m-13 5v15" stroke="#b79557" /></g>; break;
    case "ittar": drawing = <><path d="M37 25h26v12H37Z" fill="#c7a06b" /><path d="M32 7h36v18H32Z" fill="#be914f" /><path d="M35 37h30q9 0 9 11v38q0 6-7 6H33q-7 0-7-6V48q0-11 9-11Z" fill="#ddb983" /><path d="M32 44h36v41H32Z" fill="#e7cfa9" /><path d="M34 53h32v23H34Z" fill="#31594b" /><path d="m50 57 6 8-6 8-6-8Z" fill="#e8c88d" /><path d="M35 12h30m-30 6h30" /></>; break;
    case "candle": drawing = <><ellipse cx="50" cy="81" rx="33" ry="10" fill="#c7a4bf" /><path d="M17 68v13q33 17 66 0V68Z" fill="#ba90b1" /><ellipse cx="50" cy="68" rx="33" ry="11" fill="#e1c6dc" />{[0,60,120,180,240,300].map(angle=><ellipse key={angle} cx="50" cy="48" rx="10" ry="19" fill="#fff2d8" transform={`rotate(${angle} 50 60)`} />)}<circle cx="50" cy="60" r="8" fill="#efd9b2" /><path d="M50 57V43" /><path d="M50 43q-10-10 0-22q10 12 0 22Z" fill="#dc9c49" stroke="none" /></>; break;
    case "chocolate": drawing = <g transform="rotate(-12 50 50)"><path d="M28 17h44v70H28Z" fill="#795749" /><path d="M34 24h13v17H34zm19 0h13v17H53ZM34 47h13v17H34zm19 0h13v17H53Z" fill="#a3795c" /><path d="m23 60 27-7 27 7v31H23Z" fill="#803958" /><path d="M28 68h44m-24 5h20" stroke="#edce8b" /><path d="m31 57 5-7 6 5 7-8 7 5 8-6 8 11" stroke="#e2cbaa" /></g>; break;
    case "jar": drawing = <><path d="M25 15h50v13H25Z" fill="#c39d5c" /><path d="M27 28h46l6 13v43q-2 9-29 9t-29-9V41Z" fill="#f4e2bb" /><path d="M22 44q28-12 56 0v30q-28 12-56 0Z" fill="#476650" />{[0,72,144,216,288].map(angle=><ellipse key={angle} cx="50" cy="54" rx="5" ry="10" fill="#eab28f" transform={`rotate(${angle} 50 63)`} />)}<circle cx="50" cy="63" r="4" fill="#e4bd70" /><path d="M25 20h50m-48 60q23 9 46 0" stroke="#bd9859" /></>; break;
    case "rakhi": drawing = <><path d="M4 50h92" stroke="#a5443b" strokeWidth="4" /><path d="M3 56h94" stroke="#d5ac60" /><circle cx="50" cy="50" r="24" fill="#af4939" /><circle cx="50" cy="50" r="19" stroke="#e7c281" strokeDasharray="2 3" />{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="50" cy="41" rx="4" ry="9" fill="#f7e7c5" transform={`rotate(${a} 50 50)`} />)}<circle cx="50" cy="50" r="5" fill="#cba66b" /></>; break;
    case "roli": drawing = <>{[30,70].map((x,i)=><g key={x}><path d={`M${x-11} 25h22v12h-22Z`} fill="#bba474" /><path d={`M${x-15} 38h30v43q-15 8-30 0Z`} fill={i ? "#f2e5c6" : "#ae4835"} /><path d={`M${x-10} 49h20v20h-20Z`} fill="#fff5df" /><path d={`m${x} 52 5 7-5 7-5-7Z`} fill={i ? "#b49563" : "#a84530"} /></g>)}</>; break;
    case "note": drawing = <g transform="rotate(-9 50 50)"><path d="M15 30h70v54H15Z" fill="#e8d9b8" /><path d="M18 13h64v50H18Z" fill="#fff7e5" /><path d="M26 26h43m-43 9h37m-37 9h22" stroke="#b49470" /><path d="m15 30 35 30 35-30M15 84l23-24m47 24L62 60" /><path d="M46 68q-9-10-13 0q-1 7 13 14q14-7 13-14q-4-10-13 0Z" fill="#a84530" /></g>; break;
    case "lights": drawing = <><path d="M31 15h24l5 12-5 12H31l-5-12Z" fill="#caa16c" /><path d="M44 39q50 0 35 29T21 69q-17-22 27-15" stroke="#8d8b5b" />{[[65,43],[80,56],[67,78],[37,85],[18,65],[39,55]].map(([x,y])=><g key={x}><path d={`M${x} ${y-4}v-6`} /><ellipse cx={x} cy={y} rx="4" ry="6" fill="#edc265" stroke="#ba9454" /></g>)}</>; break;
  }
  return <svg className={className} viewBox="0 0 100 100" fill="none" stroke="#70543d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>;
}

export function HamperBasketArt({ pieces = [], pulse = 0, className }: {
  pieces?: Array<{ id: HamperPieceId; quantity?: number }>; pulse?: number; className?: string;
}) {
  return <div className={`${styles.scene} ${className || ""}`} aria-hidden="true">
    <svg className={styles.back} viewBox="0 0 380 260" fill="none">
      <ellipse cx="190" cy="236" rx="125" ry="13" fill="#6b4c2b" opacity=".09" />
      <path d="M98 151C81 10 299 10 282 151" stroke="#a77748" strokeWidth="13" />
      <path d="M98 150C85 17 295 17 282 150" stroke="#dfbc83" strokeWidth="5" />
      <path d="M68 131Q190 100 312 131L295 187H85Z" fill="#bf8a54" />
    </svg>
    <div className={styles.contents}>
      {pieces.slice(0, 10).map((piece,i) => <div className={styles.tucked} key={piece.id} style={{ left: `${14 + (i % 5) * 14}%`, bottom: `${38 + Math.floor(i/5) * 18}%`, transform: `rotate(${[-16,9,-6,14,-9][i%5]}deg)` }}>
        <HamperPieceArt id={piece.id} />
        {(piece.quantity || 0) > 1 && <span>{piece.quantity}</span>}
      </div>)}
    </div>
    <svg className={styles.front} viewBox="0 0 380 260" fill="none" key={pulse} data-pulse={pulse > 0 || undefined}>
      <path d="M65 134Q190 158 315 134L287 226Q190 250 93 226Z" fill="#ce9b60" stroke="#8b623c" strokeWidth="2" />
      {[151,163,175,187,199,211,223].map(y=><path key={y} d={`M${65+(y-134)*.3} ${y}Q190 ${y+25} ${315-(y-134)*.3} ${y}`} stroke="#9e744b" strokeWidth="2" />)}
      {[95,115,135,155,175,195,215,235,255,275,295].map(x=><path key={x} d={`M${x} 143L${190+(x-190)*.77} 230`} stroke="#e7bd87" strokeWidth="3" />)}
      <path d="M65 134Q190 158 315 134" stroke="#9b7043" strokeWidth="13" /><path d="M65 131Q190 155 315 131" stroke="#ecc999" strokeWidth="4" />
      <path d="m170 179 20-6 20 6v29l-20 9-20-9Z" fill="#a84530" stroke="#873b2b" />
      <path d="m190 178 8 14-8 15-8-15Z" stroke="#fff0d4" strokeWidth="1.5" />
      <circle cx="190" cy="192" r="3" fill="#fff0d4" />
    </svg>
  </div>;
}
