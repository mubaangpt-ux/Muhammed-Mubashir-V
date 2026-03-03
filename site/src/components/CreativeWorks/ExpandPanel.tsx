import { useEffect, useRef, useState } from "react";
import type { TransitionEvent } from "react";

import { tabLabels, type Company, type Tab } from "./data";
import BusinessCardsTab from "./tabs/BusinessCardsTab";
import LogoTab from "./tabs/LogoTab";
import PostersTab from "./tabs/PostersTab";
import ProfileTab from "./tabs/ProfileTab";
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
    }, 110);

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
      className={`mt-4 overflow-hidden rounded-3xl border-t-2 border-blue-600 bg-[#0d1117] shadow-[0_30px_90px_rgba(0,0,0,0.55)] transition-[max-height,opacity,transform] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      style={{ maxHeight }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={innerRef}>
        <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
          <div>
            <h3
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {company.name}
            </h3>
            <p className="mt-1 font-mono text-sm text-white/40">{company.industry}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10"
            aria-label={`Close ${company.name} panel`}
          >
            X
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-8 pt-4">
          {company.deliverables.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-5 py-2.5 font-mono text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "border-blue-500 text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div
          className={`p-8 transition-opacity duration-200 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
