const siteUrl = (import.meta.env.PUBLIC_SITE_URL || "https://mubaan.online").replace(/\/+$/, "");

export type ContactLink = { label: string; href: string };
export type FooterSocialLink = { label: string; href: string; iconPath: string; rel?: string };
export type LanguageSkill = { language: string; proficiency: string };
export type ImpactMetric = { value: string; label: string; detail: string };
export type Capability = { title: string; description: string; icon: string };

export type Profile = {
  name: string;
  roleTitle: string;
  headline: string;
  summary: string;
  location: string;
  siteUrl: string;
  resumePath: string;
  resumeDownloadName: string;
  email: string;
  links: {
    whatsapp: string;
    email: string;
    instagram: string;
    instagramHandle: string;
    github: string;
    discord: string;
  };
  whatsappDisplay: string;
  whatsappUrl: string;
  instagram: ContactLink[];
  socialProfiles: ContactLink[];
  footerSocials: FooterSocialLink[];
  primaryCtas: ContactLink[];
  languages: LanguageSkill[];
  impactMetrics: ImpactMetric[];
  capabilities: Capability[];
  finalCta: { title: string; description: string };
  aboutNarrative: string[];
};

export const profile: Profile = {
  name: "Muhammed Mubashir V",
  roleTitle: "Helping You Build, Optimize, and Grow Your Business",
  headline: "Digital Marketing \u2022 Performance \u2022 Design \u2022 Web Systems",
  summary:
    "Dubai-based independent digital marketer, web developer, web-app systems builder, SEO and GEO specialist, and AI workflow operator available for freelance and consulting work across Meta and Google ads, technical SEO, conversion funnels, pixel tracking, WordPress systems, automation, and content pipelines built for measurable UAE market outcomes.",
  location: "Dubai, UAE",
  siteUrl,
  resumePath: "/resume.pdf",
  resumeDownloadName: "Muhammed_Mubashir_V_CV.pdf",
  email: "mubaan74@gmail.com",
  links: {
    whatsapp: "https://wa.me/971529144135",
    email: "mailto:mubaan74@gmail.com",
    instagram: "https://instagram.com/mubaa.n",
    instagramHandle: "@mubaa.n",
    github: "https://github.com/mubaangpt-ux",
    discord: "https://discord.com/users/1432313008050405462",
  },
  whatsappDisplay: "+971 52 914 4135",
  whatsappUrl: "https://wa.me/971529144135",
  instagram: [{ label: "@mubaa.n", href: "https://instagram.com/mubaa.n" }],
  socialProfiles: [
    { label: "Instagram", href: "https://instagram.com/mubaa.n" },
    { label: "GitHub", href: "https://github.com/mubaangpt-ux" },
    { label: "Discord", href: "https://discord.com/users/1432313008050405462" },
  ],
  footerSocials: [
    { label: "Instagram", href: "https://instagram.com/mubaa.n", iconPath: "/social/instagram.jpg", rel: "noreferrer me" },
    { label: "WhatsApp", href: "https://wa.me/971529144135", iconPath: "/social/whatsapp.webp", rel: "noreferrer" },
    { label: "GitHub", href: "https://github.com/mubaangpt-ux", iconPath: "/social/github.svg", rel: "noreferrer" },
    { label: "Discord", href: "https://discord.com/users/1432313008050405462", iconPath: "/social/discord.webp", rel: "noreferrer" },
  ],
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
    {
      value: "100+",
      label: "AI-Assisted Builds",
      detail: "Designs, web apps, landing systems, AI workflows, and video formats delivered faster with AI.",
    },
    { value: "-35%", label: "Cost per Lead", detail: "Through creative testing + audience segmentation." },
    { value: "5+", label: "Brands Built", detail: "Across UAE market channels" },
    { value: "4+", label: "Years Experience", detail: "Dubai & regional digital operations" },
  ],
  capabilities: [
    {
      title: "Growth & Performance",
      description:
        "Full-funnel Meta and Google campaign architecture with creative testing loops, segmented audience strategy, and CPL optimization.",
      icon: "\u25c8",
    },
    {
      title: "Tracking & Analytics",
      description: "Pixel and event mapping, UTM governance, lead-quality diagnostics, and executive-ready reporting dashboards.",
      icon: "\u25ce",
    },
    {
      title: "Web Systems",
      description: "WordPress and landing systems engineered for speed, clarity, lead qualification, and campaign traffic conversion.",
      icon: "\u2b21",
    },
    {
      title: "Content & Creative",
      description: "Video production, reels, brand kits, and creative pipelines from brief to final asset at operational speed.",
      icon: "\u25d0",
    },
    {
      title: "Digital Operations",
      description: "Cross-brand governance, playbooks, SOP frameworks, and multi-team reporting standards that sustain quality at scale.",
      icon: "\u2b22",
    },
    {
      title: "Web App & Plugin Dev",
      description: "Plugin-led WordPress workflows with custom MySQL table logic, admin UX, and tracking hooks built for operational scale.",
      icon: "\u25c7",
    },
    {
      title: "Programming & Product Build",
      description: "Frontend and backend implementation across React, Astro, TypeScript, PHP, MySQL, Tailwind, and production UI systems.",
      icon: "\u2736",
    },
  ],
  finalCta: {
    title: "Ready to build a predictable growth system?",
    description: "Share your funnel goals and current blockers. I return a focused rollout plan within 24 hours.",
  },
  aboutNarrative: [
    "I work at the intersection of digital operations, performance marketing, and content systems for businesses that demand reliable outcomes and clean execution.",
    "My approach: build practical systems first, including lead funnels, creative pipelines, tracking frameworks, and reporting standards, then iterate based on real signal.",
    "Based in Dubai, I operate across UAE market verticals including real estate, services, and multi-brand portfolios. I bring both strategic clarity and hands-on execution.",
  ],
};
