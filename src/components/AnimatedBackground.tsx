"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  baseAlpha: number;
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number }>;
  life: number;
  trailLen: number;
  speed: number;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
}

function getCSSColor(property: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  return val || fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const surrey_deep = getCSSColor("--color-surrey-deep-navy", "#263C55");
    const surrey_blue = getCSSColor("--color-surrey-blue", "#354a61");
    const surrey_gold = getCSSColor("--color-surrey-gold", "#ac9741");
    const [gr, gg, gb] = hexToRgb(surrey_gold);
    const [br, bg_, bb] = hexToRgb(surrey_blue);

    let width = 0;
    let height = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const particles: Particle[] = [];
    const meteors: Meteor[] = [];
    const orbs: Orb[] = [];
    let nextMeteorIn = 800 + Math.random() * 1500;
    let lastTime = performance.now();
    let elapsed = 0;

    const CONNECT_DIST = 130;
    const MAX_PARTICLES = 110;

    function resize() {
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width * devicePixelRatio;
      canvas!.height = height * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      initParticles();
      initOrbs();
    }

    function initParticles() {
      particles.length = 0;
      const count = Math.min(Math.floor((width * height) / 7500), MAX_PARTICLES);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          baseRadius: 0.9 + Math.random() * 1.8,
          baseAlpha: 0.18 + Math.random() * 0.38,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function initOrbs() {
      orbs.length = 0;
      for (let i = 0; i < 3; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: 160 + Math.random() * 120,
          alpha: 0.04 + Math.random() * 0.04,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function spawnMeteor() {
      const fromLeft = Math.random() > 0.5;
      const spd = 4.5 + Math.random() * 5.5;
      meteors.push({
        x: fromLeft ? width * 0.5 + Math.random() * width * 0.5 : Math.random() * width * 0.3,
        y: -15,
        vx: fromLeft ? -(spd * 0.9) : spd * 0.9,
        vy: spd,
        trail: [],
        life: 1,
        trailLen: 30 + Math.floor(Math.random() * 25),
        speed: spd,
      });
    }

    function drawBackground() {
      const grad = ctx!.createLinearGradient(0, 0, width * 0.55, height);
      grad.addColorStop(0, surrey_deep);
      grad.addColorStop(1, surrey_blue);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);
    }

    function drawOrbs() {
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const pulse = 1 + 0.15 * Math.sin(elapsed * 0.00045 + orb.phase);
        const r = orb.radius * pulse;
        const alpha = orb.alpha * (1 + 0.3 * Math.sin(elapsed * 0.0007 + orb.phase));

        const g = ctx!.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        g.addColorStop(0, `rgba(${gr},${gg},${gb},${alpha})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = g;
        ctx!.fillRect(orb.x - r, orb.y - r, r * 2, r * 2);
      }
    }

    function drawSpotlight() {
      if (mouse.x < 0) return;

      // Primary hot spot
      const g1 = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260);
      g1.addColorStop(0, `rgba(${gr},${gg},${gb},0.12)`);
      g1.addColorStop(0.4, `rgba(${gr},${gg},${gb},0.04)`);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g1;
      ctx!.fillRect(0, 0, width, height);

      // Outer ambient ring
      const g2 = ctx!.createRadialGradient(mouse.x, mouse.y, 200, mouse.x, mouse.y, 500);
      g2.addColorStop(0, `rgba(${br},${bg_},${bb},0.06)`);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g2;
      ctx!.fillRect(0, 0, width, height);
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const t = 1 - dist / CONNECT_DIST;
            // Boost opacity for lines near cursor
            const mdx = (particles[i].x + particles[j].x) / 2 - mouse.x;
            const mdy = (particles[i].y + particles[j].y) / 2 - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            const cursorBoost = mouse.x > 0 ? Math.max(0, 1 - mdist / 220) * 0.18 : 0;
            const alpha = t * t * 0.2 + cursorBoost;

            ctx!.strokeStyle = `rgba(${gr},${gg},${gb},${alpha})`;
            ctx!.lineWidth = t * 0.8;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function drawParticles() {
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 190);

        if (proximity > 0) {
          p.vx += (mouse.x - p.x) * 0.00016;
          p.vy += (mouse.y - p.y) * 0.00016;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.55) {
          p.vx = (p.vx / speed) * 0.55;
          p.vy = (p.vy / speed) * 0.55;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;

        const pulse = 1 + 0.3 * Math.sin(elapsed * 0.00085 + p.phase);
        const r = p.baseRadius * pulse;

        const cr = Math.round(br + (gr - br) * proximity);
        const cg = Math.round(bg_ + (gg - bg_) * proximity);
        const cb = Math.round(bb + (gb - bb) * proximity);
        const alpha = p.baseAlpha + proximity * 0.65;

        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * (2.2 + proximity * 2));
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r * (1.6 + proximity * 2), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawMeteors(dt: number) {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > m.trailLen) m.trail.shift();

        m.x += m.vx;
        m.y += m.vy;

        for (let t = 0; t < m.trail.length - 1; t++) {
          const progress = t / m.trail.length;
          const alpha = progress * 0.85 * m.life;
          const lw = progress * 3.5;
          ctx!.strokeStyle = `rgba(${gr},${gg},${gb},${alpha})`;
          ctx!.lineWidth = lw;
          ctx!.beginPath();
          ctx!.moveTo(m.trail[t].x, m.trail[t].y);
          ctx!.lineTo(m.trail[t + 1].x, m.trail[t + 1].y);
          ctx!.stroke();
        }

        // Bright core
        const hg = ctx!.createRadialGradient(m.x, m.y, 0, m.x, m.y, 12);
        hg.addColorStop(0, `rgba(255,250,220,${0.98 * m.life})`);
        hg.addColorStop(0.25, `rgba(${gr},${gg},${gb},${0.75 * m.life})`);
        hg.addColorStop(0.7, `rgba(${gr},${gg},${gb},${0.2 * m.life})`);
        hg.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = hg;
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, 12, 0, Math.PI * 2);
        ctx!.fill();

        if (m.x < -100 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
        }
      }

      nextMeteorIn -= dt;
      if (nextMeteorIn <= 0 && meteors.length < 5) {
        spawnMeteor();
        nextMeteorIn = 900 + Math.random() * 2200;
      }
    }

    function frame(now: number) {
      const dt = now - lastTime;
      lastTime = now;
      elapsed = now;

      ctx!.clearRect(0, 0, width, height);
      drawBackground();
      drawOrbs();
      drawSpotlight();
      drawConnections();
      drawParticles();
      drawMeteors(dt);

      raf = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
