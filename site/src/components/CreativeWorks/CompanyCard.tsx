import { useEffect, useRef, useState } from "react";
import { creativeWorkAssets, type Company } from "./data";

interface Props {
  company: Company;
  isExpanded: boolean;
  onToggle: () => void;
  delay: number;
}

function getCardSummary(company: Company) {
  if (company.description) return company.description;
  const [first = "creative systems", second = "digital design"] = company.tags;
  return `${company.industry} brand work shaped through ${first.toLowerCase()} and ${second.toLowerCase()}.`;
}

export default function CompanyCard({ company, isExpanded, onToggle, delay }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    const node = ref.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      /**
       * Performance rules:
       * 1. Only animate `transform` and `opacity` — both are GPU-composited.
       * 2. No box-shadow animation (triggers repaint). Static shadow only.
       * 3. Minimal blur (8px) to avoid GPU overload on mobile.
       * 4. `will-change: transform` pre-allocates a compositing layer.
       */
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "500ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        willChange: "transform",
        background: `radial-gradient(ellipse at top left, ${company.color}30 0%, transparent 65%), rgba(12, 14, 20, 0.55)`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      className="group relative h-[400px] w-full overflow-hidden rounded-[28px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
    >
      {/* Cover image — GPU-composited scale only */}
      <img
        src={creativeWorkAssets.cover(company)}
        alt={company.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-50 transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-70"
        style={{ willChange: "transform" }}
      />

      {/* Dark gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90" />

      {/* Inner glass border */}
      <div className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/[0.07]" />

      {/* Top badge */}
      <div className="absolute right-3.5 top-3.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-white/80"
          style={{
            background: "rgba(0,0,0,0.38)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          {company.deliverables.length} items
        </span>
      </div>

      {/* Bottom card info */}
      <div className="absolute inset-x-3 bottom-3">
        <div
          className="rounded-[22px] p-4"
          style={{
            background: "rgba(10,12,20,0.50)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top glare */}
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <h3 className="mb-0.5 text-[1.5rem] font-bold leading-none text-white tracking-tight">
            {company.name}
          </h3>
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-blue-400 font-semibold">
            {company.industry}
          </p>

          <p className="mb-3 text-[0.8rem] leading-snug text-slate-300 line-clamp-2">
            {getCardSummary(company)}
          </p>

          <div className="mb-3 flex flex-wrap gap-1">
            {company.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 text-[10px] font-medium text-slate-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Button — color only transition (no layout change) */}
          <button
            type="button"
            onClick={onToggle}
            className={`w-full rounded-xl py-2.5 text-[0.875rem] font-semibold transition-colors duration-150 ${
              isExpanded
                ? "bg-white text-black"
                : "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700"
            }`}
          >
            {isExpanded ? "Close" : "View Work"}
          </button>
        </div>
      </div>
    </div>
  );
}
