import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './ScrollFilm.css';

gsap.registerPlugin(ScrollTrigger);

const WORDMARK = 'PocketPanda';

const LEAF_WORDS = [
  { text: 'the essay', left: '12%', size: 1.0, rot: -14, at: 3.0 },
  { text: 'the inbox', left: '68%', size: 1.2, rot: 10, at: 3.3 },
  { text: 'that conversation', left: '28%', size: 0.95, rot: -6, at: 3.7 },
  { text: 'chapter 3', left: '76%', size: 0.9, rot: 18, at: 4.1 },
  { text: 'the laundry', left: '8%', size: 1.1, rot: 8, at: 4.5 },
  { text: 'the group project', left: '46%', size: 1.05, rot: -12, at: 4.9 },
];

// Painted plates generated with Higgsfield (Nano Banana), chained from one
// reference image so the panda is the same character in every shot.
const PLATES = [
  { src: '/film/plate1.webp', cls: 'film__plate--1' },
  { src: '/film/plate2.webp', cls: 'film__plate--2' },
  { src: '/film/plate3.webp', cls: 'film__plate--3' },
  { src: '/film/plate4.webp', cls: 'film__plate--4' },
];

export default function ScrollFilm() {
  const filmRef = useRef(null);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: `${6 + ((i * 61) % 88)}%`,
        top: `${12 + ((i * 37) % 72)}%`,
        delay: `${(i * 0.7) % 4}s`,
        duration: `${2.6 + ((i * 0.53) % 2.2)}s`,
        scale: 0.6 + ((i * 0.31) % 0.7),
      })),
    []
  );

  useEffect(() => {
    if (reduced) return undefined;

    const JUMP = new URLSearchParams(window.location.search).get('jump');
    if (JUMP !== null) history.scrollRestoration = 'manual';

    let lenis = null;
    if (JUMP === null) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      // On-load hero reveal (not scrubbed)
      gsap.from('.film__wordmark span', {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.045,
        delay: 0.15,
      });
      gsap.from('.film__tagline, .film__hint', {
        opacity: 0,
        y: 14,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.9,
      });

      // One continuous descent, scrubbed. Plates crossfade with Ken Burns
      // moves so the cut reads as the same camera pushing deeper.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: filmRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Plate 1 — the trailhead wave (0 – 3): slow push-in toward the path
      tl.fromTo('.film__plate--1', { scale: 1.06, yPercent: 0 }, { scale: 1.28, yPercent: 4, duration: 3.2 }, 0)
        .to('.film__plate--1', { opacity: 0, duration: 0.8 }, 2.4)
        .to('.film__hero', { opacity: 0, y: -60, duration: 1.0 }, 0.4)
        .to('.film__hint', { opacity: 0, duration: 0.4 }, 0.3);

      // Plate 2 — following the panda down the path (2.4 – 6)
      tl.fromTo('.film__plate--2', { opacity: 0, scale: 1.08 }, { opacity: 1, duration: 0.8 }, 2.4)
        .to('.film__plate--2', { scale: 1.26, yPercent: 3, duration: 3.4 }, 2.6)
        .to('.film__plate--2', { opacity: 0, duration: 0.8 }, 5.6);

      // The leaf-words fall away behind you while you follow (3.0 – 5.4)
      LEAF_WORDS.forEach((w, i) => {
        tl.fromTo(
          `.film__leafword--${i}`,
          { y: '85vh', rotation: w.rot, opacity: 0 },
          { y: '-110vh', rotation: w.rot * -1.4, opacity: 1, duration: 1.6 },
          w.at
        ).to(`.film__leafword--${i}`, { opacity: 0, duration: 0.4 }, w.at + 1.2);
      });

      // Plate 3 — the lantern in the dark stretch (5.6 – 8.1)
      tl.fromTo('.film__plate--3', { opacity: 0, scale: 1.1 }, { opacity: 1, duration: 0.8 }, 5.6)
        .to('.film__plate--3', { scale: 1.24, yPercent: -3, duration: 2.6 }, 5.8)
        .fromTo('.film__beat--rest', { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.6 }, 6.3)
        .to('.film__beat--rest', { opacity: 0, y: -40, duration: 0.6 }, 7.4)
        .to('.film__plate--3', { opacity: 0, duration: 0.8 }, 7.7);

      // Plate 4 — the grove welcome (7.7 – 10): camera settles, film ends here
      tl.fromTo('.film__plate--4', { opacity: 0, scale: 1.18 }, { opacity: 1, duration: 0.8 }, 7.7)
        .to('.film__plate--4', { scale: 1.02, duration: 2.2 }, 7.9)
        .fromTo('.film__beat--panda', { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.6 }, 8.6)
        .to('.film__beat--panda', { opacity: 0, duration: 0.5 }, 9.5)
        .to('.film__seam', { opacity: 1, duration: 0.8 }, 9.2)
        .to('.film__vignette', { opacity: 0, duration: 0.8 }, 9.2);

      // Ambient fireflies bloom in the middle stretch (after all plate tweens)
      tl.to('.film__fireflies', { opacity: 1, duration: 1.6 }, 4.2);
    }, filmRef);

    const skipBtn = filmRef.current.querySelector('.film__skip');
    const onSkip = () => {
      const app = document.getElementById('panda-app');
      if (!app) return;
      if (lenis) lenis.scrollTo(app, { duration: 1.6 });
      else app.scrollIntoView({ behavior: 'smooth' });
    };
    skipBtn?.addEventListener('click', onSkip);

    const skipTrigger = ScrollTrigger.create({
      trigger: filmRef.current,
      start: 'top top',
      end: 'bottom 92%',
      onLeave: () => skipBtn?.classList.add('film__skip--hidden'),
      onEnterBack: () => skipBtn?.classList.remove('film__skip--hidden'),
    });

    // Dev contract: ?jump=<y> lands pre-scrolled and settled; __ready gates capture.
    const settle = () => {
      if (JUMP !== null) {
        ScrollTrigger.refresh();
        window.scrollTo(0, +JUMP || 0);
        ScrollTrigger.update();
        // Re-assert after layout settles — a late refresh/restoration can reset scroll.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            window.scrollTo(0, +JUMP || 0);
            ScrollTrigger.update();
            window.__ready = true;
          })
        );
        return;
      }
      requestAnimationFrame(() => {
        window.__ready = true;
      });
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        settle();
      });
    } else {
      settle();
    }

    return () => {
      skipBtn?.removeEventListener('click', onSkip);
      skipTrigger.kill();
      ctx.revert();
      if (lenis) lenis.destroy();
    };
  }, [reduced]);

  if (reduced) {
    // Static poster for reduced-motion users: no pin, no smooth scroll, no drift.
    return (
      <header className="film film--static">
        <div className="film__stage film__stage--static">
          <img className="film__plate" src={PLATES[0].src} alt="" />
          <div className="film__hero">
            <h1 className="film__wordmark">{WORDMARK}</h1>
            <p className="film__tagline">Everything feels like too much.</p>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="film" ref={filmRef} aria-label="PocketPanda intro">
      <div className="film__stage">
        {PLATES.map((p) => (
          <img key={p.src} className={`film__plate ${p.cls}`} src={p.src} alt="" />
        ))}

        <div className="film__leafwords" aria-hidden="true">
          {LEAF_WORDS.map((w, i) => (
            <span
              key={w.text}
              className={`film__leafword film__leafword--${i}`}
              style={{ left: w.left, fontSize: `${w.size}rem` }}
            >
              {w.text}
            </span>
          ))}
        </div>

        <div className="film__fireflies" aria-hidden="true">
          {fireflies.map((f, i) => (
            <span
              key={i}
              className="film__firefly"
              style={{
                left: f.left,
                top: f.top,
                animationDelay: f.delay,
                animationDuration: f.duration,
                transform: `scale(${f.scale})`,
              }}
            />
          ))}
        </div>

        <div className="film__vignette" />
        <div className="film__seam" />

        <div className="film__hero">
          <h1 className="film__wordmark">
            {WORDMARK.split('').map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </h1>
          <p className="film__tagline">Everything feels like too much.</p>
        </div>
        <p className="film__hint">follow the panda</p>

        <div className="film__beat film__beat--rest">
          <p>You don't need a plan.</p>
          <p className="film__beat-strong">You need two things you can actually do.</p>
        </div>

        <div className="film__beat film__beat--panda">
          <p>This is your panda.</p>
          <p className="film__beat-strong">It keeps its energy small — on purpose.</p>
        </div>

        <button type="button" className="film__skip">
          skip to the panda ↓
        </button>
      </div>
    </header>
  );
}
