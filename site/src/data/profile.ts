export type ContactLink = { label: string; href: string; };
export type LanguageSkill = { language: string; proficiency: string; };
export type ImpactMetric = { value: string; label: string; detail: string; };
export type Capability = { title: string; description: string; icon: string; };

export type Profile = {
  name: string;
  roleTitle: string;
  headline: string;
  summary: string;
  location: string;
  siteUrl: string;
  email: string;
  links: { whatsapp: string; email: string; instagram: string; instagramHandle: string; };
  whatsappDisplay: string;
  whatsappUrl: string;
  instagram: ContactLink[];
  primaryCtas: ContactLink[];
  languages: LanguageSkill[];
  impactMetrics: ImpactMetric[];
  capabilities: Capability[];
  finalCta: { title: string; description: string; };
  aboutNarrative: string[];
};

export const profile: Profile = {
  name: "Muhammed Mubashir V",
  roleTitle: "Digital Operations & Growth Manager",
  headline: "Digital Marketing \u2022 Performance \u2022 Design \u2022 Web Systems",
  summary: "Operator-level digital growth: Meta/Google ads, conversion funnels, pixel tracking, WordPress systems, and content pipelines — built for measurable outcomes across UAE markets.",
  location: "Dubai, UAE",
  siteUrl: "https://muhammed-mubashir-v.netlify.app",
  email: "mubaan74@gmail.com",
  links: {
    whatsapp: "https://wa.me/971529144135",
    email: "mailto:mubaan74@gmail.com",
    instagram: "https://instagram.com/mubaa.n",
    instagramHandle: "@mubaa.n",
  },
  whatsappDisplay: "+971 52 914 4135",
  whatsappUrl: "https://wa.me/971529144135",
  instagram: [{ label: "@mubaa.n", href: "https://instagram.com/mubaa.n" }],
  primaryCtas: [
    { label: "Message on WhatsApp", href: "https://wa.me/971529144135" },
    { label: "Send Email", href: "mailto:mubaan74@gmail.com" },
  ],
  languages: [
    { language: "English", proficiency: "Fluent" },
    { language: "Hindi", proficiency: "Fluent" },
    { language: "Arabic", proficiency: "Read & Write" },
    { language: "Malayalam", proficiency: "Native" },
  ],
  impactMetrics: [
    { value: "100+", label: "AI-Assisted Builds", detail: "Designs, web apps, landing systems, AI workflows, and video formats delivered faster with AI." },
    { value: "-35%", label: "Cost per Lead", detail: "Through creative testing + audience segmentation." },
    { value: "5+", label: "Brands Managed", detail: "Across UAE market channels" },
    { value: "4+", label: "Years Experience", detail: "Dubai & regional digital operations" },
  ],
  capabilities: [
    {
      title: "Growth & Performance",
      description: "Full-funnel Meta and Google campaign architecture with creative testing loops, segmented audience strategy, and CPL optimization.",
      icon: "◈",
    },
    {
      title: "Tracking & Analytics",
      description: "Pixel and event mapping, UTM governance, lead-quality diagnostics, and executive-ready reporting dashboards.",
      icon: "◎",
    },
    {
      title: "Web Systems",
      description: "WordPress and landing systems engineered for speed, clarity, lead qualification, and campaign traffic conversion.",
      icon: "⬡",
    },
    {
      title: "Content & Creative",
      description: "Video production, reels, brand kits, and creative pipelines — from brief to final asset at operational speed.",
      icon: "◐",
    },
    {
      title: "Digital Operations",
      description: "Cross-brand governance, playbooks, SOP frameworks, and multi-team reporting standards that sustain quality at scale.",
      icon: "⬢",
    },
    {
      title: "Web App & Plugin Dev",
      description: "Plugin-led WordPress workflows with custom MySQL table logic, admin UX, and tracking hooks — built for operational scale.",
      icon: "◇",
    },
  ],
  finalCta: {
    title: "Ready to build a predictable growth system?",
    description: "Share your funnel goals and current blockers. I return a focused rollout plan within 24 hours.",
  },
  aboutNarrative: [
    "I work at the intersection of digital operations, performance marketing, and content systems — for businesses that demand reliable outcomes and clean execution.",
    "My approach: build practical systems first — lead funnels, creative pipelines, tracking frameworks, and reporting standards — then iterate based on real signal.",
    "Based in Dubai, I operate across UAE market verticals including real estate, services, and multi-brand portfolios. I bring both strategic clarity and hands-on execution.",
  ],
};
