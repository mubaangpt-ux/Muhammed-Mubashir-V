export type SkillGroup = {
  title: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Growth & Brand Strategy",
    items: ["Growth planning", "Offer positioning", "Campaign architecture", "Multi-brand execution"],
  },
  {
    title: "Paid Ads",
    items: ["Meta Ads Manager", "Google Ads", "TikTok Ads Manager", "Creative testing frameworks"],
  },
  {
    title: "Tracking & Analytics",
    items: ["Pixel and event mapping", "Tag setup", "UTM governance", "Dashboard reporting"],
  },
  {
    title: "Web",
    items: ["WordPress", "Elementor", "Landing pages", "Conversion-focused UX"],
  },
  {
    title: "Web App / Plugin",
    items: ["Plugin workflows", "MySQL basics", "Custom table logic", "Operational tooling"],
  },
  {
    title: "Content & Design",
    items: ["Canva", "Premiere Pro", "Creative templates", "Brand kit systems"],
  },
  {
    title: "CRM/Automation + Email",
    items: ["Lead routing", "Automation logic", "Follow-up systems", "Email campaign operations"],
  },
  {
    title: "Copywriting",
    items: ["Ad copy", "Landing copy", "Captions", "Performance CTAs"],
  },
];

export const toolsStack: string[] = [
  "Meta Ads Manager",
  "Google Analytics",
  "Google Search Console",
  "WordPress",
  "Elementor",
  "Canva",
  "Premiere Pro",
  "VS Code",
];
