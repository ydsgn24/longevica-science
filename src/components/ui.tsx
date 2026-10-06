export const Arrow = () => <span aria-hidden>→</span>;

export const InstagramIcon = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href={import.meta.env.BASE_URL} className={`inline-block leading-none ${className}`}>
      <span className="block text-[26px] font-normal tracking-[0.02em] md:text-[30px]">LONGEVICA</span>
      <span className="mt-1 block text-[13px] tracking-[0.42em] opacity-80">SCIENCE</span>
    </a>
  );
}

export function SectionLabel({ label }: { label: string }) {
  return <p className="label flex text-muted">{label}</p>;
}

export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </>
  );
}
