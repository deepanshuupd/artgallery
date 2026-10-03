import Link from "next/link";
import { CraftOrnament } from "@/components/home/craft-ornament";
import atmosphere from "./home-atmosphere.module.css";

export function HeritageStory() {
  return (
    <section className={`heritage-story heritage-shell ${atmosphere.story}`} aria-labelledby="heritage-title">
      <div className="heritage-story__mark" data-home-reveal="story-mark">
        <div className={atmosphere.storyWheel} data-home-float aria-hidden="true"><CraftOrnament /></div>
        <span lang="hi">अपनी मिट्टी, अपने रंग</span><p>Our roots. Our colours.</p>
      </div>
      <div className="heritage-story__copy" data-home-reveal="story-copy">
        <p className="craft-eyebrow">Meet Sneha · Pithoragarh, Uttarakhand</p>
        <h2 id="heritage-title">A small business.<br /><em>A very personal piece of home.</em></h2>
        <p>Behind KumaonRang is <strong>Sneha</strong>, a woman from Pithoragarh growing a small business with the colours of her home at its heart. Aipan art, Pahadi keepsakes and thoughtful gifts bring that connection into things you can carry, live with and give.</p>
        <p>Choosing a piece here means more than finding a gift. You become part of a small business’s growing story — helping something rooted in Kumaon reach a little further, one keepsake at a time.</p>
        <div className="craft-actions"><Link prefetch={false} href="/about" className="craft-text-link">Meet Sneha & KumaonRang</Link><Link prefetch={false} href="/aipan-art" className="craft-text-link">Discover Aipan art</Link></div>
      </div>
    </section>
  );
}
