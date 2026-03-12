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
      { threshold: 0.15, rootMargin: "0px 0px -64px 0px" }
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative h-[396px] w-full overflow-hidden rounded-[30px] border transition-[opacity,transform,border-color,box-shadow] duration-[650ms,650ms,300ms,300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExpanded
          ? "border-[#93c5fd]/30 shadow-[0_30px_80px_rgba(2,8,23,0.55),0_0_0_1px_rgba(147,197,253,0.12)]"
          : "border-white/10 shadow-[0_26px_65px_rgba(2,8,23,0.48)] hover:-translate-y-1.5 hover:border-white/14 hover:shadow-[0_34px_85px_rgba(2,8,23,0.58),0_0_0_1px_rgba(147,197,253,0.08)]"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        background: `
          linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%),
          radial-gradient(circle at top, ${company.color}18 0%, transparent 42%),
          linear-gradient(180deg, rgba(12,18,32,0.52) 0%, rgba(7,9,15,0.68) 100%)
        `,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
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
            linear-gradient(180deg, rgba(7,9,15,0.01) 0%, rgba(7,9,15,0.03) 24%, rgba(7,9,15,0.10) 56%, rgba(7,9,15,0.24) 100%),
            radial-gradient(circle at 50% 16%, rgba(255,255,255,0.10) 0%, transparent 36%),
            linear-gradient(180deg, transparent 0%, rgba(7,9,15,0.04) 66%, rgba(7,9,15,0.16) 100%)
          `,
        }}
      />

      <div className="pointer-events-none absolute inset-[7px] rounded-[24px] border border-white/10 bg-white/[0.01] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-18px_40px_rgba(7,9,15,0.08)]" />
      <div className="pointer-events-none absolute inset-[2px] rounded-[28px] border border-white/6 opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/12 via-white/[0.03] to-transparent opacity-75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/8 via-black/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="absolute right-3.5 top-3.5">
        <span
          className="inline-flex rounded-full px-3 py-1.5 font-mono text-[10px] text-white/78"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {company.deliverables.length} Deliverables
        </span>
      </div>

      <div className="absolute inset-x-0 top-[31%] flex justify-center">
        <div className="flex gap-1.5 rounded-full border border-white/8 bg-[rgba(255,255,255,0.06)] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`block h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-white/95" : "bg-white/35"}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3 top-[33%]">
        <div className="relative flex h-full flex-col justify-end">
          <div
            className="relative overflow-hidden rounded-[22px] border px-3 py-2.5 shadow-[0_18px_40px_rgba(2,8,23,0.16)]"
            style={{
              background: "rgba(7,9,15,0.40)",
              borderColor: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(18px) saturate(112%)",
              WebkitBackdropFilter: "blur(18px) saturate(112%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -10px 20px rgba(255,255,255,0.02), 0 18px 40px rgba(2,8,23,0.14)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%,rgba(255,255,255,0.015)_100%)]" />
            <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />

            <div className="relative mb-2">
              <h3
                className="max-w-[10ch] text-[1.5rem] font-semibold leading-none text-white [text-shadow:0_3px_18px_rgba(2,6,23,0.85)]"
                style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "-0.04em" }}
              >
                {company.name}
              </h3>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.26em] text-white/82 [text-shadow:0_2px_14px_rgba(2,6,23,0.75)]">
                {company.industry}
              </p>
            </div>

            <p className="relative mb-2 max-w-[24ch] text-[0.8rem] leading-[1.32] text-white/92 [text-shadow:0_3px_18px_rgba(2,6,23,0.85)]">
              {getCardSummary(company)}
            </p>

            <div className="relative mb-2 flex flex-nowrap items-center gap-1 overflow-visible">
              {company.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 rounded-full px-2 py-1 font-mono text-[8px] whitespace-nowrap text-white/92 [text-shadow:0_1px_10px_rgba(2,6,23,0.55)]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(14px) brightness(1.02)",
                    WebkitBackdropFilter: "blur(14px) brightness(1.02)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggle}
              className={`relative inline-flex min-w-[106px] items-center justify-center self-start rounded-full border px-3 py-1.5 text-[0.82rem] font-semibold text-white transition-all duration-300 ${
                isExpanded
                  ? "border-[#93c5fd]/35 bg-[#2563eb]/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_28px_rgba(37,99,235,0.18)]"
                  : "border-white/18 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_30px_rgba(2,8,23,0.18)] hover:bg-white/14"
              }`}
              style={{
                backdropFilter: "blur(18px) saturate(110%)",
                WebkitBackdropFilter: "blur(18px) saturate(110%)",
              }}
            >
              {isExpanded ? "Close" : "See More"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
