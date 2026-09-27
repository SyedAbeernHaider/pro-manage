import { Building2, CircleCheck, FolderKanban, Radio } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

/* ---------- step visuals ---------- */

const WorkspaceVisual = () => (
  <div className="space-y-2.5" aria-hidden="true">
    <div className="flex min-w-0 items-center rounded-lg border border-zinc-200 bg-white text-[13px]">
      <span className="shrink-0 border-r border-zinc-200 px-2.5 py-2 text-zinc-400">
        kanbrix.app/
      </span>
      <span className="min-w-0 truncate px-2.5 py-2 font-medium text-zinc-900">
        abc-software
        <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-emerald-600 motion-reduce:animate-none" />
      </span>
      <CircleCheck className="mr-2.5 ml-auto size-4 shrink-0 text-emerald-600" />
    </div>
    <div className="flex flex-wrap gap-1.5">
      {[
        ['ali@abc.dev', 'Owner'],
        ['abeer@abc.dev', 'Manager'],
        ['client@acme.io', 'Viewer'],
      ].map(([email, role]) => (
        <span
          key={email}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white py-0.5 pr-1 pl-2.5 text-[11px] text-zinc-600"
        >
          {email}
          <span className="rounded-full bg-emerald-50 px-1.5 py-px text-[10px] font-semibold text-emerald-700">
            {role}
          </span>
        </span>
      ))}
    </div>
  </div>
);

const ProjectVisual = () => (
  <div className="space-y-2" aria-hidden="true">
    {[
      ['WEB-101', 'Onboarding flow', 'To Do', 'bg-zinc-100 text-zinc-600'],
      ['WEB-102', 'Email verification', 'In Review', 'bg-amber-50 text-amber-700'],
      ['WEB-103', 'Billing page', 'Blocked', 'bg-rose-50 text-rose-700'],
    ].map(([key, title, status, style]) => (
      <div
        key={key}
        className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[13px]"
      >
        <span className="font-mono text-[11px] text-emerald-700">{key}</span>
        <span className="min-w-0 flex-1 truncate text-zinc-800">{title}</span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${style}`}>{status}</span>
      </div>
    ))}
  </div>
);

const LiveVisual = () => (
  <div className="space-y-2" aria-hidden="true">
    {[
      ['Layla', 'moved WEB-099 to Done', 'now'],
      ['Marcus', 'commented on WEB-104', '12s'],
      ['Sofia', 'assigned you WEB-102', '1m'],
    ].map(([who, what, when], i) => (
      <div
        key={what}
        className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[13px]"
      >
        <span className="relative flex size-2 shrink-0">
          {i === 0 && (
            <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-emerald-500 motion-reduce:animate-none" />
          )}
          <span
            className={`relative inline-flex size-2 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-zinc-300'}`}
          />
        </span>
        <span className="min-w-0 flex-1 truncate text-zinc-600">
          <span className="font-medium text-zinc-900">{who}</span> {what}
        </span>
        <span className="text-[11px] text-zinc-400">{when}</span>
      </div>
    ))}
  </div>
);

const STEPS = [
  {
    icon: Building2,
    title: 'Create a workspace & invite your team',
    description:
      'Claim a unique workspace URL in seconds, then invite teammates with the right role from day one.',
    Visual: WorkspaceVisual,
  },
  {
    icon: FolderKanban,
    title: 'Structure projects & atomic tasks',
    description:
      'Every task gets a human-readable key like WEB-101, custom statuses, priorities and owners.',
    Visual: ProjectVisual,
  },
  {
    icon: Radio,
    title: 'Ship & collaborate live',
    description:
      'Changes, comments and assignments reach everyone instantly — no page reloads, no status meetings.',
    Visual: LiveVisual,
  },
];

const WorkflowSteps = () => (
  <section
    id="how-it-works"
    aria-labelledby="workflow-title"
    className="scroll-mt-24 bg-white py-20 sm:py-28"
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        id="workflow-title"
        eyebrow="How it works"
        title="From sign-up to shipping in three steps."
        description="No consultants, no week-long setup. Most teams run their first sprint the same day."
      />

      <ol className="relative mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 sm:mt-16 lg:grid-cols-3 lg:gap-8">
        {/* connecting line: vertical on mobile, horizontal on desktop */}
        <span
          className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-emerald-300 via-emerald-200 to-transparent lg:top-6 lg:right-[16.66%] lg:bottom-auto lg:left-[16.66%] lg:h-px lg:w-auto lg:bg-gradient-to-r lg:from-emerald-300 lg:via-emerald-300 lg:to-emerald-200"
          aria-hidden="true"
        />

        {STEPS.map(({ icon: Icon, title, description, Visual }, i) => (
          <Reveal
            as="li"
            key={title}
            delay={i * 120}
            className="relative pl-16 lg:pl-0 lg:text-center"
          >
            <span className="absolute top-0 left-0 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-white shadow-[0_10px_24px_-8px_rgba(5,150,105,0.55)] ring-4 ring-white lg:relative lg:mx-auto">
              <Icon className="size-5" aria-hidden="true" />
              <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white ring-2 ring-white">
                {i + 1}
              </span>
            </span>

            <h3 className="text-lg font-semibold tracking-tight text-zinc-900 lg:mt-6">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 lg:mx-auto lg:max-w-xs">
              {description}
            </p>

            <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.3)]">
              <Visual />
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default WorkflowSteps;
