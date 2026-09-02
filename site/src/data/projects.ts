export type Project = {
  slug: string;
  title: string;
  category: string;
  client: string;
  period: string;
  featured: boolean;
  overview: string;
  problem: string;
  approach: string;
  deliverables: string[];
  results: string[];
  tools: string[];
  languages?: string[];
  techniques?: string[];
  image?: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "dubai-skyline-sequence-hero",
    title: "Dubai Skyline Sequence Hero",
    category: "Creative Development / Scroll Sequence",
    client: "mubaan.online",
    period: "2026",
    featured: false,
    overview:
      "Designed and engineered a 239-frame cinematic work-page sequence where a Dubai skyline grows out of motherboard circuitry through scroll-driven canvas rendering.",
    problem:
      "The work page needed a premium opening moment that felt aligned with the home-page cinematic language while still loading quickly, staying smooth on mobile, and supporting SEO, social previews, and accessible crawlable content.",
    approach:
      "Built a sticky canvas sequence powered by RAF-scheduled draws, progressive frame preloading, mathematically consistent contain-fit rendering, and a representative poster fallback for search engines and social crawlers. The visual treatment blends the skyline sequence into the site theme with starfield overlays, soft edge blending, and a themed handoff into the work archive.",
    deliverables: [
      "239-frame scroll-driven work-page hero sequence",
      "Canvas renderer with frame fallback and no queued draws",
      "Sequence prewarming tied into the main intro experience",
      "Poster-image fallback, ImageObject schema, and image sitemap support",
      "Dedicated work case study page documenting the build system",
    ],
    results: [
      "A cinematic work-page entry that matches the site’s premium dark-tech language",
      "Smooth sequence playback across desktop and mobile with reduced flicker risk",
      "Search-friendly image discovery and metadata for the hero poster frame",
    ],
    tools: [
      "Astro 4",
      "React",
      "TypeScript",
      "Framer Motion",
      "HTML5 Canvas",
      "Tailwind CSS",
      "Vite",
    ],
    languages: ["TypeScript", "TSX", "Astro", "CSS"],
    techniques: [
      "requestAnimationFrame draw scheduling",
      "progressive image preloading",
      "sticky scroll pinning",
      "canvas contain-fit math",
      "blurred edge extension from the same frame source",
      "image fallback for crawlers and social previews",
      "scroll-synced motion values",
      "mobile-aware concurrency tuning",
    ],
    image: "/sequences/work-hero/000120.jpg",
  },
  {
    slug: "180-degree-meal-planner",
    title: "180 Degree - Healthy Meal Plans + Web App Plugin",
    category: "Web App / Growth Ops",
    client: "180 Degree",
    period: "2025",
    featured: true,
    overview:
      "Built a structured meal-planner system with plugin workflows and operational controls for plan management.",
    problem:
      "The team needed a custom workflow to manage meal plans, user interactions, and internal updates without relying on fragmented tools.",
    approach:
      "Designed a plugin-led workflow with role-specific operations, practical admin UX, and measurable user actions tied to campaign traffic.",
    deliverables: [
      "Workflow-mapped WordPress plugin logic",
      "Custom MySQL table structures for operational data",
      "Landing and onboarding improvements connected to campaigns",
      "Tracking hooks for form and CTA behaviors",
    ],
    results: [
      "Faster internal handling of meal-plan operations",
      "Clearer campaign-to-conversion visibility",
      "Better continuity between ad traffic and product usage",
    ],
    tools: [
      "WordPress",
      "Elementor",
      "MySQL custom tables",
      "VS Code",
      "AI-assisted development",
      "Meta Business Suite",
    ],
  },
  {
    slug: "bluemark-real-estate-leadgen",
    title: "bluemark Real Estate - Luxury Lead Gen System",
    category: "Performance Marketing",
    client: "bluemark Real Estate Dubai",
    period: "Jan 2025 - Jul 2025",
    featured: true,
    overview:
      "Developed a real-estate lead engine using creative testing, segmented audience strategy, and WhatsApp-first follow-up flows.",
    problem:
      "The business required stable lead volume with tighter quality controls across multiple target markets.",
    approach:
      "Launched full-funnel Meta campaigns for UAE, UK, and India audiences, then iterated landing and form UX based on lead quality signals.",
    deliverables: [
      "Audience architecture (custom data, lookalike, and interest sets)",
      "Landing pages and lead-form optimization",
      "WhatsApp-integrated follow-up funnel",
      "Creative testing pipeline with performance reporting",
    ],
    results: [
      "600+ verified quality leads in 6 months",
      "Stronger lead qualification before sales contact",
      "Improved conversion continuity from ad click to WhatsApp",
    ],
    tools: ["Meta Ads Manager", "Canva", "Premiere Pro", "Sheets automation", "WhatsApp workflows"],
  },
  {
    slug: "multi-company-digital-ops",
    title: "Multi-Company Digital Ops",
    category: "Digital Operations",
    client: "Emirati Owned Companies",
    period: "Jul 2025 - Jan 2026",
    featured: true,
    overview:
      "Operated a multi-brand digital stack covering websites, social channels, ads, tracking, reporting, and governance standards.",
    problem:
      "Parallel business units had inconsistent execution quality, reporting logic, and tracking setup.",
    approach:
      "Implemented shared operating standards for campaign planning, creative production, event tracking, and weekly reporting reviews.",
    deliverables: [
      "Cross-brand governance framework",
      "WordPress and funnel optimization playbooks",
      "Pixel, event, and UTM tracking architecture",
      "Weekly and monthly reporting templates",
    ],
    results: [
      "Higher consistency across brand channels",
      "Faster debugging and campaign decisions",
      "Improved lead-flow reliability with cleaner attribution",
    ],
    tools: ["WordPress", "Elementor", "Meta Ads Manager", "Google Analytics", "Tag configuration"],
  },
  {
    slug: "raslan-bc-growth",
    title: "Raslan BC - Construction/Fit-out Growth",
    category: "Brand + Funnel Systems",
    client: "Raslan Building Contracting",
    period: "2025",
    featured: false,
    overview:
      "Strengthened construction/fits-out demand generation through messaging clarity, portfolio storytelling, and lead-path simplification.",
    problem:
      "The market-facing brand lacked a clear growth narrative aligned with project proof and offer differentiation.",
    approach:
      "Created campaign narratives and content structures focused on trust signals, delivery confidence, and inquiry qualification.",
    deliverables: [
      "Positioning-aligned campaign messaging",
      "Portfolio presentation templates",
      "Lead-path refinements for site and social channels",
    ],
    results: [
      "Improved quality of inbound inquiries",
      "More coherent brand story across channels",
    ],
    tools: ["Content systems", "Landing page UX", "Creative templates"],
  },
  {
    slug: "digibug-digital-marketing",
    title: "DigiBug - Digital Marketing Services & Creative Video Contents",
    category: "Digital Marketing & Video Production",
    client: "DigiBug",
    period: "2025",
    featured: false,
    overview:
      "A comprehensive digital marketing ecosystem combining high-converting creative video production, targeted ad campaigns, and scalable brand growth strategies.",
    problem:
      "The brand required a holistic digital presence capable of cutting through the noise in competitive markets. They needed an integrated strategy that seamlessly fused high-end cinematic video content production with data-driven performance marketing to maximize ROI, engagement, and verifiable brand visibility.",
    approach:
      "Engineered an end-to-end digital marketing and creative video production framework. This involved deploying targeted Meta and Google ad campaigns, producing cinematic and engaging video content using industry-leading camera equipment, managing social media channels, and utilizing advanced SEO techniques to build measurable, repeatable growth loops.",
    deliverables: [
      "End-to-End Digital Marketing Strategy & Omnichannel Execution",
      "Cinematic Creative Video Production & Post-Production (Reels, Commercials, Corporate Documentaries)",
      "Performance Marketing & Paid Ad Campaigns (Meta Ads, Google Ads ecosystem)",
      "Technical & On-Page SEO Optimization, Search Visibility Enhancements",
      "Social Media Management, Community Growth, & Content Operations",
      "Brand Identity Design, Copywriting, and Modular Asset Creation",
    ],
    results: [
      "Exponential growth in organic search traffic and paid brand visibility across platforms",
      "High-converting video assets driving measurable user engagement, lead acquisition, and sales",
      "Optimized return on ad spend (ROAS) achieved through precise audience targeting",
      "Established a dominant social media footprint with consistent, premium storytelling",
    ],
    tools: [
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "DaVinci Resolve",
      "Cinema Camera Systems (Sony FX3/RED)",
      "Drone Cinematography (DJI)",
      "Professional Lighting & Audio Gear",
      "Meta Business Suite",
      "Google Ads & Analytics (GA4)",
      "SEMrush / Ahrefs",
      "CRM & Meta Ads Manager",
    ],
  },
  {
    slug: "aat-limousine-chauffeur-website",
    title: "AAT Limousine — Luxury Chauffeur Website",
    category: "Web Development / Content Architecture",
    client: "AAT Limousine (Al Ameen Group)",
    period: "2026",
    featured: false,
    overview:
      "Built a full Next.js marketing site for a Dubai/Abu Dhabi luxury chauffeur operator, driven by a strict content-truth architecture that makes it structurally impossible for the site to render a fact, stat, or credential the client hasn't actually confirmed.",
    problem:
      "The brief came with a real spec but many still-open facts — fleet counts, a bookings inbox, the production domain, credential validity dates. A typical build would either stall waiting on every answer or quietly fill gaps with plausible-sounding placeholders. Neither was acceptable for a site whose credibility depends on real ISO/licensing claims.",
    approach:
      "Designed a single source-of-truth data file feeding typed content modules with build-time publication selectors — any unresolved fact, withheld record, or unconfirmed vehicle throws at build/import time rather than silently rendering. Layered a cinematic motion system (reduced-motion aware throughout), full SEO/schema infrastructure with domain-agnostic canonical URLs, and a from-scratch verification toolchain: link/schema/truth crawlers, a Lighthouse CI budget, and a deploy-readiness tool that copies the whole project into a fresh, credential-scrubbed sandbox and re-runs the entire quality gate (install through Lighthouse) end-to-end to prove it builds clean, not just on one warm machine.",
    deliverables: [
      "Truth-gate content pipeline: docs/DATA.md → typed content modules → publication selectors that throw on any unresolved or unconfirmed fact",
      "Full page set: home, fleet, services, about, contact, FAQ, legal — plus a keyless quote flow with no fabricated confirmation states",
      "Cinematic scroll/motion system built around measured reduced-motion and accessibility invariants",
      "SEO infrastructure: sitemap, robots, JSON-LD (Organization/Service/FAQPage/BreadcrumbList), dynamic OG images, domain-agnostic canonical handling",
      "A from-scratch verification suite (scripts/verify/*) — link crawling, structured-data validation, truth-marker scanning, Lighthouse budgets — plus a deploy-readiness tool that proves the whole build passes in complete isolation",
    ],
    results: [
      "18-task build with zero fabricated stats, reviews, or client logos — every published claim traces to a confirmed source",
      "Every real gate (unit tests, e2e, accessibility, Lighthouse, isolated clean-room build) passing end-to-end, independently verified",
      "A fully documented, itemized launch checklist for the one thing an agent can never supply: the client's own unconfirmed business facts",
    ],
    tools: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript (strict)",
      "Tailwind CSS v4",
      "Framer Motion",
      "Vitest",
      "Playwright",
      "Lighthouse CI",
    ],
    languages: ["TypeScript", "TSX", "CSS"],
    techniques: [
      "Build-time truth-gate enforcement over a single source-of-truth data file",
      "Publication-selector content boundary (deep-frozen, unresolved-text-asserting)",
      "Reduced-motion-aware scroll/motion system",
      "Domain-agnostic SEO/schema architecture",
      "Isolated, credential-scrubbed clean-room deploy verification",
    ],
    liveUrl: "https://aat-limousine-web.vercel.app",
  },
];
