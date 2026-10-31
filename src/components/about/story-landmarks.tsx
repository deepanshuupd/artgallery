import styles from "./story-landmarks.module.css";

/*
 * One landmark scene per town, drawn as layered silhouettes on a 400 x 200
 * canvas. They animate once when their town arrives (data-arrived on the stop);
 * without scripting, or with reduced motion, they show their finished state.
 */

const deodar = (x: number, base: number, height: number) => {
  const w = height * 0.32;
  return `M${x} ${base - height} L${x - w * 0.55} ${base - height * 0.55} L${x - w * 0.3} ${base - height * 0.55} L${x - w} ${base} L${x + w} ${base} L${x + w * 0.3} ${base - height * 0.55} L${x + w * 0.55} ${base - height * 0.55} Z`;
};

/** Baleshwar Temple, Champawat: a carved stone Shiva temple of the Chand kings, at sunset. */
export function BaleshwarTemple() {
  const bells = [146, 162, 178, 222, 238, 254];
  return (
    <svg className={`${styles.scene} ${styles.sunset}`} viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" role="img" aria-labelledby="baleshwar-title">
      <title id="baleshwar-title">Baleshwar Temple, Champawat: a carved stone temple among deodar trees at sunset</title>
      <circle className={styles.setSun} cx="200" cy="96" r="58" />
      <path className={styles.ridgeFar} d="M0 120 C50 96 90 104 130 112 C180 122 210 92 260 98 C320 106 360 88 400 100 V200 H0 Z" />
      <path className={styles.ridgeNear} d="M0 146 C60 128 110 136 150 142 L250 142 C300 134 350 126 400 138 V200 H0 Z" />
      <g className={styles.trees}>
        {[[26, 176, 54], [50, 178, 40], [72, 177, 30], [330, 176, 50], [354, 178, 40], [376, 177, 30]].map(([x, b, h]) => <path key={x} d={deodar(x, b, h)} />)}
      </g>
      <g className={styles.temple}>
        {/* Stepped stone plinth */}
        <path className={styles.stoneDark} d="M110 184 H290 V178 H110 Z" />
        <path className={styles.stone} d="M120 178 H280 V171 H120 Z M130 171 H270 V165 H130 Z" />
        {/* Side shrines with small curved spires */}
        <path className={styles.stone} d="M136 165 V140 H164 V165 Z M236 165 V140 H264 V165 Z" />
        <path className={styles.stone} d="M134 140 C136 126 144 116 150 112 C156 116 164 126 166 140 Z M234 140 C236 126 244 116 250 112 C256 116 264 126 266 140 Z" />
        <circle className={styles.stone} cx="150" cy="110" r="3" /><circle className={styles.stone} cx="250" cy="110" r="3" />
        {/* Pillared entrance hall */}
        <path className={styles.stone} d="M172 165 V138 H228 V165 Z" />
        <path className={styles.stoneDark} d="M170 138 H230 L224 132 H176 Z" />
        <path className={styles.pillars} d="M180 140 V165 M190 140 V165 M210 140 V165 M220 140 V165" />
        <path className={styles.doorway} d="M194 165 V150 Q200 143 206 150 V165 Z" />
        {/* The curved spire, ribbed and banded, crowned by its ringed stone and kalash */}
        <path className={styles.stone} d="M178 132 C180 98 190 72 200 60 C210 72 220 98 222 132 Z" />
        <path className={styles.ribs} d="M200 62 V132 M190 74 C186 92 184 110 184 132 M210 74 C214 92 216 110 216 132" />
        <path className={styles.tiers} d="M180 122 H220 M182 112 H218 M185 102 H215 M188 92 H212 M192 82 H208 M196 72 H204" />
        <ellipse className={styles.stone} cx="200" cy="58" rx="10" ry="4" />
        <path className={styles.ribs} d="M193 58 V56 M197 59 V55 M203 59 V55 M207 58 V56" />
        <path className={styles.kalash} d="M196 54 Q200 42 204 54 Z M200 42 V32" />
        <path className={styles.flag} d="M200 32 L216 36 L200 41 Z" />
      </g>
      {/* A string of temple bells across the entrance */}
      <path className={styles.bellLine} d="M140 128 Q200 136 260 128" />
      <g className={styles.bells}>
        {bells.map(x => <g key={x} className={styles.bell} style={{ transformOrigin: `${x}px 130px` }}><path d={`M${x} 130 V134`} /><path d={`M${x - 3} 140 Q${x - 3} 134 ${x} 134 Q${x + 3} 134 ${x + 3} 140 Z`} /></g>)}
      </g>
      <g className={styles.diya}>
        <path className={styles.diyaBowl} d="M191 170 Q200 176 209 170 Z" />
        <path className={styles.flame} d="M200 168 Q196 162 200 155 Q204 162 200 168 Z" />
      </g>
      <g className={styles.birds}>
        <path d="M84 64 q5 -4 10 0 q5 -4 10 0 M108 52 q4 -3 8 0 q4 -3 8 0 M300 58 q4 -3 8 0 q4 -3 8 0" />
      </g>
      <path className={styles.ground} d="M0 184 H400 V200 H0 Z" />
    </svg>
  );
}

