import Reveal from './Reveal';

const SectionHeader = ({ eyebrow, title, description, align = 'center', id }) => {
  const centered = align === 'center';

  return (
    <Reveal className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          {eyebrow}
        </p>
      )}

      <h2
        id={id}
        className="text-3xl font-bold tracking-[-0.035em] text-balance text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-[1.1]"
      >
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
};

export default SectionHeader;
