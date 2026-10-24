import React, { useEffect, useRef } from 'react';

/**
 * GlobalCursorFollower.jsx
 * High-Precision Interactive Laser Pointer Follower & Trailing Ribbon across the entire website:
 * 1. Follows cursor globally on all pages and components.
 * 2. Concentric Neon Amber Halo Beacon ( ● ) matching the reference image.
 * 3. Chaikin-smoothed continuous laser quad-ribbon with needle-sharp tapering ("tails fix").
 * 4. Fades smoothly from behind as the cursor moves ("piche se fade bhi ho raha hai").
 * 5. Subtle glowing ember stardust sparks flaking off the trailing path.
 * 6. Interactive expansion when hovering over clickable elements.
 */
export default function GlobalCursorFollower() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices or reduced motion preference
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Pointer state
    let targetX = width * 0.72;
    let targetY = height * 0.28;
    let headX = targetX;
    let headY = targetY;
    let hasMoved = false;
    let isVisible = false;
    let isHoveringInteractive = false;
    let ringRadius = 13;
    let targetRingRadius = 13;

    const onPointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        headX = targetX;
        headY = targetY;
        hasMoved = true;
      }
      isVisible = true;

      // Check if hovering interactive target
      const el = e.target;
      if (
        el &&
        (el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.closest('a') ||
          el.closest('button') ||
          el.closest('.btn') ||
          el.getAttribute('role') === 'button')
      ) {
        isHoveringInteractive = true;
        targetRingRadius = 18;
      } else {
        isHoveringInteractive = false;
        targetRingRadius = 13;
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
    };

    const onPointerEnter = () => {
      isVisible = true;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('mouseenter', onPointerEnter);

    // Trail points & sparks
    const trail = [];
    const MAX_TRAIL_POINTS = 32;
    const TRAIL_MAX_AGE = 0.58; // Seconds for full dissipation from tail

    const sparks = [];
    const MAX_SPARKS = 24;

    let lastTime = performance.now();

    // Chaikin smoothing helper for ultra-smooth curves without angular kinks
    const smoothPoints = (pts) => {
      if (pts.length < 3) return pts;
      const result = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        result.push({
          x: 0.75 * p0.x + 0.25 * p1.x,
          y: 0.75 * p0.y + 0.25 * p1.y,
          life: 0.75 * p0.life + 0.25 * p1.life,
        });
        result.push({
          x: 0.25 * p0.x + 0.75 * p1.x,
          y: 0.25 * p0.y + 0.75 * p1.y,
          life: 0.25 * p0.life + 0.75 * p1.life,
        });
      }
      result.push(pts[pts.length - 1]);
      return result;
    };

    const render = (now) => {
      animId = requestAnimationFrame(render);

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // On Home hero section, HeroScene's authentic 3D beacon & ribbon handles it with full depth
      const isHomeHero = window.location.pathname === '/' && window.scrollY < 320;
      if (!hasMoved || !isVisible || isHomeHero) {
        return;
      }

      // Smooth head interpolation towards mouse target
      const lerpSpeed = 0.44;
      headX += (targetX - headX) * lerpSpeed;
      headY += (targetY - headY) * lerpSpeed;

      // Smooth ring radius easing
      ringRadius += (targetRingRadius - ringRadius) * 0.2;

      // 1. Age existing trail points
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += dt;
        trail[i].life = Math.max(0, 1.0 - trail[i].age / TRAIL_MAX_AGE);
        if (trail[i].life <= 0) {
          trail.splice(i, 1);
        }
      }

      // 2. Add new point if head moved sufficiently
      const lastPoint = trail[0];
      let distSq = 999;
      if (lastPoint) {
        const dx = headX - lastPoint.x;
        const dy = headY - lastPoint.y;
        distSq = dx * dx + dy * dy;
      }

      if (distSq > 9) {
        // Moved > 3 pixels
        trail.unshift({
          x: headX,
          y: headY,
          age: 0,
          life: 1.0,
        });

        if (trail.length > MAX_TRAIL_POINTS) {
          trail.pop();
        }

        // Spawn subtle trailing stardust spark
        if (sparks.length < MAX_SPARKS && Math.random() < 0.4) {
          sparks.push({
            x: headX + (Math.random() - 0.5) * 6,
            y: headY + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 24,
            vy: (Math.random() - 0.5) * 24,
            life: 1.0,
            maxLife: 0.35 + Math.random() * 0.2,
            size: 1.0 + Math.random() * 1.5,
          });
        }
      }

      // 3. Render Smooth Laser Trailing Ribbon ("tails fix")
      if (trail.length >= 2) {
        // Apply Chaikin corner-smoothing to eliminate all angular kinks
        const smoothed = smoothPoints(trail);
        const count = smoothed.length;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // PASS 1: Outer Soft Neon Orange Halo Glow Quad-Strip
        for (let i = 0; i < count - 1; i++) {
          const p0 = smoothed[i];
          const p1 = smoothed[i + 1];

          const prog0 = 1.0 - i / (count - 1);
          const prog1 = 1.0 - (i + 1) / (count - 1);

          // Head taper so ribbon starts smoothly at 0 inside center orb
          const headTaper0 = Math.sin(Math.min(1.0, i / Math.min(5, count - 1)) * Math.PI * 0.5);
          const headTaper1 = Math.sin(Math.min(1.0, (i + 1) / Math.min(5, count - 1)) * Math.PI * 0.5);

          const fade0 = Math.pow(p0.life * prog0, 1.2) * headTaper0;
          const fade1 = Math.pow(p1.life * prog1, 1.2) * headTaper1;

          if (fade0 < 0.005 && fade1 < 0.005) continue;

          // Normal perpendicular vector
          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          // Widths: smoothly tapering down to exactly 0 at both head and tail tip
          const w0 = 10.0 * Math.pow(fade0, 1.15) * headTaper0;
          const w1 = 10.0 * Math.pow(fade1, 1.15) * headTaper1;

          ctx.beginPath();
          ctx.moveTo(p0.x + nx * w0, p0.y + ny * w0);
          ctx.lineTo(p1.x + nx * w1, p1.y + ny * w1);
          ctx.lineTo(p1.x - nx * w1, p1.y - ny * w1);
          ctx.lineTo(p0.x - nx * w0, p0.y - ny * w0);
          ctx.closePath();

          const avgFade = (fade0 + fade1) * 0.5;
          ctx.fillStyle = `rgba(255, 95, 0, ${0.35 * avgFade})`;
          ctx.shadowBlur = 12 * avgFade;
          ctx.shadowColor = '#ff5500';
          ctx.fill();
        }

        // PASS 2: Saturated Neon Fire Core Quad-Strip
        for (let i = 0; i < count - 1; i++) {
          const p0 = smoothed[i];
          const p1 = smoothed[i + 1];

          const prog0 = 1.0 - i / (count - 1);
          const prog1 = 1.0 - (i + 1) / (count - 1);

          const headTaper0 = Math.sin(Math.min(1.0, i / Math.min(5, count - 1)) * Math.PI * 0.5);
          const headTaper1 = Math.sin(Math.min(1.0, (i + 1) / Math.min(5, count - 1)) * Math.PI * 0.5);

          const fade0 = Math.pow(p0.life * prog0, 1.2) * headTaper0;
          const fade1 = Math.pow(p1.life * prog1, 1.2) * headTaper1;

          if (fade0 < 0.005 && fade1 < 0.005) continue;

          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const w0 = 4.0 * Math.pow(fade0, 1.25) * headTaper0;
          const w1 = 4.0 * Math.pow(fade1, 1.25) * headTaper1;

          ctx.beginPath();
          ctx.moveTo(p0.x + nx * w0, p0.y + ny * w0);
          ctx.lineTo(p1.x + nx * w1, p1.y + ny * w1);
          ctx.lineTo(p1.x - nx * w1, p1.y - ny * w1);
          ctx.lineTo(p0.x - nx * w0, p0.y - ny * w0);
          ctx.closePath();

          const avgFade = (fade0 + fade1) * 0.5;
          ctx.fillStyle = `rgba(255, 135, 15, ${0.75 * avgFade})`;
          ctx.shadowBlur = 6 * avgFade;
          ctx.shadowColor = '#ff8800';
          ctx.fill();
        }

        // PASS 3: Incandescent Electric White-Gold Center Spine
        for (let i = 0; i < count - 1; i++) {
          const p0 = smoothed[i];
          const p1 = smoothed[i + 1];

          const prog0 = 1.0 - i / (count - 1);
          const prog1 = 1.0 - (i + 1) / (count - 1);

          const headTaper0 = Math.sin(Math.min(1.0, i / Math.min(5, count - 1)) * Math.PI * 0.5);
          const headTaper1 = Math.sin(Math.min(1.0, (i + 1) / Math.min(5, count - 1)) * Math.PI * 0.5);

          const fade0 = Math.pow(p0.life * prog0, 1.4) * headTaper0;
          const fade1 = Math.pow(p1.life * prog1, 1.4) * headTaper1;

          if (fade0 < 0.005 && fade1 < 0.005) continue;

          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const w0 = 1.5 * Math.pow(fade0, 1.4) * headTaper0;
          const w1 = 1.5 * Math.pow(fade1, 1.4) * headTaper1;

          ctx.beginPath();
          ctx.moveTo(p0.x + nx * w0, p0.y + ny * w0);
          ctx.lineTo(p1.x + nx * w1, p1.y + ny * w1);
          ctx.lineTo(p1.x - nx * w1, p1.y - ny * w1);
          ctx.lineTo(p0.x - nx * w0, p0.y - ny * w0);
          ctx.closePath();

          const avgFade = (fade0 + fade1) * 0.5;
          ctx.fillStyle = `rgba(255, 245, 215, ${0.92 * avgFade})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        }

        ctx.restore();
      }

      // 4. Render Floating Trailing Ember Sparks
      if (sparks.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.life -= dt / s.maxLife;
          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          s.x += s.vx * dt;
          s.y += s.vy * dt;

          const sparkAlpha = Math.pow(s.life, 1.3);
          ctx.fillStyle = `rgba(255, 175, 40, ${sparkAlpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * sparkAlpha, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Render Interactive Beacon Node ( ● ) at Cursor Head
      ctx.save();

      // A. Atmospheric optical flare bloom
      const bloomGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, ringRadius * 2.4);
      bloomGrad.addColorStop(0, 'rgba(255, 115, 0, 0.55)');
      bloomGrad.addColorStop(0.35, 'rgba(255, 85, 0, 0.22)');
      bloomGrad.addColorStop(0.75, 'rgba(255, 55, 0, 0.05)');
      bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(headX, headY, ringRadius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // B. Concentric Neon Amber Halo Ring
      ctx.beginPath();
      ctx.arc(headX, headY, ringRadius, 0, Math.PI * 2);
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#ff7700';
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // C. Golden Inner Accent Line on Halo
      ctx.beginPath();
      ctx.arc(headX, headY, ringRadius, 0, Math.PI * 2);
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = '#ffe266';
      ctx.stroke();

      // D. Central Incandescent Glowing Dot
      const centerGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, 4.5);
      centerGrad.addColorStop(0, '#ffffff');
      centerGrad.addColorStop(0.4, '#fff0aa');
      centerGrad.addColorStop(0.85, '#ff6600');
      centerGrad.addColorStop(1, 'rgba(255, 85, 0, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(headX, headY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('mouseenter', onPointerEnter);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        userSelect: 'none',
      }}
    />
  );
}
