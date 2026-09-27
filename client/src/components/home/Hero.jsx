import { useEffect, useRef } from 'react';
import heroVideo from '../../assets/hero.mp4';
import avatar1 from '../../assets/avatars/avatar-1.svg';
import avatar2 from '../../assets/avatars/avatar-2.svg';
import avatar3 from '../../assets/avatars/avatar-3.svg';
import avatar4 from '../../assets/avatars/avatar-4.svg';
import './Hero.css';

/* =========================================================
   HERO DATA
   NOTE: rating / team count are placeholders — replace with
   real numbers before launch.
========================================================= */

const TRUST_POINTS = ['Free plan forever', 'No credit card required', 'Set up in minutes'];

const SOCIAL_PROOF = {
  rating: '4.9/5',
  teams: '2,000+',
  // illustrated faces (Avataaars, free for commercial use) —
  // swap for real customer photos once you have permission
  avatars: [avatar1, avatar2, avatar3, avatar4],
};

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="ound"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="hero-cta-arrow"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 4.5v15a1 1 0 001.5.86l12.5-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z" />
  </svg>
);

const Star = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8L12 2.5z" />
  </svg>
);

/* =========================================================
   HERO
========================================================= */

const Hero = () => {
  const videoRef = useRef(null);

  // respect reduced-motion: keep the first frame, don't loop the video
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const video = videoRef.current;

    const sync = () => {
      if (!video) return;
      if (media.matches) video.pause();
      else video.play().catch(() => {});
    };

    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-inner">
        {/* ================= COPY ================= */}
        <div className="hero-copy">
          <a href="#features" className="hero-eyebrow" style={{ '--d': 0 }}>
            <span className="hero-eyebrow-tag">New</span>
            <span>Real-time Kanban boards for every team</span>
            <ArrowIcon />
          </a>

          <h1 id="hero-title" className="hero-title" style={{ '--d': 1 }}>
            Manage work.
            <br />
            <span className="hero-title-accent">Grow faster.</span>
          </h1>

          <p className="hero-subtitle" style={{ '--d': 2 }}>
            Kanbrix brings projects, tasks and teams together in one workspace — so everyone knows
            what to work on next and nothing slips through the cracks.
          </p>

          <div className="hero-actions" style={{ '--d': 3 }}>
            <a href="#get-started" className="hero-cta-primary">
              <span>Start for free</span>
              <ArrowIcon />
            </a>

            <a href="#demo" className="hero-cta-secondary">
              <span className="hero-play">
                <PlayIcon />
              </span>
              <span>Watch demo</span>
            </a>
          </div>

          <ul className="hero-trust" style={{ '--d': 4 }}>
            {TRUST_POINTS.map((point) => (
              <li key={point}>
                <span className="hero-trust-icon">
                  <CheckIcon />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="hero-proof" style={{ '--d': 5 }}>
            <div className="hero-avatars" aria-hidden="true">
              {SOCIAL_PROOF.avatars.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="hero-avatar"
                  width="36"
                  height="36"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>

            <div className="hero-proof-text">
              <span className="hero-stars" aria-label={`Rated ${SOCIAL_PROOF.rating}`}>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <strong>{SOCIAL_PROOF.rating}</strong>
              </span>
              <span>
                Trusted by <strong>{SOCIAL_PROOF.teams}</strong> teams
              </span>
            </div>
          </div>
        </div>

        {/* ================= MEDIA ================= */}
        <div className="hero-media" style={{ '--d': 2 }}>
          <div className="hero-media-glow" aria-hidden="true" />

          <div className="hero-media-frame">
            <div className="hero-media-bar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Team collaborating on a Kanbrix board"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>

          {/* floating cards */}
          <div className="hero-chip hero-chip-progress" aria-hidden="true">
            <span className="hero-chip-label">Sprint progress</span>
            <span className="hero-chip-value">78%</span>
            <span className="hero-chip-track">
              <span className="hero-chip-fill" />
            </span>
          </div>

          <div className="hero-chip hero-chip-task" aria-hidden="true">
            <span className="hero-chip-check">
              <CheckIcon />
            </span>
            <span>
              <span className="hero-chip-label">Task completed</span>
              <span className="hero-chip-title">Design review</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
