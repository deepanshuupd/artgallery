import { useId } from "react";
import geometry from "./uttarakhand-map-data.json";
import styles from "./origin-story.module.css";

/** District polygons were merged offline. This is an origin illustration, not a map service. */
export function UttarakhandMap() {
  const id = useId();
  const marker = geometry.pithoragarhDistrict;
  return <figure className={styles.mapFigure} data-home-reveal="origin-map">
    <svg className={styles.map} viewBox={geometry.viewBox} role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>Uttarakhand, with Kumaon highlighted</title>
      <desc id={`${id}-description`}>The complete state outline, with Kumaon in the east and Garhwal in the west. Kumaon includes Almora, Bageshwar, Champawat, Nainital, Pithoragarh and Udham Singh Nagar. The marker identifies Pithoragarh district, where KumaonRang is based.</desc>
      <defs><clipPath id={`${id}-clip`}><path d={geometry.state} /></clipPath></defs>
      <path d={geometry.state} className={styles.state} />
      <g clipPath={`url(#${id}-clip)`}><path d={geometry.kumaon} className={styles.kumaon} /></g>
      <path d={geometry.state} className={styles.outline} />
      <text x="166" y="166" className={styles.regionLabel}>GARHWAL</text>
      <text x="295" y="277" className={styles.kumaonLabel}>KUMAON</text>
      <g className={styles.marker}><circle cx={marker.x} cy={marker.y} r="10" fill="#fafbf8" /><circle cx={marker.x} cy={marker.y} r="4" fill="#994831" /><path d={`M${marker.x + 11} ${marker.y}h31`} fill="none" stroke="#994831" strokeWidth="1.4" /><text x={marker.x + 47} y={marker.y + 4} className={styles.placeLabel}>Pithoragarh</text></g>
    </svg>
    <figcaption><small>Map adapted from <a href="https://github.com/datameet/maps/tree/master/Districts" target="_blank" rel="noreferrer">DataMeet</a> · <a href="https://creativecommons.org/licenses/by/2.5/in/" target="_blank" rel="noreferrer">CC BY 2.5 IN</a> · Simplified</small></figcaption>
  </figure>;
}
