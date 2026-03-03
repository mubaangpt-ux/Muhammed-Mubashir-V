import { useEffect, useRef, useState } from "react";

import { creativeWorkAssets, type Company } from "./data";

interface Props {
  company: Company;
  isExpanded: boolean;
  onToggle: () => void;
  delay: number;
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
      className={`group relative overflow-hidden rounded-[24px] border shadow-[0_28px_70px_rgba(0,0,0,0.45)] transition-[opacity,transform,border-color,box-shadow] duration-[600ms,600ms,300ms,300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExpanded
          ? "border-[#2563eb]/65 shadow-[0_28px_80px_rgba(37,99,235,0.16)]"
          : "border-white/10 hover:-translate-y-1 hover:border-white/15"
      }`}
      style={{
        background: company.color,
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
      }}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={creativeWorkAssets.cover(company)}
          alt={company.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 40%, ${company.color} 100%)`,
          }}
        />
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-[#0d1117]/86 p-6 backdrop-blur-xl">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            {company.name}
          </h3>
          <span className="font-mono text-sm text-white/50">
            {company.deliverables.length} items
          </span>
        </div>

        <p className="mb-4 font-mono text-sm text-white/50">{company.industry}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-300 ${
            isExpanded ? "bg-blue-600 text-white" : "bg-white text-gray-900 hover:bg-blue-50"
          }`}
        >
          {isExpanded ? "Close X" : "See More ->"}
        </button>
      </div>
    </div>
  );
}
