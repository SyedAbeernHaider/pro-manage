import { Quote, Star } from 'lucide-react';
import avatar1 from '../../assets/avatars/avatar-1.svg';
import avatar2 from '../../assets/avatars/avatar-2.svg';
import avatar3 from '../../assets/avatars/avatar-3.svg';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

/* PLACEHOLDER CONTENT — fictional people and companies used for layout only.
   Replace with real customer quotes (with written permission) before launch:
   publishing invented reviews as genuine is illegal in many markets. */
const TESTIMONIALS = [
  {
    quote:
      'We moved 40 engineers off a legacy tracker in an afternoon. Boards update the instant someone drags a card — our standups got 10 minutes shorter overnight.',
    name: 'Daniel Okafor',
    role: 'Engineering Lead',
    company: 'Hyperflow',
    avatar: avatar1,
    highlight: 'Boards update the instant someone drags a card',
  },
  {
    quote:
      'As a founder I need to see what ships without micromanaging. The burndown and activity feed give me that in one glance, and clients get a read-only view.',
    name: 'Amira Haddad',
    role: 'Co-founder & CEO',
    company: 'Veloce',
    avatar: avatar2,
    highlight: 'clients get a read-only view',
  },
  {
    quote:
      'Task keys, roles and filters just make sense. Onboarding a new PM takes minutes, and ⌘K means I never hunt for a ticket again.',
    name: 'Lucas Moreau',
    role: 'Senior Product Manager',
    company: 'DevStack',
    avatar: avatar3,
    highlight: '⌘K means I never hunt for a ticket again',
  },
];

const withHighlight = (quote, highlight) => {
  const index = quote.indexOf(highlight);
  if (index === -1) return quote;

  return (
    <>
      {quote.slice(0, index)}
      <mark className="rounded bg-emerald-100/70 px-0.5 text-zinc-900">{highlight}</mark>
      {quote.slice(index + highlight.length)}
    </>
  );
};

const Testimonials = () => (
  <section
    id="testimonials"
    aria-labelledby="testimonials-title"
    className="scroll-mt-24 bg-white py-20 sm:py-28"
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        id="testimonials-title"
        eyebrow="Wall of love"
        title="Teams move faster on Kanbrix."
        description="Engineering leads, founders and product managers on what changed after switching."
      />

      <ul className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            as="li"
            key={t.name}
            delay={i * 100}
            className={i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}
          >
            <figure className="group relative flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_50px_-24px_rgba(5,150,105,0.35)]">
              <Quote
                className="absolute top-6 right-6 size-8 text-emerald-100 transition-colors group-hover:text-emerald-200"
                aria-hidden="true"
              />

              <div className="flex gap-0.5 text-amber-400" role="img" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-zinc-700">
                <p>“{withHighlight(t.quote, t.highlight)}”</p>
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3 border-t border-zinc-100 pt-5">
                <img
                  src={t.avatar}
                  alt=""
                  className="size-11 rounded-full bg-zinc-50 ring-2 ring-white"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                  <p className="truncate text-[13px] text-zinc-500">
                    {t.role} · <span className="font-medium text-zinc-700">{t.company}</span>
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default Testimonials;
