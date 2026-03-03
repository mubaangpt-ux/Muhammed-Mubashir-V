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
  description?: string;
  tags: string[];
  color: string;
  seed: string;
  deliverables: Tab[];
}

export const companies: Company[] = [
  {
    id: "luminary",
    name: "Green Infinity",
    industry: "FLORALSTARTUP",
    description:
      "Dubai floral studio creating custom arrangements for milestone celebrations, intimate moments, and memorable gifting days.",
    tags: ["Logo", "Business Cards", "Company Profile"],
    color: "#173523",
    seed: "luminary",
    deliverables: ["logo", "businesscards", "profile"],
  },
  {
    id: "verdant",
    name: "Verdant Co.",
    industry: "Sustainability",
    description:
      "Sustainability brand work shaped through logo systems, company profiles, and refined stationery.",
    tags: ["Logo", "Profile", "Business Cards"],
    color: "#0f2418",
    seed: "verdant",
    deliverables: ["posters", "logo", "profile", "businesscards"],
  },
  {
    id: "axiom",
    name: "Axiom Group",
    industry: "Finance",
    description:
      "Finance-facing identity work built for confident positioning across print, profile, and digital touchpoints.",
    tags: ["Brand Identity", "Posters", "Profile"],
    color: "#1a1020",
    seed: "axiom",
    deliverables: ["posters", "logo", "profile", "website"],
  },
  {
    id: "nova",
    name: "Nova Studio",
    industry: "Creative Agency",
    description:
      "Creative agency visuals designed to carry sharp identity systems across web, poster, and launch materials.",
    tags: ["Logo", "Web Design", "Posters"],
    color: "#0d1a2e",
    seed: "nova",
    deliverables: ["posters", "logo", "website", "webapp"],
  },
  {
    id: "helix",
    name: "Helix Health",
    industry: "Healthcare",
    description:
      "Healthcare brand assets focused on trust, clarity, and usable digital systems for modern teams.",
    tags: ["Brand Identity", "Webapp", "Business Cards"],
    color: "#0a1f1f",
    seed: "helix",
    deliverables: ["posters", "logo", "webapp", "businesscards"],
  },
  {
    id: "solara",
    name: "Solara Realty",
    industry: "Real Estate",
    description:
      "Real estate presentation work developed for premium listings, profile decks, and supporting brand materials.",
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
