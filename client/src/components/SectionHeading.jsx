export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p>}
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-lg text-slate-300">{description}</p>}
    </div>
  );
}
