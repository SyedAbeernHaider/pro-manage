import { useId, useRef, useState } from 'react';
import {
  ArrowRight,
  AtSign,
  ChartColumn,
  Check,
  CircleDashed,
  Clock,
  Crown,
  Eye,
  GripVertical,
  Minus,
  MousePointer2,
  Send,
  ShieldCheck,
  SquareKanban,
  TrendingDown,
  User,
  UserCog,
  Users,
  X,
  Zap,
} from 'lucide-react';
import avatar1 from '../../assets/avatars/avatar-1.svg';
import avatar2 from '../../assets/avatars/avatar-2.svg';
import avatar3 from '../../assets/avatars/avatar-3.svg';
import avatar4 from '../../assets/avatars/avatar-4.svg';
import BrowserFrame from './BrowserFrame';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

const PEOPLE = {
  aiden: { name: 'Aiden', avatar: avatar1 },
  sofia: { name: 'Sofia', avatar: avatar2 },
  marcus: { name: 'Marcus', avatar: avatar3 },
  layla: { name: 'Layla', avatar: avatar4 },
};

const Avatar = ({ person, size = 'size-6', ring = 'ring-white' }) => (
  <img
    src={person.avatar}
    alt={person.name}
    title={person.name}
    className={`${size} shrink-0 rounded-full bg-white ring-2 ${ring}`}
    loading="lazy"
  />
);

/* =========================================================
   1. KANBAN & SPRINT BOARD
========================================================= */

const COLUMNS = [
  { id: 'todo', label: 'To Do', dot: 'bg-zinc-400' },
  { id: 'progress', label: 'In Progress', dot: 'bg-amber-500' },
  { id: 'done', label: 'Done', dot: 'bg-emerald-500' },
];