/** Koli Dhek lake, Lohaghat: deodar hills mirrored in still water under a rising moon. */
export function KoliDhekLake() {
  const ridge = "M0 96 C50 48 110 62 170 86 C230 110 290 52 400 74 V132 H0 Z";
  const near = "M0 124 C50 104 100 108 140 120 L120 132 H0 Z M400 122 C350 100 300 106 262 120 L282 132 H400 Z";
  const banks = [[14, 132, 34], [34, 132, 28], [52, 132, 22], [340, 132, 30], [360, 132, 36], [382, 132, 26]];
  return (
    <svg className={`${styles.scene} ${styles.night}`} viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" role="img" aria-labelledby="kolidhek-title">
      <title id="kolidhek-title">Koli Dhek lake, Lohaghat: deodar hills reflected in the water under a rising moon</title>
      <circle className={styles.moon} cx="270" cy="46" r="13" />
      <path className={styles.ridgeFar} d={ridge} />
      <path className={styles.ridgeNear} d={near} />
      <g className={styles.trees}>{banks.map(([x, b, h]) => <path key={x} d={deodar(x, b, h)} />)}</g>
      <g className={styles.lake}>
        <rect className={styles.water} x="0" y="132" width="400" height="56" />
        {/* The hills and trees, mirrored in still water */}
        <g className={styles.mirror} transform="translate(0 264) scale(1 -1)">
          <path className={styles.ridgeFar} d={ridge} />
          <path className={styles.ridgeNear} d={near} />
          <g className={styles.trees}>{banks.map(([x, b, h]) => <path key={x} d={deodar(x, b, h)} />)}</g>
        </g>
        <path className={styles.glint} d="M262 142 H278 M258 150 H282 M264 158 H276 M260 166 H280" />
        <ellipse className={`${styles.ripple} ${styles.rippleOne}`} cx="200" cy="160" rx="40" ry="5" />
        <ellipse className={`${styles.ripple} ${styles.rippleTwo}`} cx="200" cy="160" rx="40" ry="5" />
        <path className={styles.mist} d="M-40 128 C40 120 120 132 200 126 C280 120 360 132 440 126 V136 H-40 Z" />
      </g>
      <path className={styles.ground} d="M0 188 C100 182 300 182 400 188 V200 H0 Z" />
    </svg>
  );
}

/** The five Panchachuli peaks of Pithoragarh district, catching the sunrise over the Soar valley. */
export function PanchachuliPeaks() {
  const range = "M10 170 L70 92 L104 128 L146 58 L184 110 L214 80 L250 122 L282 96 L326 140 L356 112 L398 170 Z";
  const lights = [[64, 182], [92, 186], [118, 180], [146, 188], [176, 183], [214, 187], [242, 181], [270, 186], [302, 182], [334, 187]];
  return (
    <svg className={`${styles.scene} ${styles.dawnScene}`} viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" role="img" aria-labelledby="panchachuli-title">
      <title id="panchachuli-title">The five Panchachuli peaks of Pithoragarh district at sunrise, above the lights of the Soar valley</title>
      <defs>
        <linearGradient id="panchachuli-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.dawnTop} />
          <stop offset="1" className={styles.dawnLow} />
        </linearGradient>
        <clipPath id="panchachuli-range"><path d={range} /></clipPath>
      </defs>
      <rect className={styles.dawn} width="400" height="200" fill="url(#panchachuli-dawn)" />
      <g className={styles.stars}>
        {[[30, 20], [80, 34], [120, 14], [180, 28], [240, 12], [340, 24], [370, 44], [60, 52]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.1" />)}
      </g>
      <g className={styles.sunGroup}>
        <path className={styles.rays} d="M300 118 L300 66 M300 118 L336 82 M300 118 L264 82 M300 118 L350 110 M300 118 L250 110" />
        <circle className={styles.sun} cx="300" cy="118" r="18" />
      </g>
      <g className={styles.peaks}>
        <path className={styles.rock} d={range} />
        {/* Snow on the five summits; the second from the left is the highest. */}
        <path className={styles.snow} d="M70 92 L58 108 L66 106 L72 112 L80 102 Z M146 58 L130 80 L140 78 L148 86 L158 74 Z M214 80 L202 96 L212 94 L218 100 L224 92 Z M282 96 L272 110 L280 108 L286 112 L292 106 Z M356 112 L348 122 L356 121 L362 126 L366 120 Z" />
        {/* First light sweeps across the range. */}
        <g clipPath="url(#panchachuli-range)"><rect className={styles.glow} x="-160" y="40" width="160" height="140" /></g>
      </g>
      <path className={styles.valley} d="M0 168 C80 156 160 166 220 160 C300 152 350 164 400 158 V200 H0 Z" />
      <g className={styles.townLights}>{lights.map(([x, y], index) => <circle key={x} cx={x} cy={y} r="1.6" style={{ animationDelay: `${index * 0.37}s` }} />)}</g>
    </svg>
  );
}
