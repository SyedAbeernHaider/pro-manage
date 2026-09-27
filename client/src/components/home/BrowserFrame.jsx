import { Lock } from 'lucide-react';

/** macOS-style window chrome for product mockups. */
const BrowserFrame = ({ url = 'app.kanbrix.com', children, className = '' }) => (
  <div
    className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),0_30px_70px_-20px_rgba(15,23,42,0.18)] ${className}`}
  >
    <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>

      <div className="mx-auto flex max-w-xs min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500">
        <Lock className="size-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{url}</span>
      </div>

      <div className="w-[52px]" aria-hidden="true" />
    </div>

    {children}
  </div>
);

export default BrowserFrame;
