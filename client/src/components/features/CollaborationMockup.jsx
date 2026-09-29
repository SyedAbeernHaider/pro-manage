import { useId, useState } from 'react';
import {
  AtSign,
  Bell,
  Calendar,
  CircleCheck,
  MessageSquare,
  Paperclip,
  Send,
  SquareKanban,
} from 'lucide-react';
import useInView from '../../hooks/useInView';
import MockAvatar from './MockAvatar';
import { PEOPLE, PRIORITY_STYLES } from './mockData';

const TABS = ['Details', 'Comments', 'Activity'];

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: 'sarah',
    time: '2h ago',
    text: 'Looks great! @Ali can you review the header design?',
  },
  { id: 2, author: 'ali', time: '1h ago', text: 'Sure, I’ll take a look and update it shortly.' },
  {
    id: 3,
    author: 'ayesha',
    time: '30m ago',
    text: 'Added the latest design file. Let me know if you need any changes.',
  },
];

const ACTIVITY = [
  { who: 'ayesha', what: 'attached hero-v3.fig', time: '30m ago' },
  { who: 'omar', what: 'changed priority to High', time: '1h ago' },
  { who: 'sarah', what: 'created this task', time: 'Apr 18' },
];

const NOTIFICATIONS = [
  {
    icon: AtSign,
    tone: 'bg-sky-50 text-sky-600',
    title: 'Sarah Khan mentioned you',
    detail: 'in Design landing page',
    time: '2h ago',
  },
  {
    icon: MessageSquare,
    tone: 'bg-violet-50 text-violet-600',
    title: 'New comment on your task',
    detail: 'Frontend development',
    time: '3h ago',
  },
  {
    icon: SquareKanban,
    tone: 'bg-emerald-50 text-emerald-600',
    title: 'Task moved to Done',
    detail: 'API integration',
    time: '5h ago',
  },
  {
    icon: CircleCheck,
    tone: 'bg-amber-50 text-amber-600',
    title: 'Project updated',
    detail: 'Website Redesign',
    time: '6h ago',
  },
];

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

const CollaborationMockup = () => {
  const [tab, setTab] = useState('Comments');
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [draft, setDraft] = useState('');
  const [ref, inView] = useInView();
  const inputId = useId();
  const tabsId = useId();

  const submit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: Date.now(), author: null, time: 'just now', text }]);
    setDraft('');
    setTab('Comments');
  };

  return (
    <div ref={ref} className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      {/* task detail */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),0_30px_70px_-24px_rgba(15,23,42,0.22)]">
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">Design landing page</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${PRIORITY_STYLES.High}`}
                >
                  High
                </span>
                <div className="flex -space-x-1.5">
                  {Object.values(PEOPLE).map((p) => (
                    <MockAvatar key={p.name} person={p} className="size-5" />
                  ))}
                </div>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-zinc-500">
              <Calendar className="size-3" aria-hidden="true" />
              Apr 20
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Task sections"
            className="mt-4 flex gap-4 border-b border-zinc-100"
          >
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                id={`${tabsId}-${t}`}
                aria-selected={tab === t}
                aria-controls={`${tabsId}-panel`}
                onClick={() => setTab(t)}
                className={`relative -mb-px pb-2 text-[12px] font-medium transition-colors ${
                  tab === t ? 'text-emerald-700' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {t}
                {t === 'Comments' && (
                  <span className="ml-1 text-zinc-400 tabular-nums">({comments.length})</span>
                )}
                <span
                  className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-emerald-600 transition-transform duration-300 ${
                    tab === t ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <div
          id={`${tabsId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-${tab}`}
          key={tab}
          className="min-h-52 flex-1 animate-fade-in p-4 motion-reduce:animate-none"
        >
          {tab === 'Comments' && (
            <ul className="space-y-3.5" aria-live="polite">
              {comments.map((c) => {
                const person = c.author ? PEOPLE[c.author] : null;
                return (
                  <li key={c.id} className="flex gap-2.5">
                    {person ? (
                      <MockAvatar person={person} className="size-7" />
                    ) : (
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                        You
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-[12px]">
                        <span className="font-semibold text-zinc-900">
                          {person ? person.name : 'You'}
                        </span>
                        <span className="ml-2 text-zinc-400">{c.time}</span>
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed break-words text-zinc-600">
                        {renderMentions(c.text)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === 'Details' && (
            <dl className="grid grid-cols-2 gap-2.5 text-[12px]">
              {[
                ['Status', 'In Progress'],
                ['Assignee', 'Sarah Khan'],
                ['Task key', 'WEB-142'],
                ['Estimate', '2h'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-zinc-200 px-3 py-2">
                  <dt className="text-zinc-500">{k}</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">{v}</dd>
                </div>
              ))}
              <div className="col-span-2 flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-zinc-500">
                <Paperclip className="size-3.5" aria-hidden="true" />
                hero-v3.fig · 2.4 MB
              </div>
            </dl>
          )}

          {tab === 'Activity' && (
            <ol className="relative space-y-4 border-l border-zinc-200 pl-4">
              {ACTIVITY.map((a) => (
                <li key={a.what} className="relative text-[12px] text-zinc-600">
                  <span
                    className="absolute top-1 -left-[21px] size-2.5 rounded-full border-2 border-white bg-emerald-500"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-zinc-900">{PEOPLE[a.who].name}</span> {a.what}
                  <span className="block text-[11px] text-zinc-400">{a.time}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 border-t border-zinc-100 p-3">
          <label htmlFor={inputId} className="sr-only">
            Add a comment
          </label>
          <input
            id={inputId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment, @mention someone…"
            className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 text-[12px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[12px] font-semibold text-white transition hover:bg-emerald-700 active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            <Send className="size-3.5" aria-hidden="true" />
            Send
          </button>
        </form>
      </div>

      {/* notifications */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_30px_70px_-24px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-zinc-900">Notifications</p>
          <span className="relative">
            <Bell
              className={`size-4 text-zinc-500 ${inView ? 'origin-top animate-wiggle' : ''} motion-reduce:animate-none`}
              aria-hidden="true"
            />
            <span className="absolute -top-1.5 -right-1.5 grid size-3.5 place-items-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
              {NOTIFICATIONS.length}
            </span>
          </span>
        </div>

        <ul className="mt-4 space-y-3">
          {NOTIFICATIONS.map(({ icon: Icon, tone, title, detail, time }, i) => (
            <li
              key={title}
              style={{ animationDelay: `${200 + i * 160}ms` }}
              className={`flex gap-2.5 ${inView ? 'animate-slide-in' : 'opacity-0'} motion-reduce:animate-none motion-reduce:opacity-100`}
            >
              <span className={`grid size-7 shrink-0 place-items-center rounded-full ${tone}`}>
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 text-[11px] leading-snug">
                <p className="font-medium text-zinc-900">{title}</p>
                <p className="truncate text-zinc-500">{detail}</p>
                <p className="mt-0.5 text-zinc-400">{time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollaborationMockup;
