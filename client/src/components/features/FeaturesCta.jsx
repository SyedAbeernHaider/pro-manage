import { ArrowRight, Play, TrendingUp } from 'lucide-react';
import logoMark from '../../assets/kanbrix-mark.svg';
import Reveal from '../home/Reveal';
import MockAvatar from './MockAvatar';
import { PEOPLE } from './mockData';

/* avatars placed around the orbit ring (degrees) */
const ORBIT = [
  { person: PEOPLE.ali, angle: 30 },
  { person: PEOPLE.sarah, angle: 150 },
  { person: PEOPLE.omar, angle: 270 },
];

const OrbitVisual = () => (
  <div className="relative mx-auto grid size-64 place-items-center sm:size-72" aria-hidden="true">
    <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/70" />
    <div className="absolute inset-10 rounded-full border border-emerald-200/80" />

    {/* rotating ring; each avatar counter-rotates so it stays upright */}
    <div className="absolute inset-0 animate-orbit motion-reduce:animate-none">
      {ORBIT.map(({ person, angle }) => (
        <div
          key={person.name}
          className="absolute top-1/2 left-1/2"
          style={{
            transform: `rotate(${angle}deg) translateX(var(--orbit-r)) rotate(-${angle}deg)`,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <div className="animate-orbit-reverse motion-reduce:animate-none">
              <MockAvatar
                person={person}
                className="size-12 shadow-[0_10px_24px_rgba(15,23,42,0.18)] ring-4"
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="relative grid size-20 place-items-center rounded-3xl bg-white shadow-[0_20px_50px_-10px_rgba(5,150,105,0.55)] ring-1 ring-emerald-100">
      <span className="absolute inset-0 animate-pulse-ring rounded-3xl bg-emerald-400/30 motion-reduce:animate-none" />
      <img src={logoMark} alt="" className="relative size-12" />
    </div>

    <div className="absolute -right-4 -bottom-2 flex animate-float items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)] sm:-right-10 motion-reduce:animate-none">
      <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
        <TrendingUp className="size-4" />
      </span>
      <span className="text-xs">
        <span className="block text-zinc-500">Sprint progress</span>
        <span className="text-base font-bold text-zinc-900">78%</span>
      </span>
    </div>

    <p className="absolute -top-6 -right-6 rotate-[-8deg] font-hand text-2xl leading-6 text-emerald-700 sm:-right-16">
      Better planning,
      <br />
      better results
    </p>
  </div>
);

const FeaturesCta = () => (
  <section aria-labelledby="features-cta-title" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
    <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 px-6 py-14 sm:px-12 lg:py-16">
      <div
        className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-emerald-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            Get started
          </p>
          <h2
            id="features-cta-title"
            className="mt-5 text-3xl font-bold tracking-[-0.035em] text-balance text-zinc-900 sm:text-4xl"
          >
            Ready to supercharge your team’s productivity?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-600 lg:mx-0">
            Join teams already using Kanbrix to manage their work, collaborate and ship more.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/#pricing"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 text-[15px] font-semibold text-white shadow-[0_8px_22px_rgba(5,150,105,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_4px_rgba(16,185,129,0.2),0_14px_30px_rgba(5,150,105,0.4)] sm:w-auto"
            >
              Get Started Free
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="#demo"
              className="group inline-flex h-12 items-center gap-2.5 rounded-xl px-4 text-[15px] font-semibold text-zinc-800 transition hover:text-emerald-700"
            >
              <span className="grid size-8 place-items-center rounded-full border-2 border-emerald-500 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Play className="size-3 fill-current" aria-hidden="true" />
              </span>
              Watch Demo
            </a>
          </div>
        </div>

        <div className="[--orbit-r:128px] sm:[--orbit-r:144px]">
          <OrbitVisual />
        </div>
      </div>
    </Reveal>
  </section>
);

export default FeaturesCta;
