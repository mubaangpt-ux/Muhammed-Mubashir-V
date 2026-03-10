import React, { useState } from "react";

type Props = {
  siteUrl: string;
  storyImagePath?: string;
};

const STORY_FILENAME = "mubaan-story-card.png";

export default function StorySharePanel({
  siteUrl,
  storyImagePath = "/og/story.png",
}: Props) {
  const [status, setStatus] = useState<string>("Story-safe 9:16 card ready.");
  const [isBusy, setIsBusy] = useState(false);

  async function loadStoryFile() {
    const absoluteImageUrl = new URL(storyImagePath, window.location.origin).toString();
    const response = await fetch(absoluteImageUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load the story image.");
    }

    const blob = await response.blob();
    return new File([blob], STORY_FILENAME, { type: "image/png" });
  }

  async function downloadStory() {
    const absoluteImageUrl = new URL(storyImagePath, window.location.origin).toString();
    const link = document.createElement("a");
    link.href = absoluteImageUrl;
    link.download = STORY_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleShare() {
    if (typeof window === "undefined") return;

    setIsBusy(true);
    setStatus("Preparing story card...");

    try {
      const storyFile = await loadStoryFile();
      const shareTarget = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };

      if (shareTarget.share && shareTarget.canShare?.({ files: [storyFile] })) {
        await shareTarget.share({
          title: "Muhammed Mubashir V",
          text: "Story-ready portfolio card from mubaan.online",
          files: [storyFile],
        });
        setStatus("Share sheet opened. Choose the app you want from your device.");
        return;
      }

      if (shareTarget.share) {
        await shareTarget.share({
          title: "Muhammed Mubashir V",
          text: "Digital operations, growth, and web systems.",
          url: siteUrl,
        });
        setStatus("Share sheet opened with the site link.");
        return;
      }

      await downloadStory();
      setStatus("Direct sharing is not supported on this device. The story card was downloaded instead.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Share cancelled.");
      } else {
        await downloadStory();
        setStatus("The story card was downloaded for manual posting.");
      }
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDownload() {
    setIsBusy(true);
    try {
      await downloadStory();
      setStatus("Story card downloaded.");
    } catch {
      setStatus("Download failed. Try opening the story image directly.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setStatus("Website link copied.");
    } catch {
      setStatus("Clipboard copy is not available on this device.");
    }
  }

  return (
    <section className="px-4 py-16 section-border">
      <div className="mx-auto max-w-6xl">
        <div
          className="overflow-hidden rounded-[2rem] border border-white/10"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(7,9,15,0.72) 100%)",
            backdropFilter: "blur(22px)",
            boxShadow: "0 28px 80px rgba(2,6,23,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="grid gap-10 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="max-w-2xl">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.28em]"
                style={{
                  background: "rgba(37,99,235,0.10)",
                  border: "1px solid rgba(147,197,253,0.20)",
                  color: "rgba(147,197,253,0.86)",
                  fontFamily: '"DM Mono", monospace',
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "#93c5fd", boxShadow: "0 0 10px rgba(147,197,253,0.75)" }}
                />
                Story Kit
              </div>

              <h2
                className="text-balance text-white"
                style={{
                  fontFamily: '"Sora", "Inter", sans-serif',
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                }}
              >
                Vertical brand frame for quick portfolio drops, stories, and status updates.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
                A compact share asset built from the same hero, work, and brand language used across the portfolio.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isBusy}
                  className="rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.96), rgba(59,130,246,0.72))",
                    boxShadow: "0 10px 28px rgba(37,99,235,0.30)",
                  }}
                >
                  {isBusy ? "Preparing..." : "Share Card"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isBusy}
                  className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-slate-200 transition-colors duration-300 hover:bg-white/10 disabled:opacity-70"
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-slate-400 transition-colors duration-300 hover:text-white"
                >
                  Copy Site Link
                </button>
              </div>

              <div className="mt-5 grid gap-3 text-xs md:grid-cols-3">
                {[
                  "Hero frame with orbit portrait",
                  "Selected work and brand signals",
                  "Share, download, or copy link",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 px-4 py-3 text-slate-400"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                      fontFamily: '"DM Mono", monospace',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-slate-500">{status}</p>
            </div>

            <div className="mx-auto w-full max-w-[360px]">
              <div
                className="rounded-[2.5rem] border border-white/10 p-3"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(7,9,15,0.76))",
                  boxShadow: "0 28px 72px rgba(2,6,23,0.42), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="mb-3 flex items-center justify-between px-2">
                  <span className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-500" style={{ fontFamily: '"DM Mono", monospace' }}>
                    Portfolio Story
                  </span>
                  <span className="text-[0.7rem] text-slate-600" style={{ fontFamily: '"DM Mono", monospace' }}>
                    1080 x 1920
                  </span>
                </div>
                <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-[#05070d] aspect-[9/16]">
                  <img
                    src={storyImagePath}
                    alt="Story-ready 9:16 brand card preview"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
