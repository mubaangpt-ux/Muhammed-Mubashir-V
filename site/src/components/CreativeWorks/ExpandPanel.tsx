import { useEffect, useRef, useState, useCallback } from "react";

import { tabLabels, type Company, type Tab } from "./data";
import BusinessCardsTab from "./tabs/BusinessCardsTab";
import LogoTab from "./tabs/LogoTab";
import PostersTab from "./tabs/PostersTab";
import ProfileTab from "./tabs/ProfileTab";
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
  const innerRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(company.deliverables[0]);
  const [displayTab, setDisplayTab] = useState<Tab>(company.deliverables[0]);
  const [contentVisible, setContentVisible] = useState(true);
  const switchingRef = useRef(false);

  // Reset tabs on company change
  useEffect(() => {
    const firstTab = company.deliverables[0];
    setActiveTab(firstTab);
    setDisplayTab(firstTab);
    setContentVisible(true);
  }, [company.id]);

  // Ultra-fast tab fade (80ms) — only opacity, zero layout cost
  useEffect(() => {
    if (activeTab === displayTab || switchingRef.current) return;
    switchingRef.current = true;
    setContentVisible(false);
    const t = window.setTimeout(() => {
      setDisplayTab(activeTab);
      requestAnimationFrame(() => {
        setContentVisible(true);
        switchingRef.current = false;
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [activeTab, displayTab]);

  // Animate open/close using CSS class toggling (GPU transform only, no max-height)
  // The panel is always mounted; we just show/hide with transform + opacity
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (open) {
      // Ensure display first, then animate in next frame
      wrap.style.display = "block";
      requestAnimationFrame(() => {
        wrap.setAttribute("data-open", "true");
      });
    } else {
      wrap.setAttribute("data-open", "false");
      // After transition ends, hide it and call onExited
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "opacity") return;
        wrap.style.display = "none";
        onExited();
        wrap.removeEventListener("transitionend", onEnd);
      };
      wrap.addEventListener("transitionend", onEnd);
      return () => wrap.removeEventListener("transitionend", onEnd);
    }
  }, [open, onExited]);

  function renderTab() {
    switch (displayTab) {
      case "posters": return <PostersTab company={company} />;
      case "reels":   return <ReelsTab company={company} />;
      case "logo":    return <LogoTab company={company} />;
      case "website": return <WebsiteTab company={company} />;
      case "webapp":  return <WebAppTab company={company} />;
      case "profile": return <ProfileTab company={company} />;
      case "businesscards": return <BusinessCardsTab company={company} />;
      default: return null;
    }
  }

  return (
    /**
     * Outer wrapper: controls the height via auto (no max-height animation).
     * Visibility is GPU-composited: only opacity + translateY.
     * data-open attribute drives CSS transitions declared inline.
     */
    <div
      ref={wrapRef}
      data-open="false"
      style={{
        display: "none",
        willChange: "transform, opacity",
        // CSS transition only on transform + opacity — composited, zero layout
        transition: "opacity 220ms cubic-bezier(0.4,0,0.2,1), transform 220ms cubic-bezier(0.4,0,0.2,1)",
      }}
      className="mt-3"
    >
      <style>{`
        [data-open="false"] { opacity: 0; transform: translateY(-10px) scale(0.99); pointer-events: none; }
        [data-open="true"]  { opacity: 1; transform: translateY(0)       scale(1);    pointer-events: auto; }
      `}</style>

      <div
        className="overflow-hidden rounded-[32px] border border-white/[0.08]"
        style={{
          background: "rgba(13, 15, 22, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div ref={innerRef}>
          {/* Drag handle */}
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/15" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 md:px-8">
            <div>
              <h3 className="text-[1.6rem] font-bold leading-none text-white tracking-tight">
                {company.name}
              </h3>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-blue-400 font-semibold">
                {company.industry}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/70 transition-colors duration-150 hover:bg-white/15 active:scale-90"
              aria-label={`Close ${company.name}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* iOS-style pill tabs — no scale animation, just color swap (zero layout) */}
          <div
            className="flex gap-1.5 overflow-x-auto px-6 pb-3 md:px-8"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {company.deliverables.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "bg-white/8 text-white/50 hover:text-white/80 hover:bg-white/12"
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className="mx-6 mb-0 h-px bg-white/[0.05] md:mx-8" />

          {/* Tab content — opacity only, no transform (avoids layout jank) */}
          <div
            className="px-6 pt-5 pb-7 md:px-8"
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: "opacity 80ms linear",
            }}
          >
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
