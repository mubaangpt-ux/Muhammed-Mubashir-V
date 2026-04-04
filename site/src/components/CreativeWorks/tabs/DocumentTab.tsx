import { useEffect, useMemo, useRef, useState } from "react";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import type { Company, CreativeDocumentItem } from "../data";

type Props = {
  company: Company;
  kind: "profile" | "brandidentity";
};

type PdfLib = typeof import("pdfjs-dist");
type PdfDocument = import("pdfjs-dist").PDFDocumentProxy;

let workerConfigured = false;

async function loadPdfLib(): Promise<PdfLib> {
  const pdfjs = await import("pdfjs-dist");
  if (!workerConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    workerConfigured = true;
  }
  return pdfjs;
}

function getDocuments(company: Company, kind: Props["kind"]): CreativeDocumentItem[] {
  if (kind === "brandidentity") return company.brandIdentityDocs ?? [];
  return company.profileDocs ?? [];
}

export default function DocumentTab({ company, kind }: Props) {
  const documents = useMemo(() => getDocuments(company, kind), [company, kind]);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<PdfDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewportVersion, setViewportVersion] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const swipeStartXRef = useRef<number | null>(null);
  const renderTokenRef = useRef(0);

  const activeDocument = documents[activeDocIndex] ?? null;

  useEffect(() => {
    setActiveDocIndex(0);
    setPdfDocument(null);
    setPageCount(0);
    setCurrentPage(1);
    setLoading(true);
    setError(null);
  }, [company.id, kind]);

  useEffect(() => {
    if (!activeDocument) {
      setLoading(false);
      setError("No document available yet.");
      return;
    }

    let disposed = false;
    let loadedDocument: PdfDocument | null = null;

    setLoading(true);
    setError(null);
    setPdfDocument(null);
    setPageCount(0);
    setCurrentPage(1);

    (async () => {
      try {
        const pdfjs = await loadPdfLib();
        const task = pdfjs.getDocument(activeDocument.src);
        const document = await task.promise;
        if (disposed) {
          void document.destroy();
          return;
        }
        loadedDocument = document;
        setPdfDocument(document);
        setPageCount(document.numPages);
        setCurrentPage(1);
      } catch {
        if (disposed) return;
        setError("Document preview is not available yet. Add the PDF file and this section will load automatically.");
      } finally {
        if (!disposed) setLoading(false);
      }
    })();

    return () => {
      disposed = true;
      if (loadedDocument) {
        void loadedDocument.destroy();
      }
    };
  }, [activeDocument]);

  useEffect(() => {
    if (!pdfDocument || pageCount <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentPage((prev) => (prev % pageCount) + 1);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [pdfDocument, pageCount, activeDocIndex]);

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current || !viewportRef.current) return;

    const token = ++renderTokenRef.current;
    const canvas = canvasRef.current;
    const viewportNode = viewportRef.current;

    (async () => {
      try {
        const page = await pdfDocument.getPage(currentPage);
        if (renderTokenRef.current !== token) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const containerWidth = Math.max(viewportNode.clientWidth - 24, 320);
        const containerHeight = Math.max(viewportNode.clientHeight - 24, 420);
        const scale = Math.min(containerWidth / baseViewport.width, containerHeight / baseViewport.height);
        const viewport = page.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = Math.ceil(viewport.width * dpr);
        canvas.height = Math.ceil(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;
      } catch {
        if (renderTokenRef.current !== token) return;
        setError("This PDF could not be rendered in-browser.");
      }
    })();
  }, [pdfDocument, currentPage, viewportVersion]);

  useEffect(() => {
    if (!viewportRef.current || !pdfDocument) return;
    const observer = new ResizeObserver(() => {
      setViewportVersion((value) => value + 1);
    });
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [pdfDocument]);

  function movePage(direction: 1 | -1) {
    if (pageCount <= 1) return;
    setCurrentPage((prev) => {
      if (direction === 1) return prev === pageCount ? 1 : prev + 1;
      return prev === 1 ? pageCount : prev - 1;
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    swipeStartXRef.current = event.clientX;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (swipeStartXRef.current === null) return;
    const delta = event.clientX - swipeStartXRef.current;
    swipeStartXRef.current = null;
    if (Math.abs(delta) < 36) return;
    movePage(delta < 0 ? 1 : -1);
  }

  if (!activeDocument) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
        No document has been added yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {documents.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {documents.map((document, index) => (
            <button
              key={document.src}
              type="button"
              onClick={() => setActiveDocIndex(index)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: activeDocIndex === index ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.07)",
                color: activeDocIndex === index ? "#000" : "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {document.title}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="relative flex min-h-[34rem] items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_55%),linear-gradient(180deg,rgba(13,16,27,0.96),rgba(8,10,18,0.98))] p-4"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
              Rendering document preview…
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-md text-center">
              <p className="text-lg font-semibold text-white">{activeDocument.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{error}</p>
              <a
                href={activeDocument.src}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-accent-soft"
              >
                Open document ↗
              </a>
            </div>
          )}

          {!error && <canvas ref={canvasRef} className="max-h-full max-w-full rounded-[18px] shadow-[0_18px_40px_rgba(0,0,0,0.35)]" />}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-accent-soft/75">
            {kind === "brandidentity" ? "Brand Identity Deck" : "Profile Deck"}
          </p>
          <h4 className="mt-4 text-2xl font-semibold text-white">{activeDocument.title}</h4>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Auto-plays through the PDF pages like a carousel, and you can also swipe or use the controls manually.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => movePage(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              ←
            </button>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs tracking-[0.24em] text-slate-300">
              {Math.min(currentPage, Math.max(pageCount, 1))} / {Math.max(pageCount, 1)}
            </div>
            <button
              type="button"
              onClick={() => movePage(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              →
            </button>
          </div>

          {pageCount > 1 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={`${activeDocument.src}-${index + 1}`}
                  type="button"
                  onClick={() => setCurrentPage(index + 1)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: currentPage === index + 1 ? "1.5rem" : "0.5rem",
                    background: currentPage === index + 1 ? "#60a5fa" : "rgba(255,255,255,0.24)",
                  }}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          <a
            href={activeDocument.src}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-accent-soft"
          >
            Open original PDF ↗
          </a>
        </div>
      </div>
    </div>
  );
}
