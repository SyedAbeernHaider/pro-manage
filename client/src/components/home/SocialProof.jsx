import Reveal from './Reveal';

/* Fictional companies — placeholder logos until you have real customers
   who have agreed to be listed. The team count is a placeholder too. */
const LOGOS = [
  {
    name: 'Acme Corp',
    mark: <path d="M12 3l9 16H3l9-16zm0 6l-4 7h8l-4-7z" fillRule="evenodd" />,
  },
  {
    name: 'Veloce',
    mark: <path d="M3 5h5l4 9 4-9h5l-7 14h-4L3 5z" />,
  },
  {
    name: 'Hyperflow',
    mark: (
      <path d="M4 7c3-3 6 3 9 0s5-3 7 0v3c-2-3-4-3-7 0s-6-3-9 0V7zm0 7c3-3 6 3 9 0s5-3 7 0v3c-2-3-4-3-7 0s-6-3-9 0v-3z" />
    ),
  },
  {
    name: 'ScaleX',
    mark: <path d="M5 4h4l3 5 3-5h4l-5 8 5 8h-4l-3-5-3 5H5l5-8-5-8z" />,
  },
  {
    name: 'Orbit',
    mark: (
      <path
        d="M12 4a8 8 0 110 16 8 8 0 010-16zm0 3a5 5 0 100 10 5 5 0 000-10zm0 3a2 2 0 110 4 2 2 0 010-4z"
        fillRule="evenodd"
      />
    ),
  },
  {
    name: 'DevStack',
    mark: (
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3zm-9 8.5l9 4.5 9-4.5V14l-9 4.5L3 14v-2.5zm0 5l9 4.5 9-4.5V19l-9 4.5L3 19v-2.5z" />
    ),
  },
];

const Logo = ({ name, mark }) => (
  <div className="flex shrink-0 items-center gap-2.5 px-8 text-zinc-400 grayscale transition duration-300 hover:text-zinc-900 sm:px-10">
    <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
      {mark}
    </svg>
    <span className="text-xl font-semibold tracking-[-0.03em]">{name}</span>
  </div>
);

const SocialProof = () => (
  <section
    aria-labelledby="social-proof-title"
    className="border-y border-zinc-100 bg-white py-14 sm:py-16"
  >
    <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p id="social-proof-title" className="text-center text-sm font-medium text-zinc-500">
        Trusted by <span className="font-semibold text-zinc-900">2,000+</span> agile engineering
        &amp; product teams worldwide
      </p>

      {/* marquee: list duplicated so the loop is seamless; pauses on hover */}
      <div className="group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <ul className="flex" aria-label="Customer logos">
            {LOGOS.map((logo) => (
              <li key={logo.name}>
                <Logo {...logo} />
              </li>
            ))}
          </ul>
          <ul className="flex" aria-hidden="true">
            {LOGOS.map((logo) => (
              <li key={logo.name}>
                <Logo {...logo} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  </section>
);

export default SocialProof;
