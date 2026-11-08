import type { Ref } from "react";

type Props = {
  classes: { rocket: string; ember: string; liquid: string; slosh: string; wave: string; bubble: string };
  fuseRef: Ref<SVGPathElement>; fuseCoreRef: Ref<SVGPathElement>; emberRef: Ref<SVGCircleElement>;
  tipRef: Ref<SVGCircleElement>; mouthRef: Ref<SVGRectElement>; liquidRef: Ref<SVGGElement>;
};

// A tall square whisky bottle in the classic Scotch style: bevelled corners,
// flat shoulders rounding into a double-collared neck, clear glass with a
// little amber left in it, and a slanted label. Unbranded: no maker's name or mark.
const glass = "M29 41v14.6c0 3.4-2.4 4.6-6.6 5.6-5.4 1.3-7.4 4.6-7.4 9.6V138q0 4 4 4h32q4 0 4-4V70.8c0-5-2-8.3-7.4-9.6-4.2-1-6.6-2.2-6.6-5.6V41Z";
const lean = "rotate(-13 35 38)";
// The whisky's surface: a gentle ripple, wider than the bottle so it can drift sideways forever.
const ripple = `M-10 65${"q2.5-1.1 5 0t5 0".repeat(10)}`;

export function RocketBottleArt({ classes, fuseRef, fuseCoreRef, emberRef, tipRef, mouthRef, liquidRef }: Props) {
  return (
    <svg viewBox="0 0 70 150" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="kr-glass-clip"><path d={glass} /></clipPath>
        <linearGradient id="kr-clear" x1="0" x2="1">
          <stop offset="0" stopColor="#17241a" stopOpacity=".78" />
          <stop offset=".12" stopColor="#4f6a55" stopOpacity=".42" />
          <stop offset=".32" stopColor="#d7ead6" stopOpacity=".24" />
          <stop offset=".68" stopColor="#c3dcc3" stopOpacity=".22" />
          <stop offset=".88" stopColor="#40594a" stopOpacity=".46" />
          <stop offset="1" stopColor="#121c14" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id="kr-whisky" gradientUnits="userSpaceOnUse" x1="15" x2="55" y1="0" y2="0">
          <stop offset="0" stopColor="#4a1e05" />
          <stop offset=".22" stopColor="#a8521a" />
          <stop offset=".45" stopColor="#e9952f" />
          <stop offset=".62" stopColor="#c56a1a" />
          <stop offset="1" stopColor="#3e1904" />
        </linearGradient>
        <linearGradient id="kr-bevel" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".42" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kr-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".75" />
          <stop offset=".8" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kr-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8382b" />
          <stop offset=".55" stopColor="#b3201a" />
          <stop offset="1" stopColor="#7d120e" />
        </linearGradient>
        <linearGradient id="kr-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#8a5c08" />
          <stop offset=".45" stopColor="#ffe08a" />
          <stop offset=".62" stopColor="#e3ab2c" />
          <stop offset="1" stopColor="#7a5006" />
        </linearGradient>
        <linearGradient id="kr-collar" x1="0" x2="1">
          <stop offset="0" stopColor="#3b3e35" />
          <stop offset=".35" stopColor="#c9d1c4" />
          <stop offset=".55" stopColor="#8d968a" />
          <stop offset="1" stopColor="#2a2c25" />
        </linearGradient>
        <linearGradient id="kr-tube" x1="0" x2="1">
          <stop offset="0" stopColor="#6e110d" />
          <stop offset=".28" stopColor="#c4261c" />
          <stop offset=".44" stopColor="#f0603f" />
          <stop offset=".64" stopColor="#c0241b" />
          <stop offset="1" stopColor="#5c0d09" />
        </linearGradient>
        <linearGradient id="kr-stick" x1="0" x2="1">
          <stop offset="0" stopColor="#7d5426" />
          <stop offset=".5" stopColor="#d6a967" />
          <stop offset="1" stopColor="#7d5426" />
        </linearGradient>
        <radialGradient id="kr-ground" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#2a1405" stopOpacity=".45" />
          <stop offset="1" stopColor="#2a1405" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="35" cy="145.5" rx="26" ry="3.8" fill="url(#kr-ground)" />

      {/* The stick leans in the neck with the rocket, seen through the glass. */}
      <g transform={lean}>
        <rect x="34.2" y="36" width="1.6" height="80" rx=".8" fill="url(#kr-stick)" />
      </g>

      <g clipPath="url(#kr-glass-clip)">
        {/* Clear glass, darker where it turns at the edges. */}
        <path d={glass} fill="url(#kr-clear)" />
        {/* The whisky, drawn full and lowered into place; each tap raises it a little. */}
        <g ref={liquidRef} className={classes.liquid}>
          <g className={classes.slosh} opacity=".92">
            <rect x="-10" y="65.6" width="90" height="84" fill="url(#kr-whisky)" />
            <g className={classes.wave}>
              <path d={`${ripple}V65.8H-10Z`} fill="url(#kr-whisky)" />
              <path d={ripple} fill="none" stroke="#f8bd62" strokeWidth=".9" />
            </g>
            <circle className={classes.bubble} cx="27" cy="71.5" r=".65" fill="#ffe6b0" />
            <circle className={classes.bubble} cx="41" cy="73.5" r=".5" fill="#ffe6b0" />
            <circle className={classes.bubble} cx="34" cy="76" r=".55" fill="#ffe6b0" />
          </g>
        </g>
        {/* The bevelled corners of a square bottle. */}
        <rect x="15" y="62" width="5" height="82" fill="url(#kr-bevel)" />
        <rect x="50" y="62" width="5" height="82" fill="url(#kr-bevel)" transform="rotate(180 52.5 103)" />
        <path d="M20 64v76M50 64v76" stroke="#fff" strokeOpacity=".24" strokeWidth=".6" />
        {/* A thick glass base. */}
        <rect x="10" y="138.4" width="50" height="4" fill="#d3e6d2" opacity=".4" />
      </g>

      {/* A red label with gold Aipan work, slanted across the front. */}
      <g clipPath="url(#kr-glass-clip)">
        <g transform="rotate(-18 35 101)">
          <rect x="18" y="90.5" width="34" height="21" rx="1" fill="url(#kr-red)" />
          <rect x="19.4" y="91.9" width="31.2" height="18.2" rx=".6" fill="none" stroke="url(#kr-gold)" strokeWidth=".85" />
          <g fill="#f3cf6e">
            {[22, 25.2, 28.4, 41.6, 44.8, 48].map(x => <circle key={`t${x}`} cx={x} cy="94" r=".5" />)}
            {[22, 25.2, 28.4, 41.6, 44.8, 48].map(x => <circle key={`b${x}`} cx={x} cy="108" r=".5" />)}
          </g>
          <circle cx="35" cy="101" r="5.8" fill="none" stroke="url(#kr-gold)" strokeWidth=".75" />
          <circle cx="35" cy="101" r="4" fill="#fbf1dc" />
          <g fill="#b3201a">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              return <circle key={i} cx={35 + Math.cos(angle) * 2.6} cy={101 + Math.sin(angle) * 2.6} r=".55" />;
            })}
            <circle cx="35" cy="101" r=".9" />
          </g>
          <path d="M22 98.6h6.6M41.4 98.6h6.6M22 103.4h6.6M41.4 103.4h6.6" stroke="#f3cf6e" strokeWidth=".65" strokeLinecap="round" />
        </g>
      </g>

      {/* Light on the glass: a long streak down the front, the shoulder, the far edge. */}
      <rect x="21.4" y="67" width="2.6" height="71" rx="1.3" fill="url(#kr-shine)" />
      <path d="M17.6 68.4c1.4-2.6 4-4.4 7.4-5.4" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="47.2" y="69" width="1.1" height="67" rx=".55" fill="url(#kr-shine)" opacity=".6" />
      <path d="M30.6 50v8" stroke="#fff" strokeOpacity=".55" strokeWidth="1.1" strokeLinecap="round" />
      <path d={glass} fill="none" stroke="#1b1d17" strokeOpacity=".6" strokeWidth=".7" />

      {/* A double collar at the neck, then the lip. */}
      <rect x="28" y="45.4" width="14" height="3" rx="1.3" fill="url(#kr-collar)" opacity=".8" />
      <rect x="28" y="41.4" width="14" height="3" rx="1.3" fill="url(#kr-collar)" opacity=".8" />
      <rect ref={mouthRef} x="28" y="37.4" width="14" height="3.4" rx="1.4" fill="url(#kr-collar)" />

      <g transform={lean}>
        <g className={classes.rocket}>
          <circle ref={tipRef} cx="35" cy="1" r=".1" fill="none" />
          <path d="M35 1c1.8 3 4.4 6.4 5.4 9H29.6c1-2.6 3.6-6 5.4-9Z" fill="url(#kr-gold)" />
          <path d="M35 1c.7 1.2 1.5 2.4 2.2 3.4h-4.4c.7-1 1.5-2.2 2.2-3.4Z" fill="#b8322a" />
          <rect x="29.6" y="10" width="10.8" height="26" rx="1.2" fill="url(#kr-tube)" />
          <rect x="29.6" y="11.4" width="10.8" height="2.2" fill="url(#kr-gold)" />
          <rect x="29.6" y="32" width="10.8" height="2.2" fill="url(#kr-gold)" />
          {/* A cracker-wrapper panel with a star, as printed on the paper tubes. */}
          <rect x="31" y="16.6" width="8" height="11.4" rx=".7" fill="#f7e6b8" />
          <path d="m35 18.6 1 2.3 2.5.2-1.9 1.6.6 2.4-2.2-1.3-2.2 1.3.6-2.4-1.9-1.6 2.5-.2Z" fill="#b8322a" />
          <rect x="31.8" y="26" width="6.4" height=".8" rx=".4" fill="#c9962a" />
          <path d="M32.6 11v24.4" stroke="#fff" strokeOpacity=".32" strokeWidth="1.1" strokeLinecap="round" />
          <rect x="29.6" y="34.6" width="10.8" height="1.4" rx=".5" fill="#3a0a06" opacity=".6" />
          {/* The fuse: a twisted green thread hanging out over the lip. */}
          <path ref={fuseRef} d="M31.6 35.8c-1.8 2.2-5.4 2.4-7 5-1 1.8-.6 3.6-1.8 5.2" fill="none" stroke="#3f7a2c" strokeWidth="1.15" strokeLinecap="round" />
          <path ref={fuseCoreRef} d="M31.6 35.8c-1.8 2.2-5.4 2.4-7 5-1 1.8-.6 3.6-1.8 5.2" fill="none" stroke="#c6dc86" strokeWidth=".42" strokeLinecap="round" strokeDasharray=".9 .9" />
          <circle ref={emberRef} className={classes.ember} cx="22.8" cy="46" r="1.5" fill="#fff4c0" />
        </g>
      </g>
    </svg>
  );
}
