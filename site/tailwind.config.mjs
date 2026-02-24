/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#07090f",
        ink: "#080d1a",
        "ink-2": "#0c1428",
        glass: "rgba(255,255,255,0.055)",
        "glass-2": "rgba(255,255,255,0.10)",
        "glass-3": "rgba(255,255,255,0.16)",
        accent: "#2563eb",
        "accent-mid": "#3b82f6",
        "accent-soft": "#93c5fd",
        "accent-glow": "rgba(37,99,235,0.28)",
        "warm-white": "#f0f4ff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(2,8,23,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-hover": "0 20px 60px rgba(2,8,23,0.7), inset 0 1px 0 rgba(255,255,255,0.12)",
        glow: "0 0 0 1px rgba(147,197,253,0.18), 0 12px 48px rgba(37,99,235,0.25)",
        "glow-lg": "0 0 0 1px rgba(147,197,253,0.22), 0 24px 80px rgba(37,99,235,0.35)",
        "inner-highlight": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(37,99,235,0.15)" },
          "50%": { boxShadow: "0 0 60px rgba(37,99,235,0.35)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        ".glass-panel": {
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(2,8,23,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        },
        ".glass-panel-strong": {
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 16px 64px rgba(2,8,23,0.65), inset 0 1px 0 rgba(255,255,255,0.14)",
        },
        ".glass-panel-ultra": {
          background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
          border: "1px solid rgba(255,255,255,0.20)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 24px 80px rgba(2,8,23,0.7), inset 0 1px 0 rgba(255,255,255,0.16)",
        },
        ".ring-hover": {
          transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
        },
        ".ring-hover:hover": {
          borderColor: "rgba(147,197,253,0.35)",
          boxShadow: "0 0 0 1px rgba(147,197,253,0.2), 0 20px 60px rgba(37,99,235,0.28)",
        },
        ".text-gradient": {
          background: "linear-gradient(135deg, #f0f4ff 0%, #93c5fd 60%, #60a5fa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".text-gradient-blue": {
          background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".text-balance": { textWrap: "balance" },
        ".container-shell": { position: "relative", zIndex: "10" },
        ".noise-overlay": {
          pointerEvents: "none",
          position: "fixed",
          inset: "0",
          zIndex: "1",
          opacity: "0.038",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        },
      });
    },
  ],
};
