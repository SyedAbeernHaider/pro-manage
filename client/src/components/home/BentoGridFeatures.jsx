import { useState } from 'react';
import {
  Bell,
  CalendarClock,
  CircleCheck,
  Command,
  Filter,
  Fingerprint,
  Hash,
  KeyRound,
  Loader,
  Lock,
  Mail,
  Radio,
  Search,
  Timer,
  Zap,
} from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

const CardShell = ({ icon: Icon, title, description, className = '', children, delay = 0 }) => (
  <Reveal delay={delay} className={className}>
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)] sm:p-7">
      <div className="relative z-10">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">{title}</h3>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-zinc-600">{description}</p>
      </div>

      <div className="relative mt-6 flex flex-1 flex-col justify-center">{children}</div>
    </div>
  </Reveal>
);

/* ---------- 1. real-time sync ---------- */

const MiniBoard = ({ label, animation, latency }) => (
  <div className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[11px] font-semibold text-zinc-600">{label}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">
        <Radio className="size-3" aria-hidden="true" />
        {latency}
      </span>
    </div>

    <div className="relative grid grid-cols-2 gap-3">
      {['In Progress', 'Done'].map((col) => (
        <div key={col} className="space-y-2">
          <p className="text-[10px] leading-4 font-medium tracking-wide text-zinc-400 uppercase">
            {col}
          </p>
          <div className="h-9 rounded-lg border border-dashed border-zinc-200 bg-white/60" />
          <div className="h-9 rounded-lg border border-zinc-200 bg-white" />
        </div>
      ))}

      {/* the card that moves: sits on the first slot, slides one column right */}
      <div
        className={`absolute top-6 left-0 flex h-9 w-[calc(50%-6px)] items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-2 shadow-[0_6px_16px_rgba(5,150,105,0.25)] ${animation} motion-reduce:animate-none`}
      >
        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
        <span className="truncate font-mono text-[10px] text-zinc-700">WEB-099</span>
      </div>
    </div>
  </div>
);

const SyncVisual = () => (
  <div className="flex flex-col gap-3 sm:flex-row" aria-hidden="true">
    <MiniBoard label="Sofia · Berlin" animation="animate-sync-left" latency="you" />
    <MiniBoard label="Omar · Lahore" animation="animate-sync-right" latency="38 ms" />
  </div>
);

/* ---------- 2. command palette ---------- */

const COMMANDS = [
  { key: 'WEB-104', title: 'Rate-limit the public API', meta: 'Urgent · Marcus' },
  { key: 'WEB-099', title: 'Real-time board sync via sockets', meta: 'High · Layla' },
  { key: 'OPS-012', title: 'Rotate refresh token secret', meta: 'Medium · Aiden' },
  { key: 'WEB-092', title: 'Task keys generated atomically', meta: 'Low · Aiden' },
];

const FILTERS = ['Assignee: me', 'Priority: High+', 'Status: open'];

const CommandVisual = () => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = COMMANDS.filter(
    (c) => !q || c.title.toLowerCase().includes(q) || c.key.toLowerCase().includes(q)
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.25)]">
      <label className="flex items-center gap-2 border-b border-zinc-100 px-3.5 py-3">
        <Search className="size-4 text-zinc-400" aria-hidden="true" />
        <span className="sr-only">Search tasks</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks, keys, people…"
          className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
        <kbd className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-500">
          <Command className="size-3" aria-hidden="true" />K
        </kbd>
      </label>

      <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 px-3.5 py-2.5">
        <Filter className="mt-0.5 size-3.5 text-zinc-400" aria-hidden="true" />
        {FILTERS.map((f) => (
          <span
            key={f}
            className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
          >
            {f}
          </span>
        ))}
      </div>

      <ul className="p-1.5" aria-live="polite">
        {results.slice(0, 3).map((c, i) => (
          <li
            key={c.key}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${i === 0 ? 'bg-zinc-100/80' : ''}`}
          >
            <Hash className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
            <span className="font-mono text-[11px] text-zinc-500">{c.key}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-zinc-800">{c.title}</span>
            <span className="hidden text-[11px] text-zinc-400 sm:inline">{c.meta}</span>
          </li>
        ))}
        {results.length === 0 && (
          <li className="px-2.5 py-3 text-center text-[13px] text-zinc-500">
            No tasks match “{query}”.
          </li>
        )}
      </ul>
    </div>
  );
};

/* ---------- 3. queues & reminders ---------- */

const JOBS = [
  {
    icon: Bell,
    label: 'Mention notification',
    detail: 'sofia → marcus',
    state: 'Completed',
    style: 'text-emerald-700 bg-emerald-50 ring-emerald-200',
    stateIcon: CircleCheck,
  },
  {
    icon: Mail,
    label: 'Daily digest',
    detail: '14 unread · 08:00',
    state: 'Scheduled',
    style: 'text-sky-700 bg-sky-50 ring-sky-200',
    stateIcon: CalendarClock,
  },
  {
    icon: Timer,
    label: 'Due-date reminder',
    detail: 'WEB-104 · in 2h',
    state: 'Delayed',
    style: 'text-amber-700 bg-amber-50 ring-amber-200',
    stateIcon: Timer,
  },
  {
    icon: Zap,
    label: 'Webhook delivery',
    detail: 'retry 2 of 5',
    state: 'Retrying',
    style: 'text-violet-700 bg-violet-50 ring-violet-200',
    stateIcon: Loader,
  },
];

const QueueVisual = () => (
  <ul className="space-y-2" aria-label="Example background jobs">
    {JOBS.map(({ icon: Icon, label, detail, state, style, stateIcon: StateIcon }) => (
      <li
        key={label}
        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-50 text-zinc-500 ring-1 ring-zinc-200">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-800">{label}</span>
          <span className="block truncate text-[11px] text-zinc-500">{detail}</span>
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${style}`}
        >
          <StateIcon
            className={`size-3 ${state === 'Retrying' ? 'animate-spin motion-reduce:animate-none' : ''}`}
            aria-hidden="true"
          />
          {state}
        </span>
      </li>
    ))}
  </ul>
);

