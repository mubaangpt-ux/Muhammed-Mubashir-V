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
};

export const projects: Project[] = [
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
    slug: "raslan-media-content-performance",
    title: "Raslan Media - Content System + Performance",
    category: "Content Operations",
    client: "Raslan Media",
    period: "2025",
    featured: false,
    overview:
      "Built repeatable content and campaign workflows to support regular publishing and measurable growth loops.",
    problem:
      "Content production was inconsistent and difficult to scale while maintaining quality standards.",
    approach:
      "Defined a production cadence, modular asset templates, and campaign review rituals to tighten execution quality.",
    deliverables: [
      "Content calendar operations model",
      "Reusable design and copy templates",
      "Performance feedback loops for content variants",
    ],
    results: [
      "More predictable publishing output",
      "Higher reuse of winning creative patterns",
    ],
    tools: ["Canva", "Premiere Pro", "Meta Business Suite", "Reporting dashboards"],
  },
];
