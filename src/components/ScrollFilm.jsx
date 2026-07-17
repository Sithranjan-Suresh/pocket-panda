import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './ScrollFilm.css';

gsap.registerPlugin(ScrollTrigger);

const WORDMARK = 'PocketPanda';

const LEAF_WORDS = [
  { text: 'the essay', left: '12%', size: 1.0, rot: -14, at: 1.8 },
  { text: 'the inbox', left: '68%', size: 1.2, rot: 10, at: 2.2 },
  { text: 'that conversation', left: '30%', size: 0.95, rot: -6, at: 2.7 },
  { text: 'chapter 3', left: '76%', size: 0.9, rot: 18, at: 3.2 },
  { text: 'the laundry', left: '8%', size: 1.1, rot: 8, at: 3.7 },
  { text: 'the group project', left: '48%', size: 1.05, rot: -12, at: 4.2 },
];

function CanopyLayer({ className, fill }) {
  // A hanging leafy band: overlapping blobs along the top edge.
  return (
    <svg className={className} viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill={fill}
        d="M0,0 L1440,0 L1440,190
           C1380,240 1330,180 1270,230 C1210,280 1150,200 1080,260
           C1010,320 950,220 880,270 C810,320 760,230 690,280
           C620,330 560,240 490,290 C420,340 360,250 290,300
           C220,350 150,260 90,300 C50,326 20,290 0,310 Z"
      />
      <ellipse cx="180" cy="140" rx="200" ry="110" fill={fill} />
      <ellipse cx="520" cy="110" rx="240" ry="130" fill={fill} />
      <ellipse cx="900" cy="150" rx="260" ry="120" fill={fill} />
      <ellipse cx="1280" cy="110" rx="220" ry="125" fill={fill} />
    </svg>
  );
}

function SleepingPanda() {
  return (
    <svg className="film__panda" viewBox="0 0 320 200" aria-hidden="true">
      {/* curled body */}
      <ellipse cx="175" cy="132" rx="105" ry="62" fill="#f6f3ea" />
      {/* rear leg hugging body */}
      <ellipse cx="242" cy="158" rx="40" ry="24" fill="#2b2b2b" />
      {/* front arm curled over */}
      <ellipse cx="150" cy="162" rx="46" ry="20" fill="#2b2b2b" />
      {/* head */}
      <circle cx="92" cy="112" r="52" fill="#f6f3ea" />
      {/* ears */}
      <circle cx="58" cy="72" r="17" fill="#2b2b2b" />
      <circle cx="122" cy="66" r="17" fill="#2b2b2b" />
      {/* eye patches */}
      <ellipse cx="72" cy="112" rx="15" ry="19" fill="#2b2b2b" transform="rotate(-12 72 112)" />
      <ellipse cx="112" cy="108" rx="15" ry="19" fill="#2b2b2b" transform="rotate(12 112 108)" />
      {/* closed eyes (sleeping) */}
      <g className="film__panda-eyes-closed" stroke="#f6f3ea" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M65,112 Q72,117 79,112" />
        <path d="M105,108 Q112,113 119,108" />
      </g>
      {/* one open eye (revealed at the end) */}
      <g className="film__panda-eye-open" opacity="0">
        <circle cx="112" cy="108" r="6.5" fill="#f6f3ea" />
        <circle cx="112" cy="108" r="3.2" fill="#2b2b2b" />
      </g>
      {/* nose + mouth */}
      <ellipse cx="90" cy="130" rx="7" ry="5" fill="#2b2b2b" />
      <path d="M90,135 Q90,141 97,142" stroke="#2b2b2b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* blush */}
      <ellipse cx="60" cy="132" rx="8" ry="5" fill="#e8a0a0" opacity="0.55" />
      <ellipse cx="120" cy="128" rx="8" ry="5" fill="#e8a0a0" opacity="0.55" />
      {/* leaf on head */}
      <path d="M96,58 Q104,44 118,46 Q112,60 98,62 Z" fill="#7aa06b" />
    </svg>
  );
}

function BambooStalk({ x, h, lean = 0 }) {
  const segments = Math.max(2, Math.round(h / 46));
  return (
    <g transform={`translate(${x},0) rotate(${lean})`}>
      {Array.from({ length: segments }).map((_, i) => (
        <rect key={i} x="-7" y={200 - (i + 1) * 46} width="14" height="41" rx="7" fill="#7aa06b" />
      ))}
      <path d={`M0,${200 - h} q16,-22 36,-24 q-8,20 -30,26 Z`} fill="#8fb87e" />
      <path d={`M0,${200 - h + 30} q-16,-18 -34,-19 q7,18 28,24 Z`} fill="#6d9668" />
    </g>
  );
}

