import { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

const ANNUAL_DISCOUNT = 0.2;

/* Quotas mirror §17.1 of the implementation plan. */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'For small teams getting organised.',
    monthly: 0,
    unit: 'forever',
    cta: 'Start for free',
    features: [
      '3 projects',
      '5 seats',
      '100 tasks',
      '100 MB storage',
      '30-day activity history',
      'Real-time boards & comments',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing teams shipping every week.',
    monthly: 12,
    unit: 'per user / month',
    cta: 'Choose Pro',
    popular: true,
    intro: 'Everything in Free, plus:',
    features: [
      '50 projects',
      '50 seats',
      '10,000 tasks',
      '10 GB storage',
      'Priority notification queue',
      'Advanced analytics & burndown',
      '1-year activity history',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For organisations that need control.',
    monthly: 29,
    unit: 'per user / month',
    cta: 'Choose Business',
    intro: 'Everything in Pro, plus:',
    features: [
      'Unlimited projects, seats & tasks',
      '100 GB storage',
      'Immutable audit logs + export',
      'Unlimited activity history',
      'Dedicated API rate limits (10×)',
    ],
  },
];

const formatPrice = (value) => (Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`);

const BillingToggle = ({ annual, onChange }) => (
  <div className="mt-10 flex justify-center">
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="relative inline-grid grid-cols-2 rounded-full border border-zinc-200 bg-zinc-100/80 p-1"
    >
      <span
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)] ring-1 ring-zinc-200 transition-transform duration-300 ease-out-expo ${
          annual ? 'translate-x-full' : 'translate-x-0'
        }`}
        aria-hidden="true"
      />
      {[
        { value: false, label: 'Monthly' },
        { value: true, label: 'Annual' },
      ].map((option) => (
        <button
          key={option.label}
          type="button"
          role="radio"
          aria-checked={annual === option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap sm:px-5 font-semibold transition-colors ${
            annual === option.value ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          {option.label}
          {option.value && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 whitespace-nowrap text-[11px] font-bold text-emerald-700">
              Save 20%
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

const PlanCard = ({ plan, annual, delay }) => {
  const price = annual ? plan.monthly * (1 - ANNUAL_DISCOUNT) : plan.monthly;
  const popular = plan.popular;

  return (
    <Reveal delay={delay} className={popular ? 'lg:-my-4' : ''}>
      <div
        className={`relative flex h-full flex-col rounded-3xl p-7 transition duration-300 hover:-translate-y-1 sm:p-8 ${
          popular
            ? 'bg-zinc-950 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.5),0_30px_80px_-20px_rgba(5,150,105,0.55)] lg:py-11'
            : 'border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)]'
        }`}
      >
        {popular && (
          <>
            <div
              className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-3xl"
              aria-hidden="true"
            >
              <div className="absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-emerald-500/30 blur-3xl" />
            </div>
            <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-3.5 py-1 text-xs font-bold text-white shadow-[0_0_24px_rgba(16,185,129,0.6)]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Most popular
            </span>
          </>
        )}

        <div className="relative">
          <h3 className={`text-lg font-semibold ${popular ? 'text-white' : 'text-zinc-900'}`}>
            {plan.name}
          </h3>
          <p className={`mt-1 text-sm ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {plan.tagline}
          </p>

          <p className="mt-6 flex items-baseline gap-2">
            <span
              className={`text-5xl font-bold tracking-[-0.04em] tabular-nums ${popular ? 'text-white' : 'text-zinc-900'}`}
            >
              {formatPrice(price)}
            </span>
            <span className={`text-sm ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {plan.unit}
            </span>
          </p>
          <p className={`mt-1 h-5 text-xs ${popular ? 'text-emerald-300' : 'text-emerald-700'}`}>
            {annual && plan.monthly > 0
              ? `Billed annually · ${formatPrice(price * 12)} per user / year`
              : ''}
          </p>

          <a
            href={`#signup-${plan.id}`}
            className={`group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition duration-300 ${
              popular
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.25),0_12px_30px_rgba(16,185,129,0.5)]'
                : 'border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50'
            } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
          >
            {plan.cta}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>

          <div className={`my-7 h-px ${popular ? 'bg-white/10' : 'bg-zinc-100'}`} />

          {plan.intro && (
            <p
              className={`mb-3 text-sm font-medium ${popular ? 'text-zinc-300' : 'text-zinc-700'}`}
            >
              {plan.intro}
            </p>
          )}

          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className={`flex items-start gap-3 text-sm ${popular ? 'text-zinc-200' : 'text-zinc-600'}`}
              >
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                    popular
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
};

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="scroll-mt-24 bg-zinc-50/70 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="pricing-title"
          eyebrow="Pricing"
          title="Simple pricing that scales with your team."
          description="Start free, upgrade when you need more room. Upgrades apply instantly — no migration, no downtime."
        />

        <BillingToggle annual={annual} onChange={setAnnual} />

        <div className="mx-auto mt-14 grid max-w-xl grid-cols-[minmax(0,1fr)] items-start gap-6 lg:max-w-none lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} annual={annual} delay={i * 100} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Prices in USD, excluding tax. Downgrade any time, as long as your usage fits the new plan.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
