import { Bell, Command, History, KeyRound, Paperclip, ShieldCheck } from 'lucide-react';
import Reveal from '../home/Reveal';
import SectionHeader from '../home/SectionHeader';

const FEATURES = [
  {
    icon: Command,
    title: 'Global search',
    desc: 'Press ⌘K to jump to any task by key, title or teammate in milliseconds.',
  },
  {
    icon: ShieldCheck,
    title: 'Roles & permissions',
    desc: 'Owner, Admin, Manager, Member and Viewer — enforced by the API, not just hidden.',
  },
  {
    icon: Paperclip,
    title: 'File attachments',
    desc: 'Drop designs, docs and screenshots straight onto tasks, stored securely.',
  },
  {
    icon: Bell,
    title: 'Smart notifications',
    desc: 'Mentions, assignments and due-date reminders, plus an optional daily digest.',
  },
  {
    icon: History,
    title: 'Activity & audit log',
    desc: 'See who changed what and when, with an immutable record for compliance.',
  },
  {
    icon: KeyRound,
    title: 'Secure by default',
    desc: 'Isolated workspaces, short-lived tokens and rate limiting on every request.',
  },
];

/** Card with a soft spotlight that follows the cursor. */
const SpotlightCard = ({ icon: Icon, title, desc, delay }) => {
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <Reveal as="li" delay={delay}>
      <div
        onMouseMove={onMove}
        className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_50px_-24px_rgba(5,150,105,0.4)]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--x,50%)_var(--y,50%),rgba(16,185,129,0.12),transparent_70%)]"
          aria-hidden="true"
        />
        <span className="relative grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-emerald-600 group-hover:text-white">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="relative mt-5 text-base font-semibold text-zinc-900">{title}</h3>
        <p className="relative mt-2 text-[15px] leading-relaxed text-zinc-600">{desc}</p>
      </div>
    </Reveal>
  );
};

const MoreFeaturesGrid = () => (
  <section aria-labelledby="more-features-title" className="bg-zinc-50/70 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        id="more-features-title"
        eyebrow="And much more"
        title="The details that make teams faster."
        description="Everything else you'd expect from a modern work platform — built in, not bolted on."
      />

      <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <SpotlightCard key={f.title} {...f} delay={(i % 3) * 90} />
        ))}
      </ul>
    </div>
  </section>
);

export default MoreFeaturesGrid;
