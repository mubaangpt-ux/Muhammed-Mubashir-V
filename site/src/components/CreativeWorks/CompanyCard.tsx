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
    /**
     * PERFORMANCE STRATEGY:
     * - Entrance: only opacity + translateY (GPU-composited, zero layout cost)
     * - All glass/blur effects are STATIC — they're computed once and never
     *   re-painted per animation frame. Safe to use heavy blur here.
     * - Hover: only scale on the <img> (GPU composited via `will-change`)
     * - No animated `box-shadow`, `border-color`, or `backdrop-filter` values
     * - will-change on card for the card entrance only removed after visible
     */
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        // Entrance animation — GPU composited
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "520ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        // Rich glassmorphism — STATIC, never animated. Zero per-frame GPU cost.
        background: `
          radial-gradient(ellipse at 30% 0%, ${company.color}35 0%, transparent 60%),
          linear-gradient(180deg, rgba(18,20,30,0.48) 0%, rgba(8,10,18,0.70) 100%)
        `,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      // cw-card class handles hover — pure CSS, zero JS re-render, GPU translateY
      className="cw-card group relative h-[400px] w-full overflow-hidden rounded-[28px]"
    >
      {/* Image — ONLY this element animates (scale on hover). will-change pre-allocates a compositor layer */}
      <img
        src={creativeWorkAssets.cover(company)}
        alt={company.name}
        loading="lazy"
        style={{ willChange: "transform" }}
        className="absolute inset-0 h-full w-full object-cover opacity-55 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-75"
      />

      {/* Static gradient overlays — never animated, zero per-frame cost */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/92" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${company.color}18 0%, transparent 50%)`,
        }}
      />

      {/* Inner glass bevel */}
      <div className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/[0.06]" />
      {/* Top highlight sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent" />

      {/* Badge */}
      <div className="absolute right-3.5 top-3.5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/85"
          style={{
            background: "rgba(0,0,0,0.42)",
            border: "1px solid rgba(255,255,255,0.13)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          {company.deliverables.length} items
        </span>
      </div>

      {/* Content glass panel — static blur, never animated */}
      <div className="absolute inset-x-3 bottom-3">
        <div
          className="relative overflow-hidden rounded-[22px] px-4 py-4"
          style={{
            background: "rgba(8,10,20,0.52)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {/* Top glare */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          <h3
            className="mb-0.5 text-[1.55rem] font-bold leading-none text-white tracking-tight"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
          >
            {company.name}
          </h3>
          <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-blue-400 font-semibold">
            {company.industry}
          </p>

          <p className="mb-3 max-w-[28ch] text-[0.82rem] leading-snug text-slate-300/90 line-clamp-2">
            {getCardSummary(company)}
          </p>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {company.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-[8px] px-2.5 py-1 text-[10px] font-medium text-slate-200/85"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA — transition-colors only: zero layout, zero repaint */}
          <button
            type="button"
            onClick={onToggle}
            className="w-full rounded-[14px] py-2.5 text-[0.875rem] font-semibold tracking-wide transition-colors duration-200"
            style={{
              background: isExpanded
                ? "rgba(255,255,255,1)"
                : `linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)`,
              color: isExpanded ? "#000" : "#fff",
              boxShadow: isExpanded
                ? "none"
                : "0 6px 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
            }}
          >
            {isExpanded ? "Close" : "View Work"}
          </button>
        </div>
      </div>
    </div>
  );
}
