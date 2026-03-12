import { useEffect, useRef, useState } from "react";

import CompanyCard from "./CompanyCard";
import { companies, type Company } from "./data";
import ExpandPanel from "./ExpandPanel";

function getColumnCount(width: number) {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function CreativeWorks() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [columns, setColumns] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncColumns = () => setColumns(getColumnCount(window.innerWidth));
    syncColumns();
    window.addEventListener("resize", syncColumns, { passive: true });
    return () => window.removeEventListener("resize", syncColumns);
  }, []);

  useEffect(() => {
    if (!expandedId || !panelOpen || !panelRef.current) return;

    const timeoutId = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [expandedId, panelOpen]);

  const expandedCompany = companies.find((company) => company.id === expandedId) ?? null;
  const rows: Company[][] = [];

  for (let index = 0; index < companies.length; index += columns) {
    rows.push(companies.slice(index, index + columns));
  }

  function handleToggle(id: string) {
    if (expandedId === id && panelOpen) {
      setPanelOpen(false);
      return;
    }

    setExpandedId(id);
    setPanelOpen(false);
    requestAnimationFrame(() => setPanelOpen(true));
  }

  function handlePanelExited() {
    if (!panelOpen) {
      setExpandedId(null);
    }
  }

  return (
    <section className="relative overflow-hidden bg-transparent px-3 py-14 md:px-4 md:py-16">
      <div className="relative mx-auto max-w-[82rem]">
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.36em] text-[#93c5fd]/75">
            Creative Works
          </p>
          <h2
            className="text-balance text-4xl font-semibold text-white md:text-5xl"
            style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "-0.03em" }}
          >
            Creative Studio
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-400">
            Brand identities, digital experiences &amp; visual systems.
          </p>
        </div>

        <div className="space-y-3.5">
          {rows.map((row, rowIndex) => {
            const expandedInRow = row.find((company) => company.id === expandedId) ?? null;
            const rowStart = rowIndex * columns;

            return (
              <div key={`row-${rowIndex}`} className="space-y-3.5">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {row.map((company, cardIndex) => {
                    const globalIndex = rowStart + cardIndex;

                    return (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        isExpanded={expandedId === company.id && panelOpen}
                        onToggle={() => handleToggle(company.id)}
                        delay={globalIndex * 100}
                      />
                    );
                  })}
                </div>

                {expandedInRow && expandedCompany && expandedCompany.id === expandedInRow.id && (
                  <div ref={panelRef}>
                    <ExpandPanel
                      company={expandedCompany}
                      onClose={() => setPanelOpen(false)}
                      open={panelOpen}
                      onExited={handlePanelExited}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
