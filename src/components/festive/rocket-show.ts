// Rockets in the style of WhatsApp's Diwali status like: a streaky head that
// leaves a trail of separate glowing beads, a soft flash, then a spray (or ring)
// of round glowing dots that drift, sink and fade within about two seconds.
// The finale adds golden "willow" bursts whose sparks trail and fall like a shower.

type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; colour: string; drag: number; gravity: number; twinkle: boolean; tail: boolean };
type Burst = "scatter" | "ring" | "willow";
// A rocket waits while its age is below zero, so a volley can be queued at once.
type Rocket = { fromX: number; fromY: number; toX: number; toY: number; bend: number; age: number; duration: number; trail: string; burst: Burst; lastX: number; lastY: number; x: number; y: number };

const burstColours = ["#ff3b30", "#ff8a00", "#ffb800", "#21c4a5", "#4f7cff", "#b86bff", "#ff4fa3", "#ffffff"];
const trailColours = ["#ff7a1a", "#ffb000", "#ff4a2e"];
const willowColours = ["#ffd36b", "#ffc046", "#fff1c2", "#ffad42"];
const maxRockets = 18;
const maxSparks = 1800;
const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

export function createRocketShow(canvas: HTMLCanvasElement, onBurst?: () => void) {
  const context = canvas.getContext("2d");
  const rockets: Rocket[] = [];
  const sparks: Spark[] = [];
  const flashes: { x: number; y: number; age: number }[] = [];
  const sprites = new Map<string, HTMLCanvasElement>();
  let width = 0;
  let height = 0;
  let scale = 1;
  let frame = 0;
  let last = 0;
  let heat = 0;
  let launcher = { x: 0, y: 0 };

  const fit = () => {
    if (!context) return;
    const nextScale = Math.min(window.devicePixelRatio || 1, 2);
    if (width === window.innerWidth && height === window.innerHeight && scale === nextScale) return;
    width = window.innerWidth;
    height = window.innerHeight;
    scale = nextScale;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    sprites.clear();
  };

  // A round "bokeh" ball: a bright core with a soft glowing edge.
  const sprite = (colour: string) => {
    let image = sprites.get(colour);
    if (image) return image;
    image = document.createElement("canvas");
    const size = Math.ceil(64 * scale);
    image.width = image.height = size;
    const paint = image.getContext("2d")!;
    const glow = paint.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    glow.addColorStop(0, "#fffdf6");
    glow.addColorStop(.16, colour);
    glow.addColorStop(.4, colour);
    glow.addColorStop(.58, `${colour}66`);
    glow.addColorStop(1, `${colour}00`);
    paint.fillStyle = glow;
    paint.fillRect(0, 0, size, size);
    sprites.set(colour, image);
    return image;
  };

  const dot = (colour: string, x: number, y: number, radius: number, alpha: number) => {
    if (!context || alpha <= 0 || radius <= 0) return;
    const reach = radius * 2.5;
    context.globalAlpha = Math.min(alpha, 1);
    context.drawImage(sprite(colour), x - reach, y - reach, reach * 2, reach * 2);
  };

  const spark = (x: number, y: number, angle: number, speed: number, colour: string, size: number, life: number, drag = 1.7, gravity = 46, twinkle = false, tail = false) => {
    if (sparks.length >= maxSparks) return;
    sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life, size, colour, drag, gravity, twinkle, tail });
  };

  const addRocket = (fromX: number, fromY: number, toX: number, toY: number, burst: Burst, duration: number, delay = 0) => {
    rockets.push({ fromX, fromY, toX, toY, bend: random(-14, 14), age: -delay, duration, trail: burst === "willow" ? "#ffb000" : pick(trailColours), burst, lastX: fromX, lastY: fromY, x: fromX, y: fromY });
  };

  const burst = (rocket: Rocket) => {
    const { x, y } = rocket;
    flashes.push({ x, y, age: 0 });
    if (rocket.burst === "willow") {
      // Gold sparks that spread, slow, then fall with short tails: a shower.
      const count = Math.round(random(46, 60));
      for (let i = 0; i < count; i++) {
        spark(x, y, random(0, Math.PI * 2), random(40, 175), pick(willowColours), random(1.5, 2.6), random(1.9, 2.6), 1.4, 110, Math.random() < .5, true);
      }
    } else if (rocket.burst === "ring") {
      // A ring of evenly spaced dots, alternating colours, as in a rapid volley.
      const colours = [pick(burstColours), pick(burstColours), pick(burstColours)];
      const count = 26;
      for (let i = 0; i < count; i++) spark(x, y, (i / count) * Math.PI * 2, 250, colours[i % 3], 3.4, random(1.1, 1.4), 1.9, 38);
    } else {
      const count = Math.round(random(22, 30));
      for (let i = 0; i < count; i++) {
        spark(x, y, random(0, Math.PI * 2), random(70, 260), pick(burstColours), random(2.6, 5.8), random(1, 1.6), 1.6, 46, Math.random() < .3);
      }
    }
    onBurst?.();
  };

  const draw = (now: number) => {
    if (!context) return;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    context.globalAlpha = 1;
    context.clearRect(0, 0, width, height);

    // While the bottle is firing fast, the page picks up a warm glow from it.
    if (heat > .05) {
      heat = Math.max(heat - dt * 1.3, 0);
      const warmth = Math.min(heat / 6, 1);
      const glow = context.createRadialGradient(launcher.x, launcher.y, 0, launcher.x, launcher.y, Math.max(width, height) * .7);
      glow.addColorStop(0, `rgba(255,140,40,${.16 * warmth})`);
      glow.addColorStop(1, "rgba(255,140,40,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      const flicker = random(.85, 1.15);
      dot("#ff6a1a", launcher.x, launcher.y, (5 + warmth * 6) * flicker, .55 + warmth * .4);
      dot("#ffd36b", launcher.x, launcher.y, (2.4 + warmth * 2.2) * flicker, .95);
      for (let i = 0; i < 1 + Math.round(warmth * 2); i++) {
        spark(launcher.x, launcher.y, -Math.PI / 2 + random(-1, 1), random(40, 130), pick(trailColours), random(1.1, 2), random(.25, .45), 2, 60);
      }
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];
      rocket.age += dt * 1000;
      if (rocket.age < 0) continue;
      const p = Math.min(rocket.age / rocket.duration, 1);
      const travel = 1 - (1 - p) ** 2.2;
      const across = Math.sin(p * Math.PI) * rocket.bend;
      const dx = rocket.toX - rocket.fromX;
      const dy = rocket.toY - rocket.fromY;
      const length = Math.hypot(dx, dy) || 1;
      rocket.x = rocket.fromX + dx * travel + (-dy / length) * across;
      rocket.y = rocket.fromY + dy * travel + (dx / length) * across;
      // Beads every few pixels, which then hang and fade: the dotted trail.
      if (Math.hypot(rocket.x - rocket.lastX, rocket.y - rocket.lastY) >= 10) {
        spark(rocket.x, rocket.y, Math.PI / 2, random(4, 14), rocket.trail, random(1.9, 2.8), random(.4, .6), 1, 10);
        rocket.lastX = rocket.x;
        rocket.lastY = rocket.y;
      }
      // The head: a short streak pointing back the way it came, white-hot at the tip.
      const step = Math.hypot(rocket.x - rocket.fromX, rocket.y - rocket.fromY) || 1;
      const ux = (rocket.x - rocket.fromX) / step;
      const uy = (rocket.y - rocket.fromY) / step;
      const streak = context.createLinearGradient(rocket.x - ux * 20, rocket.y - uy * 20, rocket.x, rocket.y);
      streak.addColorStop(0, `${rocket.trail}00`);
      streak.addColorStop(.6, rocket.trail);
      streak.addColorStop(1, "#fff6d8");
      context.globalAlpha = 1;
      context.strokeStyle = streak;
      context.lineWidth = 3.4;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(rocket.x - ux * 20, rocket.y - uy * 20);
      context.lineTo(rocket.x, rocket.y);
      context.stroke();
      dot("#fff1c2", rocket.x, rocket.y, 2.6, 1);
      if (p >= 1) {
        rockets.splice(i, 1);
        burst(rocket);
      }
    }

    for (let i = flashes.length - 1; i >= 0; i--) {
      const flash = flashes[i];
      flash.age += dt;
      if (flash.age > .22) { flashes.splice(i, 1); continue; }
      dot("#e7d4ff", flash.x, flash.y, 12 + flash.age * 90, .55 * (1 - flash.age / .22));
    }

    let kept = 0;
    for (const item of sparks) {
      item.age += dt;
      if (item.age >= item.life) continue;
      const decay = Math.exp(-item.drag * dt);
      item.vx *= decay;
      item.vy = item.vy * decay + item.gravity * dt;
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      const left = item.age / item.life;
      let alpha = (1 - left) ** 1.2;
      if (item.twinkle && left > .5) alpha *= .55 + .45 * Math.sin(now / 45 + item.x);
      const size = item.size * (1 - left * .35);
      if (item.tail) {
        dot(item.colour, item.x - item.vx * .05, item.y - item.vy * .05, size * .7, alpha * .45);
        dot(item.colour, item.x - item.vx * .1, item.y - item.vy * .1, size * .45, alpha * .2);
      }
      dot(item.colour, item.x, item.y, size, alpha);
      sparks[kept++] = item;
    }
    sparks.length = kept;

    context.globalAlpha = 1;
    if (rockets.length || sparks.length || flashes.length || heat > .05) frame = requestAnimationFrame(draw);
    else { frame = 0; context.clearRect(0, 0, width, height); }
  };

  const run = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(draw);
  };

  return {
    /** Fires one rocket from (x, y), leaning away from the nearer screen edge. */
    launch(x: number, y: number, options: { ring?: boolean; spread?: number } = {}) {
      if (!context || rockets.length >= maxRockets) return;
      fit();
      const lean = x > width / 2 ? -1 : 1;
      const spread = options.spread ?? .35;
      const angle = lean * random(.08, .08 + spread);
      const rise = height * random(.38, .66);
      const toX = Math.min(Math.max(x + Math.tan(angle) * rise, 24), width - 24);
      const toY = Math.max(y - rise, 40);
      addRocket(x, y, toX, toY, options.ring ? "ring" : "scatter", random(560, 720));
      run();
    },
    /** The celebration: a volley from all along the bottom of the screen, mostly golden showers. */
    finale() {
      if (!context) return;
      fit();
      const count = width < 640 ? 7 : 11;
      const slots = Array.from({ length: count }, (_, i) => i).sort(() => Math.random() - .5);
      slots.forEach((slot, i) => {
        const x = width * (slot + .5) / count + random(-14, 14);
        const burst: Burst = i % 3 === 1 ? "scatter" : i % 5 === 4 ? "ring" : "willow";
        addRocket(x, height + 8, x + random(-40, 40), height * random(.12, .4), burst, random(780, 1000), i * 150 + random(0, 80));
      });
      // A last few showers keep the sky lit while the greeting is read.
      for (let i = 0; i < 3; i++) {
        const x = width * random(.15, .85);
        addRocket(x, height + 8, x + random(-30, 30), height * random(.1, .3), "willow", random(800, 1000), 1900 + i * 260);
      }
      run();
    },
    /** Spits a few tiny sparks, as a lit fuse does while it burns down. */
    fizz(x: number, y: number) {
      if (!context) return;
      fit();
      for (let i = 0; i < 3; i++) {
        spark(x, y, -Math.PI / 2 + random(-1.6, 1.6), random(25, 95), pick(["#fff4c0", "#ffd36b", "#ff9a3a"]), random(.9, 1.7), random(.22, .4), 2.2, 80);
      }
      run();
    },
    /** Builds the launcher fireball at the bottle's mouth during rapid taps. */
    heat(x: number, y: number) {
      if (!context) return;
      fit();
      launcher = { x, y };
      heat = Math.min(heat + 1, 6);
      run();
    },
    destroy() {
      cancelAnimationFrame(frame);
      frame = 0;
      rockets.length = sparks.length = flashes.length = 0;
      canvas.width = canvas.height = 0;
      width = height = 0;
    },
  };
}