/* ---------- 4. tenant isolation ---------- */

const SecurityVisual = () => (
  <div className="space-y-3" aria-hidden="true">
    <div className="grid grid-cols-2 gap-3">
      {[
        { name: 'abc-software', rows: 3 },
        { name: 'veloce-labs', rows: 3 },
      ].map((ws) => (
        <div key={ws.name} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="flex items-center gap-1.5 truncate font-mono text-[11px] text-zinc-600">
            <Lock className="size-3 shrink-0 text-emerald-600" />
            {ws.name}
          </p>
          <div className="mt-2.5 space-y-1.5">
            {Array.from({ length: ws.rows }).map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full bg-zinc-200"
                style={{ width: `${90 - i * 18}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>

    <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-300">
      <span className="text-zinc-500">{'// every query is scoped to the tenant'}</span>
      {'\n'}
      <span className="text-sky-300">Task</span>.find({'{'}
      {'\n  '}
      <span className="text-emerald-300">workspaceId</span>: req.workspace.id,
      {'\n  '}
      projectId,
      {'\n'}
      {'}'})
    </pre>

    <div className="flex flex-wrap gap-2">
      {[
        { icon: KeyRound, label: 'Short-lived JWT' },
        { icon: Fingerprint, label: 'Rotating refresh tokens' },
        { icon: Lock, label: 'bcrypt hashing' },
      ].map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600"
        >
          <Icon className="size-3 text-emerald-600" />
          {label}
        </span>
      ))}
    </div>
  </div>
);

/* ---------- grid ---------- */

const BentoGridFeatures = () => (
  <section
    aria-labelledby="bento-title"
    className="relative overflow-hidden bg-zinc-50/70 py-20 sm:py-28"
  >
    <div
      className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_30%,transparent_80%)] bg-[size:56px_56px]"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        id="bento-title"
        eyebrow="Under the hood"
        title="Built like infrastructure, feels like magic."
        description="The engineering most project tools skip — real-time sync, background jobs and tenant isolation — is the foundation of Kanbrix."
      />

      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <CardShell
          icon={Radio}
          title="Real-time sync over WebSockets"
          description="Move a card and every open screen updates in milliseconds — no refresh, no stale boards, no “who changed this?”."
          className="md:col-span-2"
        >
          <SyncVisual />
        </CardShell>

        <CardShell
          icon={Search}
          title="Global search & granular filters"
          description="Press ⌘K to jump to any task by key, title or person, then stack filters to find exactly what matters."
          delay={80}
        >
          <CommandVisual />
        </CardShell>

        <CardShell
          icon={CalendarClock}
          title="Automated queues & reminders"
          description="Notifications, due-date reminders and daily digests run on durable background queues with automatic retries."
          delay={80}
        >
          <QueueVisual />
        </CardShell>

        <CardShell
          icon={Lock}
          title="Multi-tenant workspace security"
          description="Every workspace's data is isolated at the query level, and cross-tenant attempts are blocked and audit-logged."
          className="md:col-span-2"
          delay={160}
        >
          <SecurityVisual />
        </CardShell>
      </div>
    </div>
  </section>
);

export default BentoGridFeatures;
