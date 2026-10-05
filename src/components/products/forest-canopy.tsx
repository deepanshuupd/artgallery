"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./forest-canopy.module.css";
import { attachForestMotion } from "./forest-motion";

/** Poster-first, locally hosted footage; no service calls or animation library. */
export function ForestCanopy({ className = "" }: { className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const scene = sceneRef.current;
    if (!video || !scene) return;
    return attachForestMotion(scene, video, { isPaused: () => pausedRef.current, onAvailability: setMotionAvailable });
  }, []);

  return <div ref={sceneRef} className={`${styles.scene} ${className}`}>
    <picture><source media="(max-width: 767px)" srcSet="/video/pine-poster-mobile-v1.webp" /><Image src="/video/pine-poster-desktop-v1.webp" alt="" width={960} height={540} className={styles.poster} sizes="(max-width: 767px) 100vw, 50vw" /></picture>
    <video ref={videoRef} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} className={styles.video} data-playing={playing} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)} />
    <span className={styles.caption} aria-hidden="true">A moment among the pines</span>
    {motionAvailable && <button type="button" className={styles.control} aria-label={paused ? "Play forest animation" : "Pause forest animation"} onClick={() => {
      pausedRef.current = !pausedRef.current;
      setPaused(pausedRef.current);
      sceneRef.current?.dispatchEvent(new Event("forest-motion-change"));
    }}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Play" : "Pause"}</button>}
  </div>;
}
