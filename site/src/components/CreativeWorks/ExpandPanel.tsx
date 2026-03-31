import { useEffect, useRef, useState } from "react";
import type { TransitionEvent } from "react";

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
  const [maxHeight, setMaxHeight] = useState("0px");
  const [activeTab, setActiveTab] = useState<Tab>(company.deliverables[0]);
  const [displayTab, setDisplayTab] = useState<Tab>(company.deliverables[0]);
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    const firstTab = company.deliverables[0];
    setActiveTab(firstTab);
    setDisplayTab(firstTab);
    setContentVisible(true);
  }, [company.id, company.deliverables]);

  useEffect(() => {
    if (activeTab === displayTab) {
      setContentVisible(true);
      return;
    }

    setContentVisible(false);
    const timeoutId = window.setTimeout(() => {
      setDisplayTab(activeTab);
      requestAnimationFrame(() => setContentVisible(true));
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [activeTab, displayTab]);

  useEffect(() => {
    const node = innerRef.current;
    if (!node) return;

    const syncHeight = () => {
      setMaxHeight(open ? `${node.scrollHeight}px` : "0px");
    };

    syncHeight();

    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => {
      if (open) {
        setMaxHeight(`${node.scrollHeight}px`);
      }
    });
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [company.id, displayTab, open]);

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "max-height") return;
    if (!open) onExited();
  }

  function renderTab() {
    switch (displayTab) {
      case "posters":
        return <PostersTab company={company} />;
      case "reels":
        return <ReelsTab company={company} />;
      case "logo":
        return <LogoTab company={company} />;
      case "website":
        return <WebsiteTab company={company} />;
      case "webapp":
        return <WebAppTab company={company} />;
      case "profile":
        return <ProfileTab company={company} />;
      case "businesscards":
        return <BusinessCardsTab company={company} />;
      default:
        return null;
    }
  }

  return (
    <div
      className={`mt-4 overflow-hidden rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[max-height,opacity,transform] duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-[max-height,transform] ${
        open ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-[0.96]"
      }`}
      style={{ 
        maxHeight,
        background: `radial-gradient(circle at top, ${company.color}20 0%, transparent 60%), rgba(10, 12, 18, 0.65)`,
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)"
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={innerRef} className="relative">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-[5px] rounded-full bg-white/20" />
        
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 pt-10 pb-6 md:px-10 md:pt-10">
          <div>
            <h3
              className="text-[2rem] font-bold text-white tracking-tight leading-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {company.name}
            </h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-[#3b82f6] font-semibold">
              {company.industry}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
            aria-label={`Close ${company.name} panel`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Modern iOS Segmented Control Header */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/[0.04] px-6 py-4 md:px-10 scrollbar-hide">
          {company.deliverables.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-black shadow-md scale-100"
                  : "bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 scale-95"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div
          className={`px-6 py-8 md:p-10 transition-all duration-300 transform ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
