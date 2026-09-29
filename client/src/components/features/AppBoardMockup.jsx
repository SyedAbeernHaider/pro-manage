import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  FolderKanban,
  House,
  ListChecks,
  Plus,
  Search,
  Settings,
  SquareKanban,
  Users,
} from 'lucide-react';
import logoMark from '../../assets/kanbrix-mark.svg';
import useInView from '../../hooks/useInView';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import MockAvatar from './MockAvatar';
import { PEOPLE, PRIORITY_STYLES } from './mockData';

const NAV = [
  { label: 'Home', icon: House },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Board', icon: SquareKanban, active: true },
  { label: 'My Tasks', icon: ListChecks },
  { label: 'Team', icon: Users },
  { label: 'Calendar', icon: Calendar },
  { label: 'Settings', icon: Settings },
];

const COLUMNS = [
  { id: 'todo', label: 'To Do', accent: 'bg-zinc-400' },
  { id: 'progress', label: 'In Progress', accent: 'bg-sky-500', highlight: true },
  { id: 'done', label: 'Done', accent: 'bg-emerald-500' },
];

const INITIAL_CARDS = [
  {
    id: 1,
    title: 'Design landing page',
    priority: 'High',
    estimate: '2h',
    column: 'todo',
    owner: 'sarah',
  },
  {
    id: 2,
    title: 'Build components',
    priority: 'Medium',
    estimate: '4h',
    column: 'todo',
    owner: 'ali',
  },
  {
    id: 3,
    title: 'Content writing',
    priority: 'Low',
    estimate: '3h',
    column: 'todo',
    owner: 'ayesha',
  },
  {
    id: 4,
    title: 'Frontend development',
    priority: 'High',
    estimate: '6h',
    column: 'progress',
    owner: 'omar',
  },
  {
    id: 5,
    title: 'API integration',
    priority: 'Medium',
    estimate: '3h',
    column: 'progress',
    owner: 'ali',
  },
  {
    id: 6,
    title: 'Project setup',
    priority: 'Low',
    estimate: '1h',
    column: 'done',
    owner: 'sarah',
  },
  {
    id: 7,
    title: 'UI/UX design',
    priority: 'Medium',
    estimate: '5h',
    column: 'done',
    owner: 'ayesha',
  },
];

const nextColumn = (column) => {
  const i = COLUMNS.findIndex((c) => c.id === column);
  return COLUMNS[(i + 1) % COLUMNS.length].id;
};

/**
 * Product board mockup.
 * - `live`: a card advances a column every few seconds, like a teammate working.
 * - `interactive`: visitors can add tasks and move cards themselves.
 */
