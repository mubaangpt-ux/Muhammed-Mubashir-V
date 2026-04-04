export type Tab =
  | "posters"
  | "reels"
  | "logo"
  | "website"
  | "webapp"
  | "profile"
  | "brandidentity"
  | "businesscards";

export interface CreativeImageItem {
  src: string;
  alt: string;
  variant?: "portrait" | "portrait-tall" | "landscape";
}

export interface PosterGalleryItem {
  type: "single" | "carousel";
  alt: string;
  src?: string;
  slides?: CreativeImageItem[];
}

export interface CreativeDocumentItem {
  src: string;
  title: string;
}

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
  /** Override poster count (default 9) */
  posterCount?: number;
  /** Optional ordered poster gallery with support for carousel poster sets */
  posterGallery?: PosterGalleryItem[];
  /** Optional ordered website gallery assets */
  websiteGallery?: CreativeImageItem[];
  /** Optional ordered webapp collage/gallery assets */
  webappGallery?: CreativeImageItem[];
  /** Optional ordered company profile / deck PDFs */
  profileDocs?: CreativeDocumentItem[];
  /** Optional ordered brand identity / brand book PDFs */
  brandIdentityDocs?: CreativeDocumentItem[];
}

function createPosterSingles(companyId: string, count: number, label: string) {
  return Array.from({ length: count }, (_, index) => ({
    type: "single" as const,
    src: `/creative-works/${companyId}/posters/poster-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `${label} poster ${String(index + 1).padStart(2, "0")}`,
  }));
}

function createPosterCarousel(companyId: string, folderName: string, slideCount: number, alt: string) {
  return {
    type: "carousel" as const,
    alt,
    slides: Array.from({ length: slideCount }, (_, index) => ({
      src: `/creative-works/${companyId}/posters/${folderName}/slide-${String(index + 1).padStart(2, "0")}.jpg`,
      alt: `${alt} slide ${String(index + 1).padStart(2, "0")}`,
      variant: "portrait" as const,
    })),
  };
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
    posterCount: 12,
  },
  {
    id: "drsamkotkat",
    name: "Dr. Sam Kotkat",
    industry: "Healthcare",
    description: "Acupuncture, hijama and Chinese medicine therapist branding focused on wellness and holistic trust.",
    tags: ["Posters", "Wellness", "Brand"],
    color: "#0f766e",
    deliverables: ["posters"],
    posterGallery: [
      createPosterCarousel("drsamkotkat", "carousel-01", 5, "Dr. Sam migraine relief content carousel"),
      createPosterCarousel("drsamkotkat", "carousel-02", 2, "Dr. Sam healthcare carousel 02"),
      createPosterCarousel("drsamkotkat", "carousel-03", 2, "Dr. Sam healthcare carousel 03"),
      createPosterCarousel("drsamkotkat", "carousel-04", 5, "Dr. Sam healthcare carousel 04"),
      createPosterCarousel("drsamkotkat", "carousel-05", 2, "Dr. Sam healthcare carousel 05"),
      createPosterCarousel("drsamkotkat", "carousel-06", 2, "Dr. Sam healthcare carousel 06"),
      createPosterCarousel("drsamkotkat", "carousel-07", 2, "Dr. Sam healthcare carousel 07"),
      createPosterCarousel("drsamkotkat", "carousel-08", 2, "Dr. Sam healthcare carousel 08"),
      createPosterCarousel("drsamkotkat", "carousel-09", 2, "Dr. Sam healthcare carousel 09"),
      createPosterCarousel("drsamkotkat", "carousel-10", 2, "Dr. Sam healthcare carousel 10"),
      createPosterCarousel("drsamkotkat", "carousel-11", 2, "Dr. Sam healthcare carousel 11"),
      ...createPosterSingles("drsamkotkat", 5, "Dr. Sam"),
    ],
  },
  {
    id: "180degree",
    name: "180 Degree",
    industry: "Healthy Meal Plans",
    description: "Vibrant visual identity and modern digital design for a premium healthy meal plan provider in the UAE.",
    tags: ["Brand Identity", "Webapp", "Posters"],
    color: "#ea580c",
    deliverables: ["posters", "reels", "webapp"],
    reelCount: 7,
    posterGallery: [
      ...createPosterSingles("180degree", 17, "180 Degree"),
      createPosterCarousel("180degree", "carousel-01", 3, "180 Degree poster carousel 01"),
      createPosterCarousel("180degree", "carousel-02", 10, "180 Degree poster carousel 02"),
    ],
    webappGallery: [
      {
        src: "/creative-works/180degree/webapp/login-page.webp",
        alt: "180 Degree meal planner login screen",
        variant: "portrait",
      },
      {
        src: "/creative-works/180degree/webapp/nutrition-step.webp",
        alt: "180 Degree onboarding nutrition step",
        variant: "landscape",
      },
      {
        src: "/creative-works/180degree/webapp/preferences-step.webp",
        alt: "180 Degree onboarding preferences step",
        variant: "landscape",
      },
      {
        src: "/creative-works/180degree/webapp/delivery-step.png",
        alt: "180 Degree onboarding delivery schedule setup",
        variant: "portrait-tall",
      },
      {
        src: "/creative-works/180degree/webapp/client-dashboard.webp",
        alt: "180 Degree client dashboard and weekly meal plan view",
        variant: "portrait-tall",
      },
      {
        src: "/creative-works/180degree/webapp/driver-manager.webp",
        alt: "180 Degree admin driver management view",
        variant: "portrait",
      },
      {
        src: "/creative-works/180degree/webapp/admin-orders.webp",
        alt: "180 Degree admin master orders and client database view",
        variant: "portrait-tall",
      },
      {
        src: "/creative-works/180degree/webapp/referral-tracking.webp",
        alt: "180 Degree referral tracking dashboard",
        variant: "landscape",
      },
      {
        src: "/creative-works/180degree/webapp/roles-permissions.webp",
        alt: "180 Degree admin roles and permissions view",
        variant: "portrait",
      },
    ],
  },
  {
    id: "raslanbc",
    name: "RaslanBC",
    industry: "Business Setup & Consulting",
    description: "Corporate consulting identity designed for clarity, authority, and seamless business setup experiences in Dubai.",
    tags: ["Company Profile", "Posters", "Website"],
    color: "#1e3a5f",
    deliverables: ["posters", "website", "profile"],
    posterGallery: [
      createPosterCarousel("raslanbc", "carousel-01", 5, "RaslanBC poster carousel 01"),
      createPosterCarousel("raslanbc", "carousel-02", 2, "RaslanBC poster carousel 02"),
      createPosterCarousel("raslanbc", "carousel-03", 2, "RaslanBC poster carousel 03"),
      createPosterCarousel("raslanbc", "carousel-04", 2, "RaslanBC poster carousel 04"),
      createPosterCarousel("raslanbc", "carousel-05", 2, "RaslanBC poster carousel 05"),
      ...createPosterSingles("raslanbc", 13, "RaslanBC"),
    ],
    profileDocs: [
      {
        src: "/creative-works/raslanbc/profile/RaslanBC-Profile.pdf",
        title: "RaslanBC Company Profile",
      },
    ],
  },
  {
    id: "raslanrealestate",
    name: "Raslan Real Estate",
    industry: "Real Estate",
    description: "Real estate agency in Dubai featuring stunning property portfolios, launch posters, and premium branding.",
    tags: ["Posters", "Property", "Dubai"],
    color: "#ca8a04",
    deliverables: ["posters"],
    posterGallery: [
      createPosterCarousel("raslanrealestate", "carousel-01", 2, "Raslan Real Estate carousel 01"),
      createPosterCarousel("raslanrealestate", "carousel-02", 2, "Raslan Real Estate carousel 02"),
      createPosterCarousel("raslanrealestate", "carousel-03", 2, "Raslan Real Estate carousel 03"),
      createPosterCarousel("raslanrealestate", "carousel-04", 2, "Raslan Real Estate carousel 04"),
      createPosterCarousel("raslanrealestate", "carousel-05", 2, "Raslan Real Estate carousel 05"),
      ...createPosterSingles("raslanrealestate", 4, "Raslan Real Estate"),
    ],
  },
  {
    id: "careezfood",
    name: "Careez Food Trading",
    industry: "F&B Trading",
    description: "Healthy vegan food products branding emphasizing organic vibrancy, clean packaging, and social engagement.",
    tags: ["Posters", "Vegan", "F&B"],
    color: "#16a34a",
    deliverables: ["posters"],
    posterGallery: [
      createPosterCarousel("careezfood", "carousel-01", 2, "Careez carousel 01"),
      createPosterCarousel("careezfood", "carousel-02", 2, "Careez carousel 02"),
      createPosterCarousel("careezfood", "carousel-03", 2, "Careez carousel 03"),
      createPosterCarousel("careezfood", "carousel-04", 2, "Careez carousel 04"),
      createPosterCarousel("careezfood", "carousel-05", 2, "Careez carousel 05"),
      createPosterCarousel("careezfood", "carousel-06", 2, "Careez carousel 06"),
      createPosterCarousel("careezfood", "carousel-07", 2, "Careez carousel 07"),
      createPosterCarousel("careezfood", "carousel-08", 2, "Careez carousel 08"),
      createPosterCarousel("careezfood", "carousel-09", 2, "Careez carousel 09"),
      createPosterCarousel("careezfood", "carousel-10", 2, "Careez carousel 10"),
    ],
  },
  {
    id: "bluemark",
    name: "BlueMark Real Estate",
    industry: "Real Estate",
    description: "Ready to move and off-plan property sale agency in Dubai using high-end campaign posters and branded website screens.",
    tags: ["Web Design", "Posters", "Real Estate"],
    color: "#0369a1",
    deliverables: ["posters", "website"],
    posterGallery: [
      createPosterCarousel("bluemark", "carousel-01", 3, "Bluemark poster carousel 01"),
      ...createPosterSingles("bluemark", 9, "Bluemark"),
    ],
    websiteGallery: [
      {
        src: "/creative-works/bluemark/website/website-01.jpg",
        alt: "Bluemark website screen 01",
        variant: "landscape",
      },
      {
        src: "/creative-works/bluemark/website/website-02.jpg",
        alt: "Bluemark website screen 02",
        variant: "portrait",
      },
      {
        src: "/creative-works/bluemark/website/website-03.jpg",
        alt: "Bluemark website screen 03",
        variant: "landscape",
      },
      {
        src: "/creative-works/bluemark/website/website-04.jpg",
        alt: "Bluemark website screen 04",
        variant: "portrait",
      },
    ],
  },
  {
    id: "luminary",
    name: "Green Infinity",
    industry: "Floral Startup",
    description: "Dubai floral studio creating custom arrangements for milestone celebrations, intimate moments, and memorable gifting days.",
    tags: ["Logo", "Business Cards", "Company Profile"],
    color: "#173523",
    deliverables: ["logo", "businesscards", "profile"],
    profileDocs: [
      {
        src: "/creative-works/luminary/profile/profile.pdf",
        title: "Green Infinity Brand Profile",
      },
    ],
  },
  {
    id: "greenway",
    name: "GreenWay",
    industry: "Cleaning Services",
    description: "Deep Cleaning Service in Kerala, India. Digital presence built around trust, spotless results, and service accessibility.",
    tags: ["Brand Identity", "Posters", "Service Brand"],
    color: "#059669",
    deliverables: ["posters", "brandidentity"],
    posterGallery: [
      createPosterCarousel("greenway", "carousel-01", 6, "GreenWay poster carousel 01"),
      createPosterCarousel("greenway", "carousel-02", 4, "GreenWay poster carousel 02"),
      createPosterCarousel("greenway", "carousel-03", 3, "GreenWay poster carousel 03"),
      createPosterCarousel("greenway", "carousel-04", 4, "GreenWay poster carousel 04"),
      ...createPosterSingles("greenway", 3, "GreenWay"),
    ],
    brandIdentityDocs: [
      {
        src: "/creative-works/greenway/brandidentity/BrandIdentity-GreenWay.pdf",
        title: "GreenWay Brand Identity",
      },
    ],
  },
  {
    id: "ceeyem",
    name: "CeeYem Co.",
    industry: "Oil Industries",
    description: "Heavy industry and oil corporate branding ensuring robust stakeholder presentations and industrial authority.",
    tags: ["Posters", "Website", "Corporate"],
    color: "#475569",
    deliverables: ["posters", "website"],
    posterGallery: createPosterSingles("ceeyem", 11, "CeeYem"),
    websiteGallery: [
      {
        src: "/creative-works/ceeyem/website/website-01.jpg",
        alt: "CeeYem website screen 01",
        variant: "landscape",
      },
      {
        src: "/creative-works/ceeyem/website/website-02.jpg",
        alt: "CeeYem website screen 02",
        variant: "portrait",
      },
      {
        src: "/creative-works/ceeyem/website/website-03.jpg",
        alt: "CeeYem website screen 03",
        variant: "landscape",
      },
      {
        src: "/creative-works/ceeyem/website/website-04.jpg",
        alt: "CeeYem website screen 04",
        variant: "portrait",
      },
    ],
  },
];

export const tabLabels: Record<Tab, string> = {
  posters: "Posters",
  reels: "Reels",
  logo: "Logo",
  website: "Website",
  webapp: "WebApp",
  profile: "Profile",
  brandidentity: "Brand Identity",
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
  businessCardFront: (company: Company) => `/creative-works/${company.id}/business-cards/front.jpg`,
  businessCardBack: (company: Company) => `/creative-works/${company.id}/business-cards/back.jpg`,
};