const PRIORITY_STYLES = {
  Urgent: 'bg-rose-50 text-rose-700 ring-rose-200',
  High: 'bg-orange-50 text-orange-700 ring-orange-200',
  Medium: 'bg-sky-50 text-sky-700 ring-sky-200',
  Low: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

const INITIAL_TASKS = [
  {
    id: 'WEB-101',
    title: 'Set up workspace onboarding flow',
    priority: 'High',
    column: 'todo',
    assignee: 'aiden',
    points: 5,
  },
  {
    id: 'WEB-104',
    title: 'Rate-limit the public API',
    priority: 'Urgent',
    column: 'todo',
    assignee: 'marcus',
    points: 3,
  },
  {
    id: 'WEB-097',
    title: 'Invite members by email',
    priority: 'Medium',
    column: 'progress',
    assignee: 'sofia',
    points: 3,
  },
  {
    id: 'WEB-099',
    title: 'Real-time board sync via sockets',
    priority: 'High',
    column: 'progress',
    assignee: 'layla',
    points: 8,
  },
  {
    id: 'WEB-092',
    title: 'Task keys generated atomically',
    priority: 'Low',
    column: 'done',
    assignee: 'aiden',
    points: 2,
  },
];

const KanbanView = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [dragId, setDragId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  const moveTask = (id, column) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, column } : t)));

  const shift = (task, direction) => {
    const index = COLUMNS.findIndex((c) => c.id === task.column) + direction;
    if (index >= 0 && index < COLUMNS.length) moveTask(task.id, COLUMNS[index].id);
  };

  const donePoints = tasks.filter((t) => t.column === 'done').reduce((s, t) => s + t.points, 0);
  const totalPoints = tasks.reduce((s, t) => s + t.points, 0);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-zinc-500">Web App · Sprint 14</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-900">
            {donePoints} of {totalPoints} points done
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {Object.values(PEOPLE).map((p) => (
              <Avatar key={p.name} person={p} />
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-emerald-500" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>
      </div>

      <p className="mb-3 text-xs text-zinc-500 sm:hidden">
        Use the arrows to move cards between columns.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.column === column.id);

          return (
            <div
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverColumn(column.id);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) moveTask(dragId, column.id);
                setDragId(null);
                setOverColumn(null);
              }}
              className={`min-h-40 rounded-xl border p-2.5 transition-colors ${
                overColumn === column.id
                  ? 'border-emerald-300 bg-emerald-50/70'
                  : 'border-zinc-200/80 bg-zinc-50'
              }`}
            >
              <div className="mb-2.5 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                  <span className={`size-2 rounded-full ${column.dot}`} aria-hidden="true" />
                  {column.label}
                </span>
                <span className="rounded-md bg-white px-1.5 text-[11px] font-medium text-zinc-500 ring-1 ring-zinc-200">
                  {columnTasks.length}
                </span>
              </div>

              <ul className="space-y-2">
                {columnTasks.map((task) => {
                  const colIndex = COLUMNS.findIndex((c) => c.id === task.column);

                  return (
                    <li
                      key={task.id}
                      draggable
                      onDragStart={(e) => {
                        setDragId(task.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => setDragId(null)}
                      className={`group cursor-grab rounded-lg border border-zinc-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md active:cursor-grabbing ${
                        dragId === task.id ? 'rotate-1 opacity-60' : ''
                      } ${task.column === 'done' ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-start gap-1.5">
                        <GripVertical
                          className="mt-0.5 size-3.5 shrink-0 text-zinc-300 transition group-hover:text-zinc-500"
                          aria-hidden="true"
                        />
                        <p
                          className={`text-[13px] leading-snug font-medium text-zinc-800 ${
                            task.column === 'done' ? 'line-through decoration-zinc-300' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="font-mono text-[11px] whitespace-nowrap text-zinc-500">
                            {task.id}
                          </span>
                          <span
                            className={`rounded whitespace-nowrap px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${PRIORITY_STYLES[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => shift(task, -1)}
                            disabled={colIndex === 0}
                            aria-label={`Move ${task.id} left`}
                            className="grid size-6 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-0 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                          >
                            <ArrowRight className="size-3.5 rotate-180" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => shift(task, 1)}
                            disabled={colIndex === COLUMNS.length - 1}
                            aria-label={`Move ${task.id} right`}
                            className="grid size-6 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-0 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                          >
                            <ArrowRight className="size-3.5" aria-hidden="true" />
                          </button>
                          <Avatar person={PEOPLE[task.assignee]} size="size-5" />
                        </div>
                      </div>
                    </li>
                  );
                })}

                {columnTasks.length === 0 && (
                  <li className="rounded-lg border border-dashed border-zinc-300 px-3 py-6 text-center text-xs text-zinc-400">
                    Drop a card here
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================
   2. REAL-TIME COLLABORATION
========================================================= */

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: 'sofia',
    time: '2m ago',
    text: '@Marcus the empty state copy is ready — can you review before standup?',
  },
  {
    id: 2,
    author: 'marcus',
    time: '1m ago',
    text: 'Looks great. Moving WEB-142 to review. @Layla want to pair on the animation?',
  },
];

/** Highlights @mentions inside a comment. */
const renderMentions = (text) =>
  text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="rounded bg-emerald-50 px-1 font-medium text-emerald-700">
        {part}
      </span>
    ) : (
      part
    )
  );

const CollaborationView = () => {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [draft, setDraft] = useState('');
  const inputId = useId();

  const submit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: Date.now(), author: 'you', time: 'just now', text }]);
    setDraft('');
  };

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr]">
      {/* task detail with live cursors */}
      <div className="relative overflow-hidden border-b border-zinc-200 p-5 sm:p-6 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-mono">WEB-142</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
            <CircleDashed className="size-3" aria-hidden="true" />
            In review
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
          Redesign the onboarding empty states
        </h3>

        <div className="mt-4 space-y-2.5" aria-hidden="true">
          <div className="h-2.5 w-11/12 rounded-full bg-zinc-100" />
          <div className="h-2.5 w-4/5 rounded-full bg-zinc-100" />
          <div className="h-2.5 w-3/5 rounded-full bg-emerald-100" />
          <div className="h-2.5 w-10/12 rounded-full bg-zinc-100" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
          {[
            ['Assignee', 'Sofia'],
            ['Priority', 'High'],
            ['Due', 'Fri'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-zinc-200 px-3 py-2">
              <p className="text-zinc-500">{label}</p>
              <p className="mt-0.5 font-medium text-zinc-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
          <div className="flex -space-x-1.5">
            <Avatar person={PEOPLE.sofia} size="size-5" />
            <Avatar person={PEOPLE.marcus} size="size-5" />
          </div>
          2 people viewing now
        </div>

        {/* live cursors */}
        <div
          className="pointer-events-none absolute top-16 left-8 animate-cursor-a motion-reduce:animate-none"
          aria-hidden="true"
        >
          <MousePointer2 className="size-4 fill-sky-500 text-sky-500" />
          <span className="ml-3 rounded-md bg-sky-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
            Sofia
          </span>
        </div>
        <div
          className="pointer-events-none absolute top-40 right-10 animate-cursor-b motion-reduce:animate-none"
          aria-hidden="true"
        >
          <MousePointer2 className="size-4 fill-violet-500 text-violet-500" />
          <span className="ml-3 rounded-md bg-violet-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
            Marcus
          </span>
        </div>
      </div>

      {/* comment thread */}
      <div className="flex flex-col bg-zinc-50/60 p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Activity</p>

        <ul className="mt-4 flex-1 space-y-4" aria-live="polite">
          {comments.map((c) => {
            const person = PEOPLE[c.author];

            return (
              <li key={c.id} className="flex gap-3">
                {person ? (
                  <Avatar person={person} size="size-7" />
                ) : (
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                    <User className="size-3.5" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm border border-zinc-200 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <p className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-900">
                      {person ? person.name : 'You'}
                    </span>
                    <span className="text-zinc-400">{c.time}</span>
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed break-words text-zinc-700">
                    {renderMentions(c.text)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500" aria-hidden="true">
          <span className="flex gap-0.5">
            <span className="size-1 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
            <span className="size-1 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
            <span className="size-1 animate-bounce rounded-full bg-zinc-400" />
          </span>
          Layla is typing…
        </p>

        <form
          onSubmit={submit}
          className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1.5 pl-3 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10"
        >
          <label htmlFor={inputId} className="sr-only">
            Write a comment
          </label>
          <AtSign className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            id={inputId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Reply, @mention a teammate…"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send comment"
            className="grid size-8 place-items-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            <Send className="size-3.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   3. WORKSPACES & RBAC  (mirrors the permission matrix in the plan)
========================================================= */

const ROLES = [
  {
    id: 'OWNER',
    icon: Crown,
    summary:
      'Full control, including billing, deletion and ownership transfer. Exactly one per workspace.',
  },
  {
    id: 'ADMIN',
    icon: ShieldCheck,
    summary:
      'Runs the workspace day to day: settings, members and every project — but not billing or deletion.',
  },
  {
    id: 'MANAGER',
    icon: UserCog,
    summary:
      'Creates projects and manages the ones they lead. Can invite members to their own projects.',
  },
  {
    id: 'MEMBER',
    icon: Users,
    summary: 'Does the work: creates tasks, comments and updates tasks assigned to them.',
  },
  {
    id: 'VIEWER',
    icon: Eye,
    summary:
      'Read-only access to the projects they are added to — ideal for clients and stakeholders.',
  },
];

// Y = allowed, S = allowed with a scope condition, N = denied
const PERMISSIONS = [
  { label: 'Update workspace settings', values: ['Y', 'Y', 'N', 'N', 'N'] },
  { label: 'Manage billing', values: ['Y', 'N', 'N', 'N', 'N'] },
  { label: 'Invite members', values: ['Y', 'Y', 'S', 'N', 'N'] },
  { label: 'Create projects', values: ['Y', 'Y', 'Y', 'N', 'N'] },
  { label: 'View projects', values: ['Y', 'Y', 'Y', 'S', 'S'] },
  { label: 'Create tasks', values: ['Y', 'Y', 'Y', 'Y', 'N'] },
  { label: 'Edit tasks', values: ['Y', 'Y', 'Y', 'S', 'N'] },
  { label: 'Comment', values: ['Y', 'Y', 'Y', 'Y', 'N'] },
];

const PermissionMark = ({ value }) => {
  if (value === 'Y') {
    return (
      <span className="inline-grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <Check className="size-3.5" strokeWidth={3} aria-label="Allowed" />
      </span>
    );
  }
  if (value === 'S') {
    return (
      <span className="inline-grid size-6 place-items-center rounded-full bg-amber-100 text-amber-700">
        <Minus className="size-3.5" strokeWidth={3} aria-label="Scoped" />
      </span>
    );
  }
  return (
    <span className="inline-grid size-6 place-items-center rounded-full bg-zinc-100 text-zinc-400">
      <X className="size-3.5" strokeWidth={3} aria-label="Denied" />
    </span>
  );
};

const RbacView = () => {
  const [active, setActive] = useState(2);
  const role = ROLES[active];
  const RoleIcon = role.icon;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a role">
        {ROLES.map((r, i) => {
          const Icon = r.icon;
          const selected = i === active;

          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                selected
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)]'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {r.id}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 ring-1 ring-emerald-200">
          <RoleIcon className="size-4" aria-hidden="true" />
        </span>
        <p className="text-[13px] leading-relaxed text-zinc-700">
          <span className="font-semibold text-zinc-900">{role.id}</span> — {role.summary}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead className="bg-zinc-50 text-xs text-zinc-500">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Permission
              </th>
              {ROLES.map((r, i) => (
                <th
                  key={r.id}
                  scope="col"
                  className={`px-2 py-2.5 text-center font-semibold transition-colors ${
                    i === active ? 'bg-emerald-100/70 text-emerald-800' : ''
                  }`}
                >
                  {r.id.charAt(0) + r.id.slice(1).toLowerCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {PERMISSIONS.map((p) => (
              <tr key={p.label}>
                <th scope="row" className="px-4 py-2.5 font-medium text-zinc-700">
                  {p.label}
                </th>
                {p.values.map((v, i) => (
                  <td
                    key={ROLES[i].id}
                    className={`px-2 py-2 text-center transition-colors ${i === active ? 'bg-emerald-50/80' : ''}`}
                  >
                    <PermissionMark value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <PermissionMark value="Y" /> Allowed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PermissionMark value="S" /> Own projects / assigned tasks only
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PermissionMark value="N" /> Denied — enforced by the API, not just hidden
        </span>
      </p>
    </div>
  );
};

/* =========================================================
   4. VELOCITY & REPORTING
========================================================= */

const SPRINTS = {
  'Sprint 13': {
    committed: 42,
    remaining: [42, 40, 37, 35, 35, 30, 26, 21, 15, 9, 4],
    velocity: 38,
    cycle: '2.4d',
    scope: '+3',
  },
  'Sprint 14': {
    committed: 48,
    remaining: [48, 46, 41, 38, 33, 29, 26, 20, 13, 6, 0],
    velocity: 48,
    cycle: '1.9d',
    scope: '0',
  },
};

const VELOCITY_HISTORY = [31, 34, 29, 38, 38, 48];

const CHART = { w: 520, h: 220, pad: 28 };

const BurndownChart = ({ data }) => {
  const { w, h, pad } = CHART;
  const max = data.committed;
  const x = (i) => pad + (i / (data.remaining.length - 1)) * (w - pad * 2);
  const y = (v) => pad + (1 - v / max) * (h - pad * 2);

  const actual = data.remaining.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
  const area = `${actual} L${x(data.remaining.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const last = data.remaining.length - 1;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full"
      role="img"
      aria-label="Burndown chart: remaining story points per day versus the ideal line"
    >
      <defs>
        <linearGradient id="burn-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line
            x1={pad}
            x2={w - pad}
            y1={y(max * t)}
            y2={y(max * t)}
            stroke="#f4f4f5"
            strokeWidth="1"
          />
          <text
            x={pad - 8}
            y={y(max * t) + 4}
            textAnchor="end"
            className="fill-zinc-400 text-[10px]"
          >
            {Math.round(max * t)}
          </text>
        </g>
      ))}

      {/* ideal */}
      <line
        x1={x(0)}
        y1={y(max)}
        x2={x(last)}
        y2={y(0)}
        stroke="#a1a1aa"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />

      {/* actual */}
      <path d={area} fill="url(#burn-area)" className="transition-all duration-500" />
      <path
        d={actual}
        fill="none"
        stroke="#059669"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="transition-all duration-500"
      />

      {data.remaining.map((v, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(v)}
          r={i === last ? 4.5 : 2.5}
          fill={i === last ? '#059669' : '#ffffff'}
          stroke="#059669"
          strokeWidth="2"
          className="transition-all duration-500"
        />
      ))}

      {data.remaining.map((_, i) => (
        <text key={i} x={x(i)} y={h - 8} textAnchor="middle" className="fill-zinc-400 text-[10px]">
          D{i + 1}
        </text>
      ))}
    </svg>
  );
};

const ReportingView = () => {
  const [sprint, setSprint] = useState('Sprint 14');
  const data = SPRINTS[sprint];
  const completion = Math.round(((data.committed - data.remaining.at(-1)) / data.committed) * 100);
  const maxVelocity = Math.max(...VELOCITY_HISTORY);

  const metrics = [
    { label: 'Completion', value: `${completion}%`, icon: Check },
    { label: 'Velocity', value: `${data.velocity} pts`, icon: Zap },
    { label: 'Avg. cycle time', value: data.cycle, icon: Clock },
    { label: 'Scope change', value: data.scope, icon: TrendingDown },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-zinc-500">Web App · Burndown</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-900">
            {data.committed} points committed
          </p>
        </div>

        <div
          className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
          role="radiogroup"
          aria-label="Choose a sprint"
        >
          {Object.keys(SPRINTS).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={sprint === s}
              onClick={() => setSprint(s)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                sprint === s
                  ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-zinc-200 p-3">
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Icon className="size-3.5 text-emerald-600" aria-hidden="true" />
              {label}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-zinc-900 tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_180px]">
        <div className="rounded-xl border border-zinc-200 p-2 sm:p-3">
          <BurndownChart data={data} />
          <p className="flex gap-4 px-2 pb-1 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-emerald-600" /> Actual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0 w-4 border-t-2 border-dashed border-zinc-400" /> Ideal
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 p-3">
          <p className="text-xs font-medium text-zinc-500">Velocity, last 6 sprints</p>
          <div
            className="mt-3 flex h-32 items-end gap-2"
            role="img"
            aria-label={`Velocity history: ${VELOCITY_HISTORY.join(', ')} points`}
          >
            {VELOCITY_HISTORY.map((v, i) => (
              <div
                key={i}
                style={{ height: `${(v / maxVelocity) * 100}%` }}
                className={`flex-1 rounded-t-md transition-colors ${
                  i === VELOCITY_HISTORY.length - 1
                    ? 'bg-emerald-500'
                    : 'bg-emerald-100 hover:bg-emerald-200'
                }`}
                title={`${v} points`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SHOWCASE
========================================================= */

const TABS = [
  {
    id: 'kanban',
    label: 'Kanban & Sprints',
    desc: 'Drag cards across a live sprint board.',
    icon: SquareKanban,
    url: 'app.kanbrix.com/abc-software/web/board',
    View: KanbanView,
  },
  {
    id: 'collab',
    label: 'Real-time collaboration',
    desc: 'Live cursors, threads and @mentions.',
    icon: Users,
    url: 'app.kanbrix.com/abc-software/web/WEB-142',
    View: CollaborationView,
  },
  {
    id: 'rbac',
    label: 'Workspaces & roles',
    desc: 'Five roles, enforced by the API.',
    icon: ShieldCheck,
    url: 'app.kanbrix.com/abc-software/settings/roles',
    View: RbacView,
  },
  {
    id: 'reports',
    label: 'Velocity & reporting',
    desc: 'Burndown and sprint health at a glance.',
    icon: ChartColumn,
    url: 'app.kanbrix.com/abc-software/web/reports',
    View: ReportingView,
  },
];

const InteractiveShowcase = () => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const baseId = useId();
  const tab = TABS[active];
  const ActiveView = tab.View;

  // roving focus: arrow keys move between tabs (WAI-ARIA tabs pattern)
  const onKeyDown = (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = null;
    if (e.key in keys) next = (active + keys[e.key] + TABS.length) % TABS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="features"
      aria-labelledby="showcase-title"
      className="scroll-mt-24 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="showcase-title"
          eyebrow="Product"
          title="Everything your team needs to ship faster, with zero clutter."
          description="Boards, conversations, permissions and reporting live in one place — and update for everyone the moment something changes."
        />

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-16 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
          {/* tabs */}
          <Reveal>
            <div
              role="tablist"
              aria-label="Product features"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
            >
              {TABS.map((t, i) => {
                const Icon = t.icon;
                const selected = i === active;

                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${t.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`group relative flex min-w-[220px] shrink-0 snap-start items-start gap-3 rounded-2xl border p-4 text-left transition duration-300 lg:min-w-0 ${
                      selected
                        ? 'border-emerald-200 bg-white shadow-[0_10px_30px_-12px_rgba(5,150,105,0.35)]'
                        : 'border-transparent bg-zinc-50 hover:border-zinc-200 hover:bg-white'
                    } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl transition ${
                        selected
                          ? 'bg-gradient-to-br from-emerald-600 to-emerald-400 text-white shadow-[0_6px_14px_rgba(5,150,105,0.35)]'
                          : 'bg-white text-zinc-500 ring-1 ring-zinc-200 group-hover:text-emerald-600'
                      }`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span
                        className={`block text-sm font-semibold ${selected ? 'text-zinc-900' : 'text-zinc-700'}`}
                      >
                        {t.label}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-zinc-500">
                        {t.desc}
                      </span>
                    </span>

                    {selected && (
                      <span
                        className="absolute inset-y-4 -left-px hidden w-[3px] rounded-full bg-emerald-500 lg:block"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* panel */}
          <Reveal delay={120} className="relative min-w-0">
            <div
              className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-emerald-200/50 via-emerald-50/40 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <BrowserFrame url={tab.url}>
              <div
                key={tab.id}
                role="tabpanel"
                id={`${baseId}-panel`}
                aria-labelledby={`${baseId}-tab-${tab.id}`}
                tabIndex={0}
                className="animate-fade-in motion-reduce:animate-none focus:outline-none"
              >
                <ActiveView />
              </div>
            </BrowserFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
