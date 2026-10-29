import { useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** shared mutable values read by the WebGL hero every frame */
export const store = { sp: 0, mx: 0, my: 0 };
export const RM = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const THEMES = ['ember', 'emerald', 'sand'];
const $$ = (s) => gsap.utils.toArray(s);
const $ = (s) => document.querySelector(s);

export function useTheme() {
  const [t, setT] = useState(() => { try { return localStorage.getItem('theme') || 'ember'; } catch { return 'ember'; } });
  useEffect(() => { document.documentElement.dataset.theme = t; try { localStorage.setItem('theme', t); } catch { /* ignore */ } }, [t]);
  return [t, () => setT(THEMES[(THEMES.indexOf(t) + 1) % THEMES.length])];
}

/** Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync. Stays stopped until `ready`. */
export function useLenis(ready) {
  const [lenis, setLenis] = useState(null);
  useEffect(() => {
    if (RM) return;
    const l = new Lenis({ lerp: 0.085 });
    l.stop(); l.on('scroll', ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => { gsap.ticker.remove(tick); l.destroy(); setLenis(null); };
  }, []);
  useEffect(() => { if (lenis && ready) { lenis.start(); document.body.classList.remove('lock'); } }, [lenis, ready]);
  useEffect(() => { if (RM && ready) document.body.classList.remove('lock'); }, [ready]);
  return lenis;
}

/** All scroll-driven animation lives here. Components stay plain markup. */
export function useAnimations(ready) {
  useLayoutEffect(() => {
    if (RM) { document.documentElement.classList.add('rm'); return; }
    document.documentElement.classList.add('js');
    const ctx = gsap.context(() => {
      gsap.set(['.chip', '.role', '.sub', '.cta', 'nav'], { opacity: 0, y: 30 });
      const hs = new SplitText('.hl .ln span', { type: 'chars', charsClass: 'ch' }); gsap.set(hs.chars, { yPercent: 115 });

      ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (store.sp = s.progress) });
      gsap.to('.hin', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 30%', scrub: true } });
      gsap.to('#bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
      let last = 0;
      ScrollTrigger.create({ onUpdate: (s) => { const y = scrollY; $('nav')?.classList.toggle('h', y > last && y > 400); last = y; gsap.to('.mqx', { skewX: gsap.utils.clamp(-14, 14, -s.getVelocity() / 220), duration: 0.4, overwrite: 'auto' }); } });

      const roles = $$('.role span'), ro = gsap.timeline({ repeat: -1 });
      roles.forEach((s, i, a) => { gsap.set(s, { yPercent: i ? 120 : 0, opacity: i ? 0 : 1 });
        ro.to(s, { yPercent: -120, opacity: 0, duration: 0.6, ease: 'power3.in' }, i * 2.4 + 1.8)
          .fromTo(a[(i + 1) % a.length], { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, i * 2.4 + 2.3); });

      const lead = new SplitText('#lead', { type: 'words' });
      gsap.fromTo(lead.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: '#lead', start: 'top 82%', end: 'bottom 48%', scrub: true } });
      $$('h2').forEach((h) => { const s = new SplitText(h, { type: 'chars' }); gsap.from(s.chars, { yPercent: 110, opacity: 0, rotate: 6, stagger: 0.025, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%' } }); });
      $$('.rvl').forEach((e) => gsap.to(e, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: e, start: 'top 90%' } }));
      $$('[data-n]').forEach((e) => { const o = { v: 0 }, d = +(e.dataset.d || 0); gsap.to(o, { v: +e.dataset.n, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: e, start: 'top 92%' }, onUpdate: () => (e.textContent = o.v.toFixed(d)) }); });
      gsap.to('.ln2', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 65%', end: 'bottom 70%', scrub: true } });

      const mm = gsap.matchMedia();
      mm.add('(min-width: 861px)', () => { const c = $$('.pj'); c.forEach((el, i) => { if (i < c.length - 1) gsap.to(el, { scale: 0.93, opacity: 0.35, filter: 'blur(3px)', ease: 'none', scrollTrigger: { trigger: c[i + 1], start: 'top 90%', end: 'top 25%', scrub: true } }); }); });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });
    return () => { ctx.revert(); document.documentElement.classList.remove('js'); };
  }, []);

  useEffect(() => {
    if (!ready || RM) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => ScrollTrigger.refresh() })
        .to('.hl .ch', { yPercent: 0, stagger: 0.045, duration: 1.1, ease: 'power4.out' })
        .to(['.chip', '.role', '.sub', '.cta', 'nav'], { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', clearProps: 'transform' }, '-=0.8');
    });
    return () => ctx.revert();
  }, [ready]);
}
