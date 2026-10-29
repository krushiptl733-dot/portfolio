import { useEffect, useState } from 'react';
import { useAnimations, useLenis, useTheme } from './hooks.js';
import { Background, Cursor, Nav, Preloader, ProgressBar } from './ui.jsx';
import { About, Contact, Footer, Hero, Journey, Marquee, Projects, Skills } from './sections.jsx';

export default function App() {
  const [ready, setReady] = useState(false);
  const [theme, cycleTheme] = useTheme();
  const lenis = useLenis(ready);
  useAnimations(ready);
  useEffect(() => { document.body.classList.add('lock'); }, []);
  return (
    <>
      <Background /><Cursor /><ProgressBar />
      <Preloader onDone={() => setReady(true)} />
      <Nav lenis={lenis} theme={theme} onTheme={cycleTheme} />
      <main>
        <Hero theme={theme} /><Marquee /><About /><Projects /><Skills /><Marquee reverse /><Journey /><Contact />
      </main>
      <Footer />
    </>
  );
}
