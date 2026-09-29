import { Check } from 'lucide-react';
import Reveal from '../home/Reveal';

/**
 * Alternating "copy + product visual" row used on the Features page.
 * `reverse` puts the visual on the left from the lg breakpoint up.
 */
const FeatureRow = ({
  id,
  icon: Icon,
  label,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="scroll-mt-24 overflow-x-clip py-16 sm:py-20 lg:py-24"
  >
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-8">
      <Reveal className={reverse ? 'lg:order-2' : ''}>
        <p className="flex items-center gap-3 text-sm font-semibold text-zinc-900">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          {label}
        </p>

        <h2
          id={`${id}-title`}
          className="mt-5 text-3xl font-bold tracking-[-0.035em] text-balance text-zinc-900 sm:text-4xl"
        >
          {title}
        </h2>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-zinc-600 sm:text-[17px]">
          {description}
        </p>

        <ul className="mt-7 space-y-3.5">
          {bullets.map((bullet, i) => (
            <Reveal
              as="li"
              key={bullet}
              delay={150 + i * 90}
              className="flex items-center gap-3 text-[15px] text-zinc-700"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.35)]">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {bullet}
            </Reveal>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={120} className={`relative min-w-0 ${reverse ? 'lg:order-1' : ''}`}>
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-emerald-100/70 via-emerald-50/40 to-transparent blur-2xl"
          aria-hidden="true"
        />
        {visual}
      </Reveal>
    </div>
  </section>
);

export default FeatureRow;
