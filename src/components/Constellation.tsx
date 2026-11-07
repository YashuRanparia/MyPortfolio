'use client';
import { useEffect, useRef, useState } from 'react';
import Chat from './Chat';

export type NodeData = { id: number; title: string; summary: string; body: string; url: string; imageUrl: string; tags: string[] };
export type HubData = { id: string; name: string; blurb: string; color: string; x: number; y: number; nodes: NodeData[] };
type Sel = { hub: HubData; node?: NodeData } | null;
type Star = NodeData & { x: number; y: number; r: number; ph: number; hub: HubData };

const rnd = (seed: number) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

export default function Constellation({ hubs, siteName, tagline, resumeUrl, chatEnabled }: { hubs: HubData[]; siteName: string; tagline: string; resumeUrl: string; chatEnabled: boolean }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [sel, setSel] = useState<Sel>(null);
  const [hintGone, setHintGone] = useState(false);
  const api = useRef<{ fly: (x: number, y: number, z: number) => void; homeZ: () => number; stars: Star[] }>(null!);
  const selRef = useRef<Sel>(null);
  selRef.current = sel;
  const initials = siteName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  function choose(s: Sel) {
    setSel(s);
    const off = innerWidth > 700 ? 90 : 0;
    if (!s) api.current.fly(0, 0, api.current.homeZ());
    else if (s.node) { const st = api.current.stars.find((n) => n.id === s.node!.id)!; api.current.fly(st.x - off, st.y, 1.9); }
    else api.current.fly(s.hub.x - off, s.hub.y, 1.35);
  }

  useEffect(() => {
    const cv = cvRef.current!, ctx = cv.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, t = 0, raf = 0, dragging: { x: number; y: number } | null = null, moved = 0;
    const cam = { x: 0, y: 0, z: .8 }, tgt = { x: 0, y: 0, z: .8 }, mouse = { x: -999, y: -999 };
    let hover: HubData | Star | null = null;
    const trail: number[][] = [];
    const comets: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const ripples: { x: number; y: number; age: number; col: string }[] = [];
    let px = 0, py = 0, pz = 0;
    const homeZ = () => Math.max(.3, Math.min(.8, innerWidth / 1300, innerHeight / 1000));
    const bg = Array.from({ length: 420 }, (_, i) => ({ x: rnd(i) * 2400 - 1200, y: rnd(i + 999) * 1800 - 900, l: rnd(i + 5) * .8 + .15, r: rnd(i + 7) * 1.3 + .3, p: rnd(i + 3) * 6 }));
    const stars: Star[] = hubs.flatMap((h, hi) => h.nodes.map((n, i, a) => {
      const ang = i / a.length * Math.PI * 2 + rnd(hi * 50 + i) * .6, dist = 95 + rnd(hi * 70 + i + 1) * 60;
      return { ...n, x: h.x + Math.cos(ang) * dist, y: h.y + Math.sin(ang) * dist, r: 7 + rnd(i + hi) * 3, ph: rnd(i * 7 + hi) * 6, hub: h };
    }));

    const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); };
    resize(); addEventListener('resize', resize);
    cam.z = tgt.z = homeZ();
    const toS = (x: number, y: number, l = 1) => [(x - cam.x * l) * cam.z + W / 2, (y - cam.y * l) * cam.z + H / 2];
    const toW = (sx: number, sy: number) => [(sx - W / 2) / cam.z + cam.x, (sy - H / 2) / cam.z + cam.y];
    api.current = { fly: (x, y, z) => { tgt.x = x; tgt.y = y; tgt.z = z; }, homeZ, stars };

    function glow(x: number, y: number, r: number, col: string, a = 1) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, col); g.addColorStop(.25, col + '55'); g.addColorStop(1, col + '00');
      ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * .35, 0, 7); ctx.fill();
    }

    function frame() {
      t += .016;
      cam.x += (tgt.x - cam.x) * .07; cam.y += (tgt.y - cam.y) * .07; cam.z += (tgt.z - cam.z) * .07;
      ctx.clearRect(0, 0, W, H);
      // camera velocity drives the warp streaks while flying between constellations
      const dx0 = cam.x - px, dy0 = cam.y - py, dz0 = cam.z - pz; px = cam.x; py = cam.y; pz = cam.z;
      const vel = Math.min(Math.hypot(dx0, dy0) * cam.z + Math.abs(dz0) * 400, 40);
      const mvLen = Math.hypot(dx0, dy0) || 1;
      for (const h of hubs) { // nebula clouds
        const [nx, ny] = toS(h.x, h.y, .85), r = (380 + Math.sin(t * .4 + h.x) * 30) * cam.z;
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
        g.addColorStop(0, h.color + '1c'); g.addColorStop(1, h.color + '00');
        ctx.fillStyle = g; ctx.fillRect(nx - r, ny - r, r * 2, r * 2);
      }
      for (const s of bg) {
        const [x, y] = toS(s.x, s.y, s.l * .6);
        if (x < -5 || y < -5 || x > W + 5 || y > H + 5) continue;
        const a = s.l * (reduce ? 1 : .6 + .4 * Math.sin(t * 2 + s.p));
        if (vel > 1.5 && !reduce) {
          const len = vel * s.l * 1.6;
          const ux = Math.abs(dz0) * 400 > Math.hypot(dx0, dy0) * cam.z ? (x - W / 2) / W * 2 * Math.sign(dz0) : dx0 / mvLen;
          const uy = Math.abs(dz0) * 400 > Math.hypot(dx0, dy0) * cam.z ? (y - H / 2) / H * 2 * Math.sign(dz0) : dy0 / mvLen;
          ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = s.r; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ux * len, y + uy * len); ctx.stroke();
        } else { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x, y, s.r, s.r); }
      }
      ctx.lineWidth = 1;
      if (!reduce) { // shooting stars
        if (Math.random() < .004) comets.push({ x: Math.random() * W, y: Math.random() * H * .5, vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 3, life: 1 });
        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i]; c.x += c.vx; c.y += c.vy; c.life -= .018;
          if (c.life <= 0) { comets.splice(i, 1); continue; }
          const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 9, c.y - c.vy * 9);
          g.addColorStop(0, `rgba(255,255,255,${c.life})`); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 9, c.y - c.vy * 9); ctx.stroke();
        }
      }
      const active = selRef.current?.hub;
      const [cx, cy] = toS(0, 0);
      ctx.lineWidth = 1;
      for (const h of hubs) {
        const [hx, hy] = toS(h.x, h.y);
        ctx.strokeStyle = '#ffffff14'; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy); ctx.stroke(); ctx.setLineDash([]);
        for (const n of stars.filter((s) => s.hub === h)) {
          const [nx, ny] = toS(n.x, n.y);
          ctx.strokeStyle = h.color + (active === h || hover === n ? '99' : '33');
          ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(nx, ny); ctx.stroke();
          const ns = stars.filter((q) => q.hub === h), nxt = ns[(ns.indexOf(n) + 1) % ns.length];
          if (ns.length > 2) { const [rx, ry] = toS(nxt.x, nxt.y); ctx.strokeStyle = h.color + '1a'; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(rx, ry); ctx.stroke(); }
          if (!reduce) { const p = (t * .3 + n.ph) % 1; ctx.fillStyle = h.color; ctx.globalAlpha = .7; ctx.fillRect(hx + (nx - hx) * p - 1, hy + (ny - hy) * p - 1, 2, 2); ctx.globalAlpha = 1; }
        }
      }
      glow(cx, cy, 26 * cam.z + Math.sin(t * 2) * 2, '#fff4d0', .9);
      ctx.fillStyle = '#ffffffaa'; ctx.font = `${11 * cam.z + 3}px ui-monospace,monospace`; ctx.textAlign = 'center'; ctx.fillText(initials, cx, cy + 44 * cam.z);
      const mw = toW(mouse.x, mouse.y); hover = null;
      for (const h of hubs) {
        const [hx, hy] = toS(h.x, h.y), hr = 22, hot = Math.hypot(mw[0] - h.x, mw[1] - h.y) < hr * 1.8;
        if (hot) hover = h;
        glow(hx, hy, hr * cam.z * (hot || active === h ? 1.25 : 1), h.color);
        ctx.fillStyle = h.color; ctx.textAlign = 'center'; ctx.font = `600 ${13 * cam.z + 3}px ui-sans-serif,sans-serif`; ctx.fillText(h.name.toUpperCase(), hx, hy - hr * cam.z * 2.4);
        for (const n of stars.filter((s) => s.hub === h)) {
          const dx = mw[0] - n.x, dy = mw[1] - n.y, d = Math.hypot(dx, dy), pull = d < 140 ? (1 - d / 140) * 10 : 0;
          const [nx, ny] = toS(n.x + Math.sin(t + n.ph) * 4 + dx / (d || 1) * pull, n.y + Math.cos(t * .8 + n.ph) * 4 + dy / (d || 1) * pull);
          const nh = d < n.r * 2.2; if (nh) hover = n;
          glow(nx, ny, n.r * cam.z * (nh ? 1.5 : 1), h.color, .85);
          if (cam.z > 1.05 || nh || active === h) { ctx.fillStyle = '#e8e6f0'; ctx.font = `${11 * Math.max(cam.z, .9)}px ui-sans-serif,sans-serif`; ctx.fillText(n.title, nx, ny + n.r * cam.z * 3 + 4); }
        }
      }
      trail.push([mouse.x, mouse.y]); if (trail.length > 22) trail.shift();
      if (!reduce) trail.forEach(([x, y], i) => { ctx.fillStyle = `rgba(255,255,255,${i / trail.length * .5})`; ctx.beginPath(); ctx.arc(x, y, i / trail.length * 2.5, 0, 7); ctx.fill(); });
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]; r.age += .03;
        if (r.age >= 1) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = r.col + Math.floor((1 - r.age) * 150).toString(16).padStart(2, '0'); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.age * 90, 0, 7); ctx.stroke(); ctx.lineWidth = 1;
      }
      cv.style.cursor = dragging ? 'grabbing' : hover ? 'pointer' : 'grab';
      raf = requestAnimationFrame(frame);
    }
    frame();

    const down = (e: PointerEvent) => { dragging = { x: e.clientX, y: e.clientY }; moved = 0; cv.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY; setHintGone(true);
      if (dragging) { const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y; moved += Math.abs(dx) + Math.abs(dy); tgt.x -= dx / cam.z; tgt.y -= dy / cam.z; cam.x = tgt.x; cam.y = tgt.y; dragging = { x: e.clientX, y: e.clientY }; }
    };
    const up = () => {
      dragging = null;
      if (moved < 6 && hover) { const s = hover as Star; ripples.push({ x: mouse.x, y: mouse.y, age: 0, col: ('hub' in s ? s.hub : (hover as HubData)).color }); choose('hub' in s ? { hub: s.hub, node: s } : { hub: hover as HubData }); }
    };
    const wheel = (e: WheelEvent) => { e.preventDefault(); tgt.z = Math.min(2.4, Math.max(.25, tgt.z * (e.deltaY < 0 ? 1.1 : .9))); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') choose(null); };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up);
    cv.addEventListener('wheel', wheel, { passive: false }); addEventListener('keydown', key);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('keydown', key); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('wheel', wheel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubs]);

  const col = sel?.hub.color;
  return (
    <>
      <canvas ref={cvRef} aria-hidden />
      <header className="top"><h1>{siteName}</h1><p>{tagline || 'drag to explore · click a star'}</p></header>
      {!hintGone && <div className="hint">Every point of light is something I&apos;ve made or learned.</div>}
      {resumeUrl && <a className="resume" href={resumeUrl} target="_blank" rel="noopener noreferrer">Résumé ↗</a>}
      {chatEnabled && <Chat onNode={(id) => { const st = api.current.stars.find((n) => n.id === id); if (st) choose({ hub: st.hub, node: st }); }} />}
      <nav className="dock">
        <button className={!sel ? 'on' : ''} onClick={() => choose(null)}>✦ Overview</button>
        {hubs.map((h) => <button key={h.id} style={{ ['--col' as string]: h.color }} className={sel?.hub === h ? 'on' : ''} onClick={() => choose({ hub: h })}>{h.name}</button>)}
      </nav>
      <aside className={`side ${sel ? 'open' : ''}`} style={{ ['--col' as string]: col }} aria-live="polite">
        <button className="x" aria-label="Close" onClick={() => choose(null)}>×</button>
        {sel && !sel.node && <>
          <div className="tag">{sel.hub.name}</div><h2>{sel.hub.blurb}</h2>
          <ul>{sel.hub.nodes.map((n) => <li key={n.id}><button onClick={() => choose({ hub: sel.hub, node: n })}>{n.title}{n.summary && <small>{n.summary}</small>}</button></li>)}</ul>
        </>}
        {sel?.node && <>
          <div className="tag">{sel.hub.name}</div><h2>{sel.node.title}</h2>
          {sel.node.imageUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={sel.node.imageUrl} alt="" />}
          {sel.node.summary && <p className="lead">{sel.node.summary}</p>}
          {sel.node.body.split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          {sel.node.tags.length > 0 && <div className="chips">{sel.node.tags.map((t) => <span key={t}>{t}</span>)}</div>}
          {sel.node.url && <a className="cta" href={sel.node.url} target={sel.node.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">Open ↗</a>}
          <p><a href="#" className="back" onClick={(e) => { e.preventDefault(); choose({ hub: sel.hub }); }}>← {sel.hub.name}</a></p>
        </>}
      </aside>
      {/* Plain-text mirror of the content for crawlers, screen readers and no-JS visitors */}
      <div className="sr-only">
        {hubs.map((h) => <section key={h.id}><h2>{h.name}</h2><p>{h.blurb}</p>{h.nodes.map((n) => <article key={n.id}><h3>{n.title}</h3><p>{n.summary}</p><p>{n.body}</p><p>{n.tags.join(', ')}</p>{n.url && <a href={n.url}>{n.url}</a>}</article>)}</section>)}
      </div>
    </>
  );
}
