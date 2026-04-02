export type Tab =
  | "posters"
  | "reels"
  | "logo"
  | "website"
  | "webapp"
  | "profile"
  | "businesscards";

export interface Company {
  id: string;
  name: string;
  industry: string;
  description?: string;
  tags: string[];
  color: string;
  deliverables: Tab[];
  /** Override reel count (default 6) */
  reelCount?: number;
}

export const companies: Company[] = [
  {
    id: "digibug",
    name: "DigiBug",
    industry: "Digital Marketing",
    description: "Digital marketing strategies, SEO, and engaging creative video contents crafted for high-converting campaigns.",
    tags: ["Digital Marketing", "SEO", "Brand Identity"],
    color: "#2563eb",
    deliverables: ["posters", "logo"],
  },
  {
    id: "drsamkotkat",
    name: "Dr. Sam Kotkat",
    industry: "Healthcare",
    description: "Acupuncture, hijama and Chinese medicine therapist branding focused on wellness and holistic trust.",
    tags: ["Posters", "Wellness", "Brand"],
    color: "#0f766e",
    deliverables: ["posters"],
  },
  {
    id: "180degree",
    name: "180 Degree",
    industry: "Healthy Meal Plans",
    description: "Vibrant visual identity and modern digital design for a premium healthy meal plan provider in the UAE.",
    tags: ["Brand Identity", "Webapp", "Posters"],
    color: "#ea580c",
    deliverables: ["posters", "reels", "webapp"],
  },
  {
    id: "raslanbc",
    name: "RaslanBC",
    industry: "Business Setup & Consulting",
    description: "Corporate consulting identity designed for clarity, authority, and seamless business setup experiences in Dubai.",
    tags: ["Company Profile", "Posters", "Website"],
    color: "#1e3a5f",
    deliverables: ["posters", "reels", "website", "profile"],
  },
  {
    id: "raslanrealestate",
    name: "Raslan Real Estate",
    industry: "Real Estate",
    description: "Real estate agency in Dubai featuring stunning property portfolios, launch posters, and premium branding.",
    tags: ["Posters", "Property", "Dubai"],
    color: "#ca8a04",
    deliverables: ["posters"],
  },
  {
    id: "careezfood",
    name: "Careez Food Trading",
    industry: "F&B Trading",
    description: "Healthy vegan food products branding emphasizing organic vibrancy, clean packaging, and social engagement.",
    tags: ["Posters", "Vegan", "F&B"],
    color: "#16a34a",
    deliverables: ["posters"],
  },
  {
    id: "bluemark",
    name: "BlueMark Real Estate",
    industry: "Real Estate",
    description: "Ready to move and Off-Plan Property Sale agency in Dubai utilizing dynamic reels and high-end digital posters.",
    tags: ["Reels", "Web Design", "Posters"],
    color: "#0369a1",
    deliverables: ["reels", "posters", "website"],
  },
  {
    id: "luminary",
    name: "Green Infinity",
    industry: "Floral Startup",
    description: "Dubai floral studio creating custom arrangements for milestone celebrations, intimate moments, and memorable gifting days.",
    tags: ["Logo", "Business Cards", "Company Profile"],
    color: "#173523",
    deliverables: ["logo", "businesscards", "profile"],
  },
  {
    id: "greenway",
    name: "GreenWay",
    industry: "Cleaning Services",
    description: "Deep Cleaning Service in Kerala, India. Digital presence built around trust, spotless results, and service accessibility.",
    tags: ["Website", "Posters", "Reels"],
    color: "#059669",
    deliverables: ["posters", "reels", "website"],
  },
  {
    id: "ceeyem",
    name: "CeeYem Co.",
    industry: "Oil Industries",
    description: "Heavy industry and oil corporate branding ensuring robust stakeholder presentations and industrial authority.",
    tags: ["Posters", "Website", "Corporate"],
    color: "#475569",
    deliverables: ["posters", "website"],
  },
  {
    id: "otherworks",
    name: "Creative Lab",
    industry: "Random Works & AI",
    description: "Other Creative Random Works and AI designs showcasing experimental visual directions and cutting edge techniques.",
    tags: ["AI Designs", "Posters", "Reels"],
    color: "#7c3aed",
    deliverables: ["posters", "reels"],
    reelCount: 9,
  },
];

export const tabLabels: Record<Tab, string> = {
  posters: "Posters",
  reels: "Reels",
  logo: "Logo",
  website: "Website",
  webapp: "WebApp",
  profile: "Profile",
  businesscards: "Business Cards",
};

function twoDigit(index: number) {
  return String(index + 1).padStart(2, "0");
}

export const creativeWorkAssets = {
  cover: (company: Company) => `/creative-works/${company.id}/cover.jpg`,
  poster: (company: Company, index: number) =>
    `/creative-works/${company.id}/posters/poster-${twoDigit(index)}.jpg`,
  reel: (company: Company, index: number) =>
    `/creative-works/${company.id}/reels/reel-${twoDigit(index)}.mp4`,
  reelCover: (company: Company, index: number) =>
    `/creative-works/${company.id}/reels/cover-${twoDigit(index)}.jpg`,
  logo: (company: Company, index: number) =>
    `/creative-works/${company.id}/logos/logo-${twoDigit(index)}.jpg`,
  website: (company: Company, index: number) =>
    `/creative-works/${company.id}/website/website-${twoDigit(index)}.jpg`,
  webapp: (company: Company, index: number) =>
    `/creative-works/${company.id}/webapp/webapp-${twoDigit(index)}.jpg`,
  profile: (company: Company) => `/creative-works/${company.id}/profile/profile.jpg`,
  businessCardFront: (company: Company) => `/creative-works/${company.id}/business-cards/front.jpg`,
  businessCardBack: (company: Company) => `/creative-works/${company.id}/business-cards/back.jpg`,
};
