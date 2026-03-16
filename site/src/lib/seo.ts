import { profile } from "../data/profile";
import { projects, type Project } from "../data/projects";
import { services, type Service, type ServiceFaq } from "../data/services";
import { resources, type Resource } from "../data/resources";

const DEFAULT_SITE_URL = "https://mubaan.online";

export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || profile.siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, "");

const FILE_PATH_PATTERN = /\/[^/?#]+\.[a-z0-9]+$/i;

export const normalizeSitePath = (input = "/") => {
  const value = input || "/";
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  const rawPathname = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const pathname = rawPathname.startsWith("/") ? rawPathname : `/${rawPathname}`;

  if (pathname === "/") return `/${suffix}`;
  if (FILE_PATH_PATTERN.test(pathname)) return `${pathname.replace(/\/+$/, "")}${suffix}`;

  return `${pathname.replace(/\/+$/, "")}/${suffix}`;
};

export const absoluteUrl = (path = "/") => new URL(normalizeSitePath(path), `${SITE_URL}/`).toString();

type BreadcrumbItem = {
  name: string;
  path: string;
};

const personEntity = () => ({
  "@type": "Person",
  name: profile.name,
  alternateName: profile.links.instagramHandle,
  jobTitle: "Independent Digital Marketer, Web Developer, SEO/GEO and AI Systems Specialist",
  description: profile.summary,
  url: SITE_URL,
  image: absoluteUrl("/profile.png"),
  email: profile.email,
  telephone: profile.whatsappDisplay,
  knowsLanguage: ["en", "ar", "hi", "ml"],
  knowsAbout: [
    "Digital Marketing",
    "Freelance Digital Marketing",
    "Technical SEO",
    "Generative Engine Optimization",
    "Generative Engine Optimization Specialist in Dubai",
    "GEO",
    "GEO Specialist Dubai",
    "SEO Specialist Dubai",
    "Lead Generation",
    "Conversion Tracking",
    "Web Development",
    "Web Development Freelancer in Dubai",
    "Web Development Services Dubai",
    "Freelance Web Developer Dubai",
    "Web App Development",
    "Web App Developer Dubai",
    "Programming",
    "AI Systems",
    "AI Automation",
    "AI Engineering",
    "WordPress Systems",
    "Performance Marketing",
    "Dubai market campaigns",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  sameAs: profile.instagram.map((item) => item.href),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: profile.name,
  url: SITE_URL,
  description: profile.summary,
  inLanguage: "en-AE",
});

export const personJsonLd = () => ({
  "@context": "https://schema.org",
  ...personEntity(),
});

export const profilePageJsonLd = (path: string) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: absoluteUrl(path),
  mainEntity: personEntity(),
});

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: profile.name,
  url: SITE_URL,
  logo: absoluteUrl("/profile.png"),
  image: absoluteUrl("/profile.png"),
  description: profile.summary,
  email: profile.email,
  telephone: profile.whatsappDisplay.replace(/\s+/g, ""),
  sameAs: profile.instagram.map((item) => item.href),
  founder: {
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
  },
  knowsAbout: [
    "Dubai digital marketing",
    "Dubai digital marketing services",
    "Dubai freelance digital marketer",
    "Digital marketing freelancer Dubai",
    "Dubai web development services",
    "Dubai technical SEO",
    "Generative engine optimization specialist in Dubai",
    "Dubai GEO specialist",
    "SEO expert Dubai",
    "Dubai GEO",
    "Dubai lead generation",
    "Dubai web developer",
    "Dubai web development freelancer",
    "Dubai web app developer",
    "Dubai AI engineer",
    "Meta Ads",
    "Google Ads",
    "WordPress web systems",
    "Conversion tracking",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: profile.whatsappDisplay.replace(/\s+/g, ""),
      email: profile.email,
      availableLanguage: ["en", "ar", "hi", "ml"],
      url: profile.links.whatsapp,
    },
  ],
});

