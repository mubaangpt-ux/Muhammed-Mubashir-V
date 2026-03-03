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
      className={`group relative mx-auto h-[440px] w-full max-w-[340px] overflow-hidden rounded-[36px] border transition-[opacity,transform,border-color,box-shadow] duration-[650ms,650ms,300ms,300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

      <div className="pointer-events-none absolute inset-[10px] rounded-[30px] border border-white/10 bg-white/[0.01] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-18px_40px_rgba(7,9,15,0.08)]" />
      <div className="pointer-events-none absolute inset-[2px] rounded-[34px] border border-white/6 opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/12 via-white/[0.03] to-transparent opacity-75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/8 via-black/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="absolute right-4 top-4">
        <span
          className="inline-flex rounded-full px-3 py-1.5 font-mono text-[11px] text-white/78"
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

      <div className="absolute inset-x-0 top-[49%] flex justify-center">
        <div className="flex gap-1.5 rounded-full border border-white/8 bg-[rgba(255,255,255,0.06)] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`block h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-white/95" : "bg-white/35"}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-6 top-[56%]">
        <div className="pointer-events-none absolute inset-x-[-22px] inset-y-[-18px] rounded-[42px] bg-[radial-gradient(circle_at_center,rgba(7,9,15,0.58),rgba(7,9,15,0.30)_48%,transparent_82%)] blur-2xl" />
        <div
          className="pointer-events-none absolute inset-x-[-14px] inset-y-[-8px] rounded-[38px]"
          style={{
            backdropFilter: "blur(18px) brightness(0.92)",
            WebkitBackdropFilter: "blur(18px) brightness(0.92)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.86) 22%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.92) 100%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.86) 22%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-end">
          <div className="mb-3">
            <h3
              className="max-w-[10ch] text-[1.7rem] font-semibold leading-none text-white"
              style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "-0.04em" }}
            >
              {company.name}
            </h3>
            <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.26em] text-white/62">
              {company.industry}
            </p>
          </div>

          <p className="mb-4 max-w-[24ch] text-[0.95rem] leading-[1.55] text-white/78 [text-shadow:0_2px_18px_rgba(2,6,23,0.55)]">
            {getCardSummary(company)}
          </p>

          <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-hidden">
            {company.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-white/82"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(14px) brightness(1.04)",
                  WebkitBackdropFilter: "blur(14px) brightness(1.04)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex min-w-[124px] items-center justify-center self-start rounded-full border px-4 py-2 text-[0.95rem] font-semibold text-white transition-all duration-300 ${
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
  );
}
