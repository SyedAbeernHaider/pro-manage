import { useId, useState } from 'react';
import {
  Ellipsis,
  FolderKanban,
  Globe,
  Megaphone,
  Plus,
  Rocket,
  Search,
  Smartphone,
} from 'lucide-react';
import useInView from '../../hooks/useInView';
import MockAvatar from './MockAvatar';
import { PEOPLE } from './mockData';

const STATUS_STYLES = {
  'In Progress': 'bg-sky-50 text-sky-700 ring-sky-200',
  'On Hold': 'bg-rose-50 text-rose-700 ring-rose-200',
  Planning: 'bg-violet-50 text-violet-700 ring-violet-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const PROJECTS = [
  {
    name: 'Website Redesign',
    key: 'WEB',
    icon: Globe,
    tone: 'from-violet-500 to-indigo-500',
    status: 'In Progress',
    tasks: 12,
    due: 'Apr 30',
    progress: 64,
    team: ['sarah', 'ali', 'omar'],
  },
  {
    name: 'Mobile App Development',
    key: 'APP',
    icon: Smartphone,
    tone: 'from-rose-500 to-orange-400',
    status: 'On Hold',
    tasks: 8,
    due: 'May 15',
    progress: 38,
    team: ['ayesha', 'omar'],
  },
  {
    name: 'Marketing Campaign',
    key: 'MKT',
    icon: Megaphone,
    tone: 'from-amber-400 to-orange-400',
    status: 'Planning',
    tasks: 5,
    due: 'May 30',
    progress: 12,
    team: ['sarah', 'ayesha'],
  },
  {
    name: 'Product Launch',
    key: 'LCH',
    icon: Rocket,
    tone: 'from-sky-500 to-blue-600',
    status: 'Completed',
    tasks: 20,
    due: 'Mar 10',
    progress: 100,
    team: ['ali', 'sarah', 'omar'],
  },
];

const ProjectsMockup = () => {
  const [query, setQuery] = useState('');
  const [ref, inView] = useInView();
  const inputId = useId();

  const q = query.trim().toLowerCase();
  const results = PROJECTS.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),0_30px_70px_-24px_rgba(15,23,42,0.22)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 p-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Projects</p>
          <p className="text-[11px] text-zinc-500">abc-software workspace</p>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:flex-none">
          <label
            htmlFor={inputId}
            className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 sm:w-48 sm:flex-none"
          >
            <Search className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input
              id={inputId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="min-w-0 flex-1 bg-transparent text-xs text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </label>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white"
            aria-hidden="true"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </span>
        </div>
      </div>

      <ul className="divide-y divide-zinc-100" aria-live="polite">
        {results.map((p, i) => {
          const Icon = p.icon;

          return (
            <li
              key={p.key}
              style={{ transitionDelay: `${i * 90}ms` }}
              className={`group flex items-center gap-3 px-4 py-3.5 transition-[opacity,translate,background-color] duration-500 ease-out-expo hover:bg-zinc-50/80 ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              } motion-reduce:translate-y-0 motion-reduce:opacity-100`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm ${p.tone}`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="truncate text-[13px] font-semibold text-zinc-900">{p.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ring-1 ring-inset ${STATUS_STYLES[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100"
                    role="progressbar"
                    aria-valuenow={p.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${p.name} progress`}
                  >
                    <div
                      style={{
                        width: inView ? `${p.progress}%` : '0%',
                        transitionDelay: `${300 + i * 120}ms`,
                      }}
                      className={`h-full rounded-full transition-[width] duration-1000 ease-out-expo ${p.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-medium text-zinc-500 tabular-nums">
                    {p.progress}%
                  </span>
                </div>
              </div>

              <div className="hidden shrink-0 text-right text-[11px] text-zinc-500 sm:block">
                <p>{p.tasks} tasks</p>
                <p>Due {p.due}</p>
              </div>

              <div className="hidden shrink-0 -space-x-1.5 md:flex">
                {p.team.map((id) => (
                  <MockAvatar key={id} person={PEOPLE[id]} className="size-6" />
                ))}
              </div>

              <Ellipsis
                className="size-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-500"
                aria-hidden="true"
              />
            </li>
          );
        })}

        {results.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-zinc-500">
            <FolderKanban className="size-6 text-zinc-300" aria-hidden="true" />
            No projects match “{query}”.
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProjectsMockup;
