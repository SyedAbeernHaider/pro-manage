import { useState } from 'react';
import { CircleCheck, Target, Timer, TrendingUp } from 'lucide-react';
import useCountUp from '../../hooks/useCountUp';
import useInView from '../../hooks/useInView';

const RANGES = {
  'This week': {
    completed: 128,
    onTime: 94,
    cycle: 19,
    bars: [18, 24, 16, 30, 26, 9, 5],
    done: 78,
  },
  'Last week': {
    completed: 112,
    onTime: 89,
    cycle: 23,
    bars: [14, 20, 22, 25, 19, 7, 5],
    done: 71,
  },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Stat = ({ icon: Icon, label, value, suffix, start }) => {
  const n = useCountUp(value, { start });
  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
        <Icon className="size-3.5 text-emerald-600" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 tabular-nums">
        {n}
        {suffix}
      </p>
    </div>
  );
};

const Ring = ({ percent, start }) => {
  const r = 38;
  const c = 2 * Math.PI * r;
  const n = useCountUp(percent, { start });

  return (
    <div className="relative grid size-32 place-items-center">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f4f4f5" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={start ? c * (1 - percent / 100) : c}
          className="transition-[stroke-dashoffset] duration-[1400ms] ease-out-expo motion-reduce:transition-none"
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">{n}%</p>
        <p className="text-[10px] text-zinc-500">sprint done</p>
      </div>
    </div>
  );
};

const ReportsMockup = () => {
  const [range, setRange] = useState('This week');
  const [ref, inView] = useInView();
  const data = RANGES[range];
  const max = Math.max(...data.bars);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_30px_70px_-24px_rgba(15,23,42,0.22)] sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Team performance</p>
          <p className="text-[11px] text-zinc-500">Website Redesign · Sprint 14</p>
        </div>
        <div
          role="radiogroup"
          aria-label="Date range"
          className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
        >
          {Object.keys(RANGES).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={range === r}
              onClick={() => setRange(r)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition ${
                range === r
                  ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* key forces counters to re-run when the range changes */}
      <div key={range} className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon={CircleCheck} label="Completed" value={data.completed} start={inView} />
        <Stat icon={Target} label="On time" value={data.onTime} suffix="%" start={inView} />
        <Stat icon={Timer} label="Cycle time" value={data.cycle} suffix="h" start={inView} />
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="rounded-xl border border-zinc-200 p-3">
          <p className="flex items-center justify-between text-[11px] text-zinc-500">
            Tasks completed per day
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <TrendingUp className="size-3" aria-hidden="true" />
              {range === 'This week' ? '+14%' : '+6%'}
            </span>
          </p>
          <div
            className="mt-3 flex h-28 items-end gap-2"
            role="img"
            aria-label={`Tasks completed per day: ${data.bars.join(', ')}`}
          >
            {data.bars.map((v, i) => (
              <div
                key={DAYS[i]}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <div
                  title={`${v} tasks`}
                  style={{
                    height: inView ? `${(v / max) * 100}%` : '0%',
                    transitionDelay: `${i * 70}ms`,
                  }}
                  className={`w-full rounded-t-md transition-[height] duration-700 ease-out-expo motion-reduce:transition-none ${
                    v === max
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                      : 'bg-emerald-100 hover:bg-emerald-200'
                  }`}
                />
                <span className="text-[9px] text-zinc-400">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Ring key={range} percent={data.done} start={inView} />
        </div>
      </div>
    </div>
  );
};

export default ReportsMockup;
