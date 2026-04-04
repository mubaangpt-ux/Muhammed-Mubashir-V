import { useEffect, useRef, useState } from "react";

import { tabLabels, type Company, type Tab } from "./data";
import BusinessCardsTab from "./tabs/BusinessCardsTab";
import DocumentTab from "./tabs/DocumentTab";
import LogoTab from "./tabs/LogoTab";
import PostersTab from "./tabs/PostersTab";
import ReelsTab from "./tabs/ReelsTab";
import WebAppTab from "./tabs/WebAppTab";
import WebsiteTab from "./tabs/WebsiteTab";

interface Props {
  company: Company;
  onClose: () => void;
  open: boolean;
  onExited: () => void;
}

export default function ExpandPanel({ company, onClose, open, onExited }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(company.deliverables[0]);
  const [displayTab, setDisplayTab] = useState<Tab>(company.deliverables[0]);
  const [contentVisible, setContentVisible] = useState(true);
  const switchRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Reset on company change
  useEffect(() => {
    const first = company.deliverables[0];
    setActiveTab(first);
    setDisplayTab(first);
    setContentVisible(true);
  }, [company.id]);

  // Ultra-fast tab swap — opacity only, zero layout
  useEffect(() => {
    if (activeTab === displayTab || switchRef.current) return;
    switchRef.current = true;
    setContentVisible(false);
    const t = window.setTimeout(() => {
      setDisplayTab(activeTab);
      requestAnimationFrame(() => {
        setContentVisible(true);
        switchRef.current = false;
      });
    }, 90);
    return () => window.clearTimeout(t);
  }, [activeTab, displayTab]);

  // Fire onExited after close animation ends (grid-template-rows transition)
  useEffect(() => {
    if (open || !gridRef.current) return;
    const node = gridRef.current;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === "grid-template-rows") onExited();
    };
    node.addEventListener("transitionend", onEnd);
    return () => node.removeEventListener("transitionend", onEnd);
  }, [open, onExited]);

  function renderTab() {
    switch (displayTab) {
      case "posters":      return <PostersTab company={company} />;
      case "reels":        return <ReelsTab company={company} />;
      case "logo":         return <LogoTab company={company} />;
      case "website":      return <WebsiteTab company={company} />;
      case "webapp":       return <WebAppTab company={company} />;
      case "profile":      return <DocumentTab company={company} kind="profile" />;
      case "brandidentity": return <DocumentTab company={company} kind="brandidentity" />;
      case "businesscards": return <BusinessCardsTab company={company} />;
      default:             return null;
    }
  }

  return (
    /**
     * PERFORMANCE STRATEGY:
     * The expansion uses CSS `grid-template-rows: 0fr → 1fr` — this is a
     * modern composited-friendly height animation that avoids `max-height`
     * layout recalculations entirely. The opacity + translateY entrance is
     * GPU-composited via `will-change: transform`. The heavy `backdrop-filter`
     * blur is on a STATIC element (not being animated), so it costs nothing
     * per frame — it's only computed once when the DOM is painted.
     */
    <div
      ref={gridRef}
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 360ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="mt-3"
    >
      {/* min-height: 0 is required for grid-template-rows trick to work */}
      <div style={{ minHeight: 0, overflow: "hidden" }}>
        {/* 
          Inner visual panel: entrance/exit uses only opacity + translateY
          (GPU composited). The blur itself is static — no animation of blur. 
        */}
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-12px)",
            transition: "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform, opacity",
            // Rich glassmorphism — STATIC, zero per-frame cost
            background: `linear-gradient(135deg, ${company.color}22 0%, rgba(8,10,18,0.72) 100%)`,
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09)",
            borderRadius: "32px",
          }}
        >
          {/* Drag handle */}
          <div className="mx-auto mb-0 flex justify-center pt-3">
            <div className="h-[5px] w-12 rounded-full bg-white/20" />
          </div>

          {/* Top glare line */}
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-5 md:px-10">
            <div>
              <h3
                className="text-[1.85rem] font-bold leading-none text-white tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
              >
                {company.name}
              </h3>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#60a5fa] font-semibold">
                {company.industry}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors duration-150 hover:text-white active:scale-90"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              aria-label={`Close ${company.name}`}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1L12 12M1 12L12 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* iOS pill-tabs — color swap only, zero layout cost */}
          <div
            className="flex gap-2 overflow-x-auto px-7 pb-4 md:px-10"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {company.deliverables.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors duration-150"
                style={{
                  background: activeTab === tab ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.07)",
                  color: activeTab === tab ? "#000" : "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className="mx-7 h-px bg-white/[0.05] md:mx-10" />

          {/* Tab content — opacity-only fade, zero layout */}
          <div
            className="px-7 pt-6 pb-8 md:px-10"
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: "opacity 90ms linear",
            }}
          >
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
