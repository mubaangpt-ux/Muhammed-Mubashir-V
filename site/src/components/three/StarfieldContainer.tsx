import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Hyperjump from "./Hyperjump";
import { RefreshCcw } from "lucide-react";

interface StarfieldContainerProps {
    reducedMotion: boolean;
}

export default function StarfieldContainer({ reducedMotion }: StarfieldContainerProps) {
    const [introState, setIntroState] = useState<"pending" | "playing" | "complete">("pending");

    useEffect(() => {
        const hasPlayed = localStorage.getItem("hyperjump_played");

        if (reducedMotion || hasPlayed === "true") {
            setIntroState("complete");
            document.dispatchEvent(new CustomEvent("hyperjump-complete"));
            document.body.classList.remove("hyperjump-active");
        } else {
            setIntroState("playing");
            document.body.classList.add("hyperjump-active");
            localStorage.setItem("hyperjump_played", "true");
        }
    }, [reducedMotion]);

    const handleIntroComplete = () => {
        setIntroState("complete");
        document.dispatchEvent(new CustomEvent("hyperjump-complete"));
        document.body.classList.remove("hyperjump-active");
    };

    const replayIntro = () => {
        setIntroState("playing");
        document.body.classList.add("hyperjump-active");
        // Remove the layout revealed class if it exists to reset state
        document.body.classList.remove("layout-revealed");
    };

    return (
        <>
            {/* 
        This div is the absolute black space background that hides the site
        during the hyperjump sequence. It fades out when complete. 
      */}
            <div
                className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ease-in-out ${introState === "playing" ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    background: "linear-gradient(180deg, #07090f 0%, #080d1a 100%)"
                }}
            />

            {/* R3F Canvas - Always running, acts as the background starfield */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    dpr={[1, 2]}
                    gl={{ antialias: false, alpha: true }}
                >
                    {introState === "playing" ? (
                        <Hyperjump key="playing" onIntroComplete={handleIntroComplete} />
                    ) : (
                        // Just import Hyperjump as a static drift if we are in complete state
                        <Hyperjump key="static" staticMode onIntroComplete={() => { }} />
                    )}
                </Canvas>
            </div>

            {/* Replay Button - Subtle, bottom right corner */}
            {introState === "complete" && !reducedMotion && (
                <button
                    onClick={replayIntro}
                    className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 opacity-30 hover:opacity-100"
                    style={{
                        background: "rgba(37,99,235,0.1)",
                        border: "1px solid rgba(147,197,253,0.2)",
                        color: "#93c5fd",
                        backdropFilter: "blur(8px)"
                    }}
                    aria-label="Replay intro sequence"
                >
                    <RefreshCcw size={10} strokeWidth={2} /> Replay intro
                </button>
            )}
        </>
    );
}
