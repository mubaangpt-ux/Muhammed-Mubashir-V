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
  const [firstTag = "creative systems", secondTag = "digital design"] = company.tags;
  return `${company.industry} brand work shaped through ${firstTag.toLowerCase()} and ${secondTag.toLowerCase()}.`;
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative h-[420px] w-full overflow-hidden rounded-[36px] transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isExpanded
          ? "border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.6)] scale-[0.98] z-10 ring-4 ring-[#2563eb]/20"
          : "border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] z-0"
      }`}
      style={{
        transitionDelay: visible ? `${delay}ms` : '0ms',
        opacity: visible ? 1 : 0,
        transform: visible ? (isExpanded ? "scale(0.98)" : "translateY(0) scale(1)") : "translateY(40px) scale(0.96)",
        background: `radial-gradient(ellipse at top left, ${company.color}40 0%, transparent 70%), rgba(15, 17, 26, 0.4)`,
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      {/* Background Image Layer with iOS scaling effect */}
      <img
        src={creativeWorkAssets.cover(company)}
        alt={company.name}
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.08] group-hover:opacity-80"
        loading="lazy"
      />

      {/* Modern iOS Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#030303]/95" />
      
      {/* Glass Inner Border */}
      <div className="pointer-events-none absolute inset-[1px] rounded-[35px] border border-white/10" />

      {/* Top Deliverables Pill */}
      <div className="absolute right-4 top-4">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-white/10"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          {company.deliverables.length} Items
        </span>
      </div>

      {/* Content Area */}
      <div className="absolute inset-x-4 bottom-4 top-[40%]">
        <div className="relative flex h-full flex-col justify-end">
          <div
            className="group/panel relative overflow-hidden rounded-[28px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.08]"
            style={{
              background: "rgba(20,20,30,0.45)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(24px) saturate(140%)",
              WebkitBackdropFilter: "blur(24px) saturate(140%)",
            }}
          >
            {/* Top decorative glare */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
            
            <div className="mb-2">
              <h3
                className="text-[1.65rem] font-bold leading-none text-white tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {company.name}
              </h3>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-400/90 font-semibold">
                {company.industry}
              </p>
            </div>

            <p className="mb-4 max-w-[28ch] text-[0.85rem] leading-relaxed text-slate-300 line-clamp-2">
              {getCardSummary(company)}
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {company.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium text-slate-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggle}
              className={`w-full relative flex items-center justify-center rounded-2xl py-3 text-[0.9rem] font-semibold transition-all duration-400 overflow-hidden ${
                isExpanded
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[0.98]"
                  : "bg-[#2563eb]/90 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-[#3b82f6] hover:-translate-y-0.5"
              }`}
            >
              {isExpanded ? "Close Project" : "View Project Details"}
              {!isExpanded && (
                <svg className="w-4 h-4 ml-2 transition-transform group-hover/panel:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
