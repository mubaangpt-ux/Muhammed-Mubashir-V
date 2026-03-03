import { useEffect, useRef, useState } from "react";

import { creativeWorkAssets, type Company } from "./data";

interface Props {
  company: Company;
  isExpanded: boolean;
  onToggle: () => void;
  delay: number;
}

function getCardSummary(company: Company) {
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
      { threshold: 0.15, rootMargin: "0px 0px -64px 0px" }
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative mx-auto h-[440px] w-full max-w-[340px] overflow-hidden rounded-[34px] border transition-[opacity,transform,border-color,box-shadow] duration-[650ms,650ms,300ms,300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExpanded
          ? "border-[#93c5fd]/45 shadow-[0_32px_85px_rgba(37,99,235,0.22)]"
          : "border-white/12 shadow-[0_26px_65px_rgba(0,0,0,0.42)] hover:-translate-y-1.5 hover:border-white/18 hover:shadow-[0_34px_85px_rgba(0,0,0,0.5)]"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        background: `linear-gradient(180deg, ${company.color} 0%, rgba(13,17,23,0.96) 100%)`,
      }}
    >
      <img
        src={creativeWorkAssets.cover(company)}
        alt={company.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        loading="lazy"
      />

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(7,9,15,0.02) 0%, rgba(7,9,15,0.10) 24%, rgba(7,9,15,0.42) 58%, rgba(7,9,15,0.92) 100%),
            radial-gradient(circle at 50% 18%, rgba(255,255,255,0.18) 0%, transparent 38%),
            linear-gradient(180deg, transparent 0%, ${company.color}66 100%)
          `,
        }}
      />

      <div className="pointer-events-none absolute inset-[10px] rounded-[28px] border border-white/10 bg-white/[0.02]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 via-white/[0.03] to-transparent opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/28 via-black/8 to-transparent" />

      <div className="absolute right-4 top-4">
        <span className="inline-flex rounded-full border border-white/12 bg-black/35 px-3 py-1.5 font-mono text-[11px] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
          {company.deliverables.length} Deliverables
        </span>
      </div>

      <div className="absolute inset-x-0 top-[49%] flex justify-center">
        <div className="flex gap-1.5 rounded-full border border-white/8 bg-black/18 px-3 py-1.5 backdrop-blur-md">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`block h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-white/95" : "bg-white/35"}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-4">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h3
                className="text-[1.85rem] font-semibold leading-none text-white"
                style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "-0.04em" }}
              >
                {company.name}
              </h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
                {company.industry}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/12 bg-black/35 px-3 py-1.5 font-mono text-[11px] text-white/80 backdrop-blur-md">
              Studio
            </span>
          </div>

          <p className="mb-4 max-w-[26ch] text-sm leading-relaxed text-white/58">
            {getCardSummary(company)}
          </p>

          <div className="mb-5 flex flex-wrap gap-2">
            {company.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/28 px-3 py-1.5 font-mono text-[11px] text-white/80 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
              isExpanded
                ? "bg-[#2563eb] text-white shadow-[0_10px_26px_rgba(37,99,235,0.34)]"
                : "bg-white text-[#07090f] shadow-[0_12px_26px_rgba(255,255,255,0.16)] hover:bg-[#eef4ff]"
            }`}
          >
            {isExpanded ? "Close X" : "See More"}
          </button>
        </div>
      </div>
    </div>
  );
}
