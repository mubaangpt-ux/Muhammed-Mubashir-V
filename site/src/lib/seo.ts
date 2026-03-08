import { profile } from "../data/profile";
import { projects, type Project } from "../data/projects";
import { services, type Service, type ServiceFaq } from "../data/services";
import { resources, type Resource } from "../data/resources";

const DEFAULT_SITE_URL = "https://mubaan.online";

export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || profile.siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, "");

export const absoluteUrl = (path = "/") => new URL(path, `${SITE_URL}/`).toString();

type BreadcrumbItem = {
  name: string;
  path: string;
};

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
  "@type": "Person",
  name: profile.name,
  jobTitle: "Digital Marketing, SEO and Web Systems Specialist",
  description: profile.summary,
  url: SITE_URL,
  image: absoluteUrl("/profile.png"),
  email: profile.email,
  knowsAbout: [
    "Digital Marketing",
    "Technical SEO",
    "Lead Generation",
    "Conversion Tracking",
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

export const professionalServiceJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${profile.name} | Digital Marketing and Web Systems`,
  url: SITE_URL,
  image: absoluteUrl("/profile.png"),
  description: profile.summary,
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  serviceType: [
    "Digital Marketing",
    "Technical SEO",
    "Performance Marketing",
    "Lead Generation",
    "Web Systems",
    "Conversion Tracking",
  ],
  knowsAbout: [
    "Dubai digital marketing",
    "Dubai technical SEO",
    "Dubai lead generation",
    "Meta Ads",
    "Google Ads",
    "WordPress web systems",
    "Conversion tracking",
  ],
  availableLanguage: ["en", "ar", "hi", "ml"],
  email: profile.email,
  telephone: profile.whatsappDisplay,
  sameAs: [profile.links.instagram],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: profile.whatsappDisplay,
      email: profile.email,
      areaServed: ["AE"],
      availableLanguage: ["en", "ar", "hi", "ml"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        url: absoluteUrl(`/services/${service.slug}`),
      },
    })),
  },
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
  provider: {
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
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

export const articleJsonLd = (resource: Resource) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: resource.title,
  description: resource.description,
  author: {
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
  },
  datePublished: resource.publishDate,
  dateModified: resource.publishDate,
  mainEntityOfPage: absoluteUrl(`/resources/${resource.slug}`),
  url: absoluteUrl(`/resources/${resource.slug}`),
  about: resource.audience,
  inLanguage: "en-AE",
});

export const staticSitemapEntries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/dubai-digital-marketer", priority: "0.9", changefreq: "monthly" },
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
