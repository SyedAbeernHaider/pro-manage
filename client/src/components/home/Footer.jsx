import { useState } from 'react';
import { Globe, Monitor, Moon, Sun } from 'lucide-react';
import logoMark from '../../assets/kanbrix-mark.svg';

/* Brand marks (Lucide no longer ships brand icons). Paths: Simple Icons, CC0. */
const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    label: 'Discord',
    href: 'https://discord.com/',
    path: 'M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.028C.533 9.046-.32 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.042-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
];

const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Kanban', href: '#features' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'Changelog', href: '#changelog' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'System Status', href: '#status' },
      { label: 'Integrations', href: '#integrations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Security', href: '#security' },
    ],
  },
];

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon, soon: true },
  { id: 'system', label: 'System', icon: Monitor, soon: true },
];

/* Placeholder: only Light is available until the app ships a dark theme. */
const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-full border border-zinc-200 bg-white p-0.5"
    >
      {THEMES.map(({ id, label, icon: Icon, soon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={theme === id}
          aria-label={soon ? `${label} theme (coming soon)` : `${label} theme`}
          title={soon ? `${label} — coming soon` : label}
          disabled={soon}
          onClick={() => setTheme(id)}
          className={`grid size-7 place-items-center rounded-full transition ${
            theme === id ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
          } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-zinc-500`}
        >
          <Icon className="size-3.5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
};

const Footer = () => (
  <footer aria-labelledby="footer-title" className="border-t border-zinc-200 bg-zinc-50/60">
    <h2 id="footer-title" className="sr-only">
      Footer
    </h2>

    <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-20">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8">
        {/* brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <a href="/" className="inline-flex items-center gap-2.5" aria-label="Kanbrix home">
            <img src={logoMark} alt="" className="size-8" />
            <span className="text-xl font-bold tracking-[-0.04em] text-zinc-900">
              Kan<span className="text-emerald-600">brix</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-zinc-600">
            Real-time project management for teams that plan, track and ship together.
          </p>

          <ul className="mt-6 flex gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-[0_8px_20px_-10px_rgba(5,150,105,0.5)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* link columns */}
        {LINK_GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-sm font-semibold text-zinc-900">{group.title}</h3>
            <ul className="mt-3 space-y-1">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex min-h-8 items-center gap-2 py-1 text-[15px] text-zinc-600 transition hover:text-emerald-700"
                  >
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-600 bg-[length:0%_1px] bg-bottom-left bg-no-repeat pb-px transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                        <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* bottom bar */}
      <div className="mt-14 flex flex-col-reverse gap-5 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Kanbrix. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
            <Globe className="size-3.5" aria-hidden="true" />
            Global · English (US)
          </span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