const AppBoardMockup = ({ live = false, interactive = false, compact = false }) => {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [moved, setMoved] = useState(null);
  const [ref, inView] = useInView();
  const reduced = usePrefersReducedMotion();
  const nextId = useRef(INITIAL_CARDS.length + 1);

  const move = (id) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, column: nextColumn(c.column) } : c)));
    setMoved(id);
  };

  // live mode: cycle one "in progress" card forward to simulate real-time updates
  useEffect(() => {
    if (!live || !inView || reduced) return undefined;
    const order = [5, 3, 4, 2];
    let step = 0;
    const timer = setInterval(() => {
      move(order[step % order.length]);
      step += 1;
    }, 2600);
    return () => clearInterval(timer);
  }, [live, inView, reduced]);

  const addTask = () => {
    const id = nextId.current++;
    setCards((prev) => [
      {
        id,
        title: `New task #${id}`,
        priority: 'Low',
        estimate: '1h',
        column: 'todo',
        owner: 'sarah',
      },
      ...prev,
    ]);
    setMoved(id);
  };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),0_30px_70px_-24px_rgba(15,23,42,0.22)]"
    >
      <div className="flex">
        {/* sidebar */}
        <aside
          className={`hidden w-40 shrink-0 border-r border-zinc-100 bg-zinc-50/60 p-3 ${compact ? '' : 'md:block'}`}
        >
          <p className="flex items-center gap-2 px-2 pb-4 text-sm font-bold tracking-tight text-zinc-900">
            <img src={logoMark} alt="" className="size-5" />
            Kanbrix
          </p>
          <ul className="space-y-0.5" aria-hidden="true">
            {NAV.map(({ label, icon: Icon, active }) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] ${
                  active ? 'bg-emerald-600 font-medium text-white shadow-sm' : 'text-zinc-500'
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </li>
            ))}
          </ul>
        </aside>

        {/* board */}
        <div className="min-w-0 flex-1 p-3.5 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">Website Redesign</p>
              <p className="text-[11px] text-zinc-500">Sprint 14 · {cards.length} tasks</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden -space-x-1.5 sm:flex">
                {Object.values(PEOPLE).map((p) => (
                  <MockAvatar key={p.name} person={p} className="size-6" />
                ))}
              </div>
              <span className="hidden items-center gap-1.5 rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-400 lg:flex">
                <Search className="size-3" aria-hidden="true" />
                Search…
              </span>
              {interactive ? (
                <button
                  type="button"
                  onClick={addTask}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)] transition hover:bg-emerald-700 active:scale-95"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  New task
                </button>
              ) : (
                <span
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                  aria-hidden="true"
                >
                  <Plus className="size-3.5" />
                  New task
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5">
            {COLUMNS.map((column, colIndex) => {
              const columnCards = cards.filter((c) => c.column === column.id);

              return (
                <div
                  key={column.id}
                  className={`min-w-0 rounded-xl p-1.5 sm:p-2 ${column.highlight ? 'bg-sky-50/70' : 'bg-zinc-50'}`}
                >
                  <p className="mb-2 flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-700">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${column.accent}`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{column.label}</span>
                    </span>
                    <span className="text-zinc-400 tabular-nums">{columnCards.length}</span>
                  </p>

                  <ul className="space-y-1.5">
                    {columnCards.map((card, i) => (
                      <li
                        key={card.id}
                        style={{ transitionDelay: inView ? `${colIndex * 120 + i * 70}ms` : '0ms' }}
                        className={`group rounded-lg border bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[opacity,translate,box-shadow,border-color] duration-500 ease-out-expo ${
                          inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                        } ${
                          moved === card.id
                            ? 'animate-fade-in border-emerald-300 shadow-[0_6px_16px_rgba(16,185,129,0.25)]'
                            : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                        } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
                      >
                        <p
                          className={`truncate text-[11px] font-medium sm:text-[12px] ${
                            card.column === 'done'
                              ? 'text-zinc-500 line-through decoration-zinc-300'
                              : 'text-zinc-800'
                          }`}
                        >
                          {card.title}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-1">
                          <span className="flex min-w-0 items-center gap-1">
                            <span
                              className={`rounded px-1 py-px text-[9px] font-semibold whitespace-nowrap ring-1 ring-inset ${PRIORITY_STYLES[card.priority]}`}
                            >
                              {card.priority}
                            </span>
                            <span className="hidden items-center gap-0.5 text-[10px] text-zinc-400 sm:flex">
                              <Clock className="size-2.5" aria-hidden="true" />
                              {card.estimate}
                            </span>
                          </span>

                          {interactive ? (
                            <button
                              type="button"
                              onClick={() => move(card.id)}
                              aria-label={`Move “${card.title}” to the next column`}
                              className="relative -m-1.5 grid size-8 shrink-0 place-items-center rounded-full"
                            >
                              <MockAvatar
                                person={PEOPLE[card.owner]}
                                className="size-5 transition group-hover:opacity-0"
                              />
                              <ArrowRight
                                className="absolute size-3.5 text-emerald-600 opacity-0 transition group-hover:opacity-100"
                                aria-hidden="true"
                              />
                            </button>
                          ) : (
                            <MockAvatar person={PEOPLE[card.owner]} className="size-5" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {interactive && (
            <p className="mt-3 text-center text-[11px] text-zinc-400">
              Click <span className="font-medium text-zinc-600">New task</span>, or tap a card’s
              avatar to move it along.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBoardMockup;