export const breadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const workCollectionJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Work | ${profile.name}`,
  url: absoluteUrl("/work"),
  description: "Case studies in digital marketing, SEO, lead generation, and web systems.",
  hasPart: projects.map((project) => ({
    "@type": "CreativeWork",
    name: project.title,
    url: absoluteUrl(`/work/${project.slug}`),
  })),
});

export const projectJsonLd = (project: Project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.title,
  headline: project.title,
  description: project.overview,
  url: absoluteUrl(`/work/${project.slug}`),
  mainEntityOfPage: absoluteUrl(`/work/${project.slug}`),
  creator: {
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
  },
  about: project.category,
  keywords: project.tools.join(", "),
  inLanguage: "en",
});

export const serviceJsonLd = (service: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  serviceType: service.shortTitle,
  description: service.summary,
  url: absoluteUrl(`/services/${service.slug}`),
  mainEntityOfPage: absoluteUrl(`/services/${service.slug}`),
  keywords: [
    service.title,
    service.shortTitle,
    "Dubai",
    profile.name,
    "digital marketing",
    "technical SEO",
    "GEO",
    "web development",
    "AI systems",
  ].join(", "),
  provider: {
    ...personEntity(),
  },
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
});

export const faqJsonLd = (faqs: ServiceFaq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const articleJsonLd = (resource: Resource) => {
  const relatedServiceNames = services
    .filter((service) => resource.relatedServiceSlugs.includes(service.slug))
    .map((service) => service.title);
  const relatedProjectNames = projects
    .filter((project) => resource.relatedProjectSlugs.includes(project.slug))
    .map((project) => project.title);

  return {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: resource.title,
  description: resource.description,
  author: {
    ...personEntity(),
  },
  publisher: {
    "@type": "Organization",
    name: profile.name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/profile.png"),
    },
  },
  datePublished: resource.publishDate,
  dateModified: resource.publishDate,
  mainEntityOfPage: absoluteUrl(`/resources/${resource.slug}`),
  url: absoluteUrl(`/resources/${resource.slug}`),
  about: [resource.audience, ...relatedServiceNames],
  keywords: [resource.title, ...relatedServiceNames, ...relatedProjectNames, profile.name, "Dubai"].join(", "),
  mentions: [
    ...relatedServiceNames.map((name) => ({ "@type": "Service", name })),
    ...relatedProjectNames.map((name) => ({ "@type": "CreativeWork", name })),
  ],
  inLanguage: "en-AE",
  };
};

const trimTitleToWordBoundary = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
  return truncated.length >= 24 ? truncated : text.slice(0, maxLength).trim();
};

export const buildPageTitle = (primary: string, maxLength = 60) => {
  const suffix = profile.name;
  const separator = " | ";
  const full = `${primary}${separator}${suffix}`;

  if (full.length <= maxLength) return full;

  const maxPrimaryLength = Math.max(24, maxLength - suffix.length - separator.length);
  return `${trimTitleToWordBoundary(primary, maxPrimaryLength)}${separator}${suffix}`;
};

export const staticSitemapEntries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/dubai-digital-marketer", priority: "0.9", changefreq: "monthly" },
  { path: "/freelance-digital-marketer-dubai", priority: "0.9", changefreq: "monthly" },
  { path: "/dubai-web-developer", priority: "0.9", changefreq: "monthly" },
  { path: "/dubai-ai-engineer", priority: "0.9", changefreq: "monthly" },
  { path: "/generative-engine-optimization-specialist-dubai", priority: "0.9", changefreq: "monthly" },
  { path: "/press-kit", priority: "0.8", changefreq: "monthly" },
  { path: "/work", priority: "0.9", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/resume", priority: "0.7", changefreq: "monthly" },
];

export const projectSitemapEntries = projects.map((project) => ({
  path: `/work/${project.slug}`,
  priority: project.featured ? "0.8" : "0.7",
  changefreq: "monthly",
}));

export const serviceSitemapEntries = services.map((service) => ({
  path: `/services/${service.slug}`,
  priority: "0.8",
  changefreq: "monthly",
}));

export const resourceSitemapEntries = [
  { path: "/resources", priority: "0.8", changefreq: "monthly" },
  ...resources.map((resource) => ({
    path: `/resources/${resource.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
];
