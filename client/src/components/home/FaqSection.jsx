import { useId, useState } from 'react';
import { Mail, Plus } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

const FAQS = [
  {
    q: 'Can we give clients or external stakeholders access?',
    a: 'Yes. Invite them with the Viewer role and add them only to the projects they should see. Viewers get a read-only board and dashboard — they can’t create, edit or comment, and that’s enforced by the API, not just hidden in the UI.',
  },
  {
    q: 'How is our data kept separate from other companies?',
    a: 'Kanbrix is multi-tenant with isolation at the query level: every read and write is scoped to your workspace, and cross-workspace access attempts are denied and recorded in the audit log as security events.',
  },
  {
    q: 'Can we export our data?',
    a: 'You own your data. Business workspaces can export the full immutable audit log as CSV, and self-serve export of projects and tasks is on our roadmap. Until then, our team can prepare an export for you on request.',
  },
  {
    q: 'How does upgrading from the Free plan work?',
    a: 'Every workspace starts on Free with no time limit. Upgrade whenever you need more projects, seats or storage — new limits apply immediately with no migration. You can downgrade later as long as your usage fits the smaller plan.',
  },
  {
    q: 'Can we self-host Kanbrix?',
    a: 'Not today. Kanbrix is a fully managed cloud service, so you get updates, backups and scaling without running servers. If on-premise deployment is a hard requirement for your team, contact us — it helps us prioritise.',
  },
];

const FaqItem = ({ item, open, onToggle }) => {
  const id = useId();

  return (
    <div
      className={`rounded-2xl border transition-colors duration-300 ${open ? 'border-emerald-200 bg-white shadow-[0_12px_30px_-18px_rgba(5,150,105,0.35)]' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
    >
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 rounded-2xl px-5 py-5 text-left text-[15px] font-semibold text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:px-6"
        >
          {item.q}
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full transition duration-300 ${
              open ? 'rotate-45 bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-600'
            }`}
            aria-hidden="true"
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-400 ease-out-expo motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="px-5 pb-5 text-[15px] leading-relaxed text-zinc-600 sm:px-6">{item.a}</p>
        </div>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-24 bg-zinc-50/70 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="faq-title"
            align="left"
            eyebrow="FAQ"
            title="Questions, answered."
            description="Everything teams usually ask before moving their work to Kanbrix."
          />

          <Reveal delay={100} className="mt-8">
            <a
              href="mailto:support@kanbrix.app"
              className="group inline-flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 pr-5 transition hover:border-emerald-200 hover:shadow-[0_12px_30px_-18px_rgba(5,150,105,0.35)]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-zinc-900">
                  Still have questions?
                </span>
                <span className="block text-[13px] text-zinc-500">support@kanbrix.app</span>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={80} className="space-y-3">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default FaqSection;
