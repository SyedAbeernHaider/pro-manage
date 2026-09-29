import { Check, Radio, Zap } from 'lucide-react';
import Reveal from '../home/Reveal';
import AppBoardMockup from './AppBoardMockup';

const PERKS = ['Simple to use', 'Built for teams', 'Secure & reliable'];

const FeaturesHero = () => (
  <section aria-labelledby="features-hero-title" className="relative isolate overflow-hidden">
    {/* background: soft glow + faint grid */}
    <div
      className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/70 via-white to-white"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 -z-10 [background-image:linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_30%,transparent_80%)] bg-[size:56px_56px]"
      aria-hidden="true"
    />
    <div
      className="absolute top-10 -right-32 -z-10 size-[480px] rounded-full bg-emerald-300/25 blur-3xl"
      aria-hidden="true"
    />

    {/* pt clears the fixed navbar */}
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-8">
      <div className="text-center lg:text-left">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Features
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1
            id="features-hero-title"
            className="mt-5 text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-balance text-zinc-900 sm:text-5xl lg:text-6xl"
          >
            Everything you need{' '}
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
              to get work done
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-zinc-600 sm:text-lg lg:mx-0">
            Kanbrix brings together powerful features to help your team plan, organize, collaborate
            and track progress — all in one place.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={320}>
          <nav
            aria-label="Jump to a feature"
            className="mt-10 flex flex-wrap justify-center gap-2 lg:justify-start"
          >
            {[
              ['Projects', '#projects'],
              ['Kanban', '#kanban'],
              ['Collaboration', '#collaboration'],
              ['Reports', '#reports'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-zinc-200 bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-zinc-600 backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-[0_6px_16px_-8px_rgba(5,150,105,0.5)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>

      <Reveal delay={200} className="relative mx-auto w-full max-w-2xl lg:max-w-none">
        <div className="animate-float motion-reduce:animate-none [animation-duration:9s]">
          <AppBoardMockup live />
        </div>

        {/* floating status chips */}
        <div className="absolute -bottom-5 -left-3 hidden animate-float items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)] [animation-delay:-3s] sm:flex motion-reduce:animate-none">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-emerald-500" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs">
            <span className="block text-zinc-500">Live sync</span>
            <span className="font-semibold text-zinc-900">4 teammates online</span>
          </span>
          <Radio className="size-4 text-emerald-600" aria-hidden="true" />
        </div>

        <div className="absolute -top-4 -right-2 hidden animate-float items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.14)] [animation-delay:-5s] sm:flex motion-reduce:animate-none">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-400 text-white">
            <Zap className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-zinc-900">Updated just now</span>
        </div>
      </Reveal>
    </div>
  </section>
);

export default FeaturesHero;
