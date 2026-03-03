export type Tab =
  | "posters"
  | "logo"
  | "website"
  | "webapp"
  | "profile"
  | "businesscards";

export interface Company {
  id: string;
  name: string;
  industry: string;
  tags: string[];
  color: string;
  seed: string;
  deliverables: Tab[];
}

export const companies: Company[] = [
  {
    id: "luminary",
    name: "Luminary Labs",
    industry: "Tech Startup",
    tags: ["Brand Identity", "Web Design", "Webapp"],
    color: "#1a2744",
    seed: "luminary",
    deliverables: ["posters", "logo", "website", "webapp", "businesscards"],
  },
  {
    id: "verdant",
    name: "Verdant Co.",
    industry: "Sustainability",
    tags: ["Logo", "Profile", "Business Cards"],
    color: "#0f2418",
    seed: "verdant",
    deliverables: ["posters", "logo", "profile", "businesscards"],
  },
  {
    id: "axiom",
    name: "Axiom Group",
    industry: "Finance",
    tags: ["Brand Identity", "Posters", "Profile"],
    color: "#1a1020",
    seed: "axiom",
    deliverables: ["posters", "logo", "profile", "website"],
  },
  {
    id: "nova",
    name: "Nova Studio",
    industry: "Creative Agency",
    tags: ["Logo", "Web Design", "Posters"],
    color: "#0d1a2e",
    seed: "nova",
    deliverables: ["posters", "logo", "website", "webapp"],
  },
  {
    id: "helix",
    name: "Helix Health",
    industry: "Healthcare",
    tags: ["Brand Identity", "Webapp", "Business Cards"],
    color: "#0a1f1f",
    seed: "helix",
    deliverables: ["posters", "logo", "webapp", "businesscards"],
  },
  {
    id: "solara",
    name: "Solara Realty",
    industry: "Real Estate",
    tags: ["Profile", "Posters", "Logo"],
    color: "#1f1a0a",
    seed: "solara",
    deliverables: ["posters", "logo", "profile", "businesscards"],
  },
];

export const tabLabels: Record<Tab, string> = {
  posters: "Posters",
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
