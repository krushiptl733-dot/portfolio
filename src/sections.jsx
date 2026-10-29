import { useState } from 'react';
import { ABOUT, JOURNEY, MARQUEE, PROFILE, PROJECTS, SKILLS, STATS } from './data.js';
import { HeroGL } from './ui.jsx';

const Dialer = () => (<div className="vp"><div className="mono">12:00</div><div className="num">+91 &bull;&bull;&bull;&bull;&bull;</div><div className="keys">{'123456789*0#'.split('').map((k) => <i key={k}>{k}</i>)}</div></div>);
const Music = () => (<div className="vp"><div className="mono">Now playing</div><div className="disc" /><div className="pb"><i /></div></div>);
const Web = () => (<div className="vb"><div className="bar"><i /><i /><i /></div><div className="bd"><b /><div className="g3"><u /><u /><u /></div><s /><s /><s /></div></div>);
const ML = () => (<svg className="vc" viewBox="0 0 300 200" fill="none"><g fill="var(--c)" opacity=".6">{[[20, 170], [50, 150], [70, 155], [95, 120], [120, 125], [150, 95], [175, 100], [205, 65], [235, 55], [270, 30]].map((p) => <circle key={p} cx={p[0]} cy={p[1]} r="5" />)}</g><path d="M10 178 C90 140 150 100 290 22" stroke="var(--c)" strokeWidth="3" strokeLinecap="round" /></svg>);
const VIS = { dialer: Dialer, music: Music, web: Web, ml: ML };

export const Hero = ({ theme }) => (
  <section id="hero"><HeroGL theme={theme} />
    <div className="hin"><div className="chip glass">Open to internships &middot; {PROFILE.city}</div>
      <h1 className="hl"><span className="ln"><span>{PROFILE.name.toUpperCase()}</span></span><span className="ln o"><span>{PROFILE.surname.toUpperCase()}</span></span></h1>
      <div className="role">{PROFILE.roles.map((r) => <span key={r}>{r}</span>)}</div>
      <p className="sub">{PROFILE.tagline}</p>
      <div className="cta"><a className="btn p mag" href="#work">View projects &darr;</a><a className="btn mag" href={PROFILE.resume} download>Download resume</a></div></div>
    <div className="cue mono">Scroll</div></section>
);

export const Marquee = ({ reverse }) => { const row = [...MARQUEE, ...MARQUEE]; return (
  <div className="mqw"><div className="mqx" style={reverse ? { animationDirection: 'reverse' } : undefined}>
    {[0, 1].map((k) => <div key={k} className="mqr">{row.map((w, i) => w === '✦' ? <i key={i}>{w}</i> : i % 2 ? <em key={i}>{w}</em> : <span key={i}>{w}</span>)}</div>)}</div></div>); };

export const About = () => (
  <section id="about"><div className="wrap"><div className="mono">01 &mdash; About</div><h2>Who am I</h2>
    <p id="lead">{PROFILE.lead}</p>
    <div className="gg">{ABOUT.map(([k, h, p]) => <div className="gc glass rvl" key={k}><div className="mono acc">{k}</div><h4>{h}</h4><p>{p}</p></div>)}</div>
    <div className="stats">{STATS.map(([n, l, d]) => <div className="glass rvl" key={l}><b data-n={n} data-d={d || 0}>0</b><span className="mono">{l}</span></div>)}</div></div></section>
);

export function Projects() {
  const glow = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px'); };
  return (
    <section id="work"><div className="wrap"><div className="mono">02 &mdash; Selected work</div><h2>Five projects,<br /><span className="acc">built end to end</span></h2>
      <div className="stack">{PROJECTS.map((p, i) => { const V = VIS[p.v]; return (
        <article className="pj glass" key={p.title} style={{ '--c': p.c, '--i': i }} onPointerMove={glow}>
          <div className="pl"><div className="mono">0{i + 1} / {p.kind}</div><h3>{p.title}</h3><p className="tg">{p.tag}</p>
            <dl className="meta"><div><dt>Languages</dt><dd>{p.lang}</dd></div><div><dt>Team</dt><dd>{p.team}</dd></div><div><dt>My role</dt><dd>{p.role}</dd></div><div><dt>Built as</dt><dd>{p.built}</dd></div></dl>
            <ul>{p.pts.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="tags">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
            <div className="acts"><a className="btn p mag" target="_blank" rel="noopener" href={p.live}>Live demo &#8599;</a><a className="btn mag" target="_blank" rel="noopener" href={p.code}>Source code &#8599;</a></div></div>
          <div className="pv"><V /></div></article>); })}</div></div></section>
  );
}

export function Skills() {
  const tilt = (e) => { const c = e.currentTarget, r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`; };
  return (
    <section id="skills"><div className="wrap"><div className="mono">03 &mdash; Toolkit</div><h2>Skills &amp; stack</h2>
      <div className="sk">{SKILLS.map(([t, d, list]) => <div className="sc glass rvl" key={t} onPointerMove={tilt} onPointerLeave={(e) => (e.currentTarget.style.transform = '')}>
        <div className="mono acc">{list.length} skills</div><h4>{t}</h4><p>{d}</p><div className="tags" style={{ margin: 0 }}>{list.map((s) => <span key={s}>{s}</span>)}</div></div>)}</div></div></section>
  );
}

export const Journey = () => (
  <section id="path"><div className="wrap"><div className="mono">04 &mdash; Journey</div><h2>The path so far</h2>
    <div className="tl"><div className="ln2" />{JOURNEY.map(([k, h, p]) => <div className="ti glass rvl" key={k}><div className="mono acc">{k}</div><h4>{h}</h4><p>{p}</p></div>)}</div></div></section>
);

export function Contact() {
  const [s, setS] = useState('idle');
  async function submit(e) {
    e.preventDefault(); const form = e.currentTarget; setS('sending');
    try { const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const j = await r.json(); if (!r.ok || !j.ok) throw new Error(j.error || 'failed'); setS('sent'); form.reset(); } catch { setS('error'); }
  }
  return (
    <section id="contact"><div className="wrap"><div className="mono">05 &mdash; Contact</div><h2>LET'S BUILD<br /><span className="acc">SOMETHING.</span></h2>
      <p className="sub">Open to internships and projects. Send a message, it lands straight in my database.</p>
      <form className="cf glass" onSubmit={submit}>
        <input name="name" placeholder="Your name" required minLength={2} maxLength={100} />
        <input name="email" type="email" placeholder="Your email" required maxLength={200} />
        <textarea name="message" placeholder="Tell me about your project or role" required minLength={5} maxLength={2000} rows={4} />
        <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="btn p mag" disabled={s === 'sending'}>{s === 'sending' ? 'Sending…' : 'Send message'}</button>
        {s === 'sent' && <p className="ok">Thanks! Your message was saved. I'll reply soon.</p>}
        {s === 'error' && <p className="er">Couldn't send right now. Please email me directly: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></p>}
      </form>
      <div className="cl"><a className="btn mag" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      <a className="btn mag" target="_blank" rel="noopener" href={PROFILE.github}>GitHub &#8599;</a>
      <a className="btn mag" target="_blank" rel="noopener" href={PROFILE.linkedin}>LinkedIn &#8599;</a>
      <a className="btn mag" href={PROFILE.resume} download>Download resume</a></div></div></section>
  );
}

export const Footer = () => <footer className="mono">&copy; 2026 Krushi Patel &middot; {PROFILE.city}</footer>;