export default function ScrollFilm() {
  const filmRef = useRef(null);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
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

      // The one continuous descent — a single scrubbed master timeline.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: filmRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Ch.1 — canopy parts as we sink through it (0 – 3)
      tl.to('.film__canopy--back', { yPercent: -55, scale: 1.35, duration: 3 }, 0)
        .to('.film__canopy--mid', { yPercent: -95, scale: 1.6, duration: 3.1 }, 0)
        .to('.film__canopy--front', { yPercent: -150, scale: 1.9, duration: 2.8 }, 0)
        .to('.film__hero', { opacity: 0, y: -60, duration: 1.0 }, 0.25)
        .to('.film__hint', { opacity: 0, duration: 0.4 }, 0.2)
        .to('.film__dark', { opacity: 0.45, duration: 5 }, 0);

      // Ch.2 — the leaf-words float past and fall away (1.8 – 5.2)
      LEAF_WORDS.forEach((w, i) => {
        tl.fromTo(
          `.film__leafword--${i}`,
          { y: '85vh', rotation: w.rot, opacity: 0 },
          { y: '-110vh', rotation: w.rot * -1.4, opacity: 1, duration: 1.9 },
          w.at
        ).to(`.film__leafword--${i}`, { opacity: 0, duration: 0.45 }, w.at + 1.45);
      });

      // Ch.3 — understory: shafts of light, fireflies thicken (4.5 – 7.4)
      tl.fromTo('.film__shaft--a', { opacity: 0 }, { opacity: 0.5, duration: 1 }, 4.5)
        .fromTo('.film__shaft--b', { opacity: 0 }, { opacity: 0.35, duration: 1 }, 4.8)
        .to('.film__shaft--a, .film__shaft--b', { opacity: 0, duration: 0.8 }, 6.8)
        .to('.film__fireflies', { opacity: 1, duration: 1.6 }, 4.2)
        .fromTo(
          '.film__beat--rest',
          { opacity: 0, y: 46 },
          { opacity: 1, y: 0, duration: 0.7 },
          5.2
        )
        .to('.film__beat--rest', { opacity: 0, y: -40, duration: 0.7 }, 6.6);

      // Ch.4 — the grove floor rises to meet us (6.8 – 10)
      tl.fromTo('.film__grove', { y: '62vh' }, { y: '0vh', duration: 1.8 }, 6.9)
        .to('.film__moon', { opacity: 1, scale: 1.15, duration: 1.4 }, 6.9)
        .fromTo(
          '.film__beat--panda',
          { opacity: 0, y: 46 },
          { opacity: 1, y: 0, duration: 0.6 },
          8.4
        )
        .to('.film__panda-eyes-closed', { opacity: 0, duration: 0.12 }, 9.25)
        .to('.film__panda-eye-open', { opacity: 1, duration: 0.12 }, 9.25)
        .to('.film__beat--panda', { opacity: 0, duration: 0.55 }, 9.5)
        // Seam — melt into the app background over the last stretch
        .to('.film__seam', { opacity: 1, duration: 0.8 }, 9.2)
        .to('.film__vignette', { opacity: 0, duration: 0.8 }, 9.2);
    }, filmRef);

    const skipBtn = filmRef.current.querySelector('.film__skip');
    const onSkip = () => {
      const app = document.getElementById('panda-app');
      if (!app) return;
      if (lenis) lenis.scrollTo(app, { duration: 1.6 });
      else app.scrollIntoView({ behavior: 'smooth' });
    };
    skipBtn?.addEventListener('click', onSkip);

    // Hide the skip button once the film is behind us
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
          <div className="film__sky" />
          <CanopyLayer className="film__canopy film__canopy--back" fill="#1d3327" />
          <CanopyLayer className="film__canopy film__canopy--front" fill="#2f5238" />
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
        <div className="film__sky" />
        <div className="film__moon" />
        <div className="film__dark" />

        <CanopyLayer className="film__canopy film__canopy--back" fill="#1d3327" />
        <CanopyLayer className="film__canopy film__canopy--mid" fill="#24402f" />
        <CanopyLayer className="film__canopy film__canopy--front" fill="#2f5238" />

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

        <div className="film__shaft film__shaft--a" />
        <div className="film__shaft film__shaft--b" />

        <div className="film__grove">
          <svg className="film__bamboo" viewBox="0 0 900 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <BambooStalk x={90} h={170} lean={-3} />
            <BambooStalk x={170} h={120} lean={2} />
            <BambooStalk x={700} h={180} lean={3} />
            <BambooStalk x={790} h={130} lean={-2} />
            <BambooStalk x={840} h={90} lean={1} />
          </svg>
          <SleepingPanda />
          <div className="film__zzz" aria-hidden="true">
            <span>z</span>
            <span>z</span>
            <span>z</span>
          </div>
          <div className="film__ground" />
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
        <p className="film__hint">scroll</p>

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
