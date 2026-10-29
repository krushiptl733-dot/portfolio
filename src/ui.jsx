import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { PROFILE } from './data.js';
import { RM, store } from './hooks.js';

export const Background = () => (<><div id="aur"><i /><i /><i /></div><div id="grain" /></>);
export const ProgressBar = () => <div id="bar" />;

export function Preloader({ onDone }) {
  const root = useRef(null), num = useRef(null);
  useEffect(() => {
    if (RM) { onDone(); return; }
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0'); },
        onComplete: () => { onDone(); gsap.to(root.current, { yPercent: -100, duration: 1, ease: 'power4.inOut', onComplete: () => { if (root.current) root.current.style.display = 'none'; } }); } });
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line
  return RM ? null : (<div id="pre" ref={root}><div><div id="pn" ref={num}>000</div><div className="mono">Loading portfolio</div></div></div>);
}

export function Nav({ lenis, theme, onTheme }) {
  const go = (e) => { const t = document.querySelector(e.currentTarget.getAttribute('href')); if (t && lenis) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); } };
  return (
    <nav className="glass">
      <b>KP<span className="acc">.</span></b>
      {['about', 'work', 'skills', 'path'].map((id) => <a key={id} className="l" href={`#${id}`} onClick={go}>{{ about: 'About', work: 'Work', skills: 'Skills', path: 'Journey' }[id]}</a>)}
      <button className="tg-btn" onClick={onTheme} title="Change theme" aria-label="Change theme"><i /><span className="mono">{theme}</span></button>
      <a className="btn p mag" style={{ padding: '9px 18px' }} href="#contact" onClick={go}>Contact</a>
    </nav>
  );
}

export function Cursor() {
  useEffect(() => {
    if (!matchMedia('(hover:hover)').matches || RM) return;
    const qx = gsap.quickTo('#cur', 'x', { duration: 0.08 }), qy = gsap.quickTo('#cur', 'y', { duration: 0.08 });
    const rx = gsap.quickTo('#ring', 'x', { duration: 0.4 }), ry = gsap.quickTo('#ring', 'y', { duration: 0.4 });
    const move = (e) => { qx(e.clientX); qy(e.clientY); rx(e.clientX); ry(e.clientY); store.mx = e.clientX / innerWidth - 0.5; store.my = e.clientY / innerHeight - 0.5; };
    addEventListener('pointermove', move);
    const off = [];
    document.querySelectorAll('a,button,.sc,input,textarea').forEach((el) => { const a = () => document.getElementById('ring')?.classList.add('g'), b = () => document.getElementById('ring')?.classList.remove('g'); el.addEventListener('mouseenter', a); el.addEventListener('mouseleave', b); off.push(() => { el.removeEventListener('mouseenter', a); el.removeEventListener('mouseleave', b); }); });
    document.querySelectorAll('.mag').forEach((b) => { const m = (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.3 }); }, l = () => gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.4)' }); b.addEventListener('pointermove', m); b.addEventListener('pointerleave', l); off.push(() => { b.removeEventListener('pointermove', m); b.removeEventListener('pointerleave', l); }); });
    return () => { removeEventListener('pointermove', move); off.forEach((f) => f()); };
  }, []);
  return <><div id="cur" /><div id="ring" /></>;
}

/** WebGL hero: a particle torus-knot and halo reacting to pointer + scroll. Colours follow the active theme. */
export function HeroGL({ theme }) {
  const cv = useRef(null), mats = useRef([]);
  useEffect(() => {
    const canvas = cv.current; let R;
    try { R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch { canvas.remove(); return; }
    const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(55, 1, 0.1, 100); C.position.z = 8;
    const mk = (g, size, op) => new THREE.Points(g, new THREE.PointsMaterial({ size, transparent: true, opacity: op, depthWrite: false }));
    const K = mk(new THREE.TorusKnotGeometry(2.3, 0.7, 420, 40), 0.024, 0.9), Hh = mk(new THREE.IcosahedronGeometry(4.4, 5), 0.016, 0.7);
    S.add(K, Hh); mats.current = [K.material, Hh.material];
    const resize = () => { R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setSize(canvas.clientWidth, canvas.clientHeight, false); C.aspect = canvas.clientWidth / canvas.clientHeight; C.updateProjectionMatrix(); };
    resize(); addEventListener('resize', resize);
    const tick = (t) => { const { sp, mx, my } = store;
      K.rotation.y = t * 0.18 + sp * 5; K.rotation.x = t * 0.07 + sp * 3 + my * 0.6; Hh.rotation.y = -t * 0.05 - sp * 2; Hh.rotation.x = t * 0.03;
      K.position.x = mx * 0.8; K.position.y = -my * 0.5 - sp * 4; K.scale.setScalar(1 + sp * 1.6); C.position.z = 8 + sp * 3; R.render(S, C); };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); removeEventListener('resize', resize); S.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); }); R.dispose(); };
  }, []);
  useEffect(() => { // recolour when the theme changes
    const id = requestAnimationFrame(() => { const cs = getComputedStyle(document.documentElement), light = theme === 'sand';
      const [a, b] = mats.current; if (!a) return;
      a.color.set(cs.getPropertyValue('--acc').trim()); b.color.set(cs.getPropertyValue(light ? '--ink' : '--a2').trim());
      [a, b].forEach((m) => { m.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending; m.needsUpdate = true; }); });
    return () => cancelAnimationFrame(id);
  }, [theme]);
  return <canvas id="gl" ref={cv} />;
}
