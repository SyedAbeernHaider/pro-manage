import { useId, useState } from 'react';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';
import Reveal from './Reveal';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Sign-up page the form hands off to, with the email pre-filled.
const SIGNUP_PATH = '/signup';

const CtaBanner = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const inputId = useId();
  const errorId = useId();

  const submit = (e) => {
    e.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setError('Please enter a valid work email.');
      return;
    }

    setError('');
    window.location.assign(`${SIGNUP_PATH}?email=${encodeURIComponent(value)}`);
  };

  return (
    <section aria-labelledby="cta-title" className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 px-6 py-16 text-center shadow-[0_40px_100px_-30px_rgba(5,150,105,0.6)] sm:px-12 sm:py-20">
        {/* texture + glow */}
        <div
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_20%,transparent_75%)] bg-[size:44px_44px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-400/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <h2
            id="cta-title"
            className="mx-auto max-w-3xl text-3xl font-bold tracking-[-0.035em] text-balance text-white sm:text-5xl sm:leading-[1.08]"
          >
            Ready to accelerate your product delivery?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-balance text-emerald-100/85 sm:text-lg">
            Join thousands of teams shipping with Kanbrix today. Setup takes under 60 seconds.
          </p>

          <form onSubmit={submit} noValidate className="mx-auto mt-10 max-w-lg">
            <div
              className={`flex flex-col gap-2 rounded-2xl border bg-white/10 p-2 backdrop-blur-md transition sm:flex-row sm:items-center ${
                error
                  ? 'border-rose-300/70'
                  : 'border-white/20 focus-within:border-emerald-300/70 focus-within:bg-white/15'
              }`}
            >
              <label htmlFor={inputId} className="sr-only">
                Work email
              </label>
              <input
                id={inputId}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@company.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-emerald-100/50"
              />
              <button
                type="submit"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-emerald-900 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300 hover:bg-emerald-50 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.2),0_12px_30px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get Started Free
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>

            <p
              id={errorId}
              role="alert"
              className={`mt-3 flex items-center justify-center gap-1.5 text-sm text-rose-200 ${error ? '' : 'sr-only'}`}
            >
              {error && <CircleAlert className="size-4" aria-hidden="true" />}
              {error}
            </p>
          </form>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-emerald-100/80">
            {['No credit card required', 'Cancel anytime', 'Free plan forever'].map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
};

export default CtaBanner;
