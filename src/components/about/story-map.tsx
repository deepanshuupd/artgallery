"use client";

import { useId, useState } from "react";
import geometry from "./story-map-data.json";
import styles from "./story-map.module.css";

export function StoryMap() {
  const id = useId();
  const [selected, setSelected] = useState("pithoragarh");
  const [interacted, setInteracted] = useState(false);
  const district = geometry.districts.find(item => item.id === selected)!;
  const home = geometry.districts.find(item => item.id === "pithoragarh")!;

  function selectDistrict(districtId: string) {
    setInteracted(true);
    setSelected(districtId);
  }

  return (
    <figure className={styles.figure} data-interacted={interacted}>
      <svg className={styles.map} viewBox={geometry.viewBox} role="group" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
        <title id={`${id}-title`}>Explore Kumaon in Uttarakhand</title>
        <desc id={`${id}-description`}>Garhwal is in the west and Kumaon in the east. Select one of Kumaon’s six districts to see its name. You can also use Tab and Enter. The home marker identifies Pithoragarh district, where KumaonRang began.</desc>
        <path d={geometry.state} className={styles.state} />
        <g className={styles.regions}>
          <path d={geometry.garhwal} className={styles.garhwal} />
          <path d={geometry.kumaon} className={styles.kumaon} />
        </g>
        <g className={styles.districts}>
          {geometry.districts.map(item => (
            <path key={item.id} d={item.path} className={styles.district} role="button" tabIndex={0}
              aria-label={item.name} aria-pressed={selected === item.id} aria-controls={`${id}-selection`}
              onClick={() => selectDistrict(item.id)} onFocus={() => selectDistrict(item.id)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectDistrict(item.id);
                }
              }} />
          ))}
        </g>
        <path d={geometry.state} className={styles.outline} pathLength={1} aria-hidden="true" />
        <g className={styles.regionNames} aria-hidden="true">
          <text x="165" y="161">GARHWAL</text>
          <text x="270" y="400">KUMAON</text>
        </g>
        <g className={styles.homeMarker} aria-hidden="true">
          <circle cx={home.point.x} cy={home.point.y} r="7" fill="#fffaf1" />
          <circle cx={home.point.x} cy={home.point.y} r="3" fill="#994831" />
          <path d={`M${home.point.x + 10} ${home.point.y}h32`} />
          <text x={home.point.x + 48} y={home.point.y - 3}>Pithoragarh</text>
          <text x={home.point.x + 48} y={home.point.y + 14} className={styles.homeLabel}>OUR HOME</text>
        </g>
      </svg>
      <div className={styles.selection} id={`${id}-selection`} role="status" aria-live="polite" aria-atomic="true">
        <strong>{district.name}</strong>
      </div>
      <p className={styles.hint}>Tap a district to explore.</p>
      <figcaption className={styles.credit}>District map adapted from <a href="https://github.com/datameet/maps/tree/master/Districts/Census_2011" target="_blank" rel="noreferrer">DataMeet</a> · <a href="https://creativecommons.org/licenses/by/2.5/in/" target="_blank" rel="noreferrer">CC BY 2.5 IN</a> · Simplified</figcaption>
    </figure>
  );
}
