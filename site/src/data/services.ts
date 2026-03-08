export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  shortTitle: string;
  title: string;
  summary: string;
  intro: string;
  localAngle: string;
  deliverables: string[];
  idealFor: string[];
  faqs: ServiceFaq[];
  relatedProjectSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "dubai-digital-marketing",
    shortTitle: "Digital Marketing",
    title: "Dubai Digital Marketing Strategy and Campaign Execution",
    summary:
      "Performance-focused digital marketing for Dubai businesses that need stronger lead generation, cleaner funnels, and better conversion quality across Meta, Google, landing pages, and reporting.",
    intro:
      "I build campaign systems around commercial outcomes, not vanity metrics. That includes ad strategy, landing flow, audience testing, attribution, creative feedback loops, and reporting that a business owner can actually use to make decisions.",
    localAngle:
      "Dubai campaigns behave differently across real estate, services, hospitality, and multi-market UAE audiences. Messaging, language mix, platform intent, and follow-up speed all affect lead quality. The service is structured around those local realities rather than generic global playbooks.",
    deliverables: [
      "Meta and Google campaign planning aligned to offer, funnel, and lead quality goals",
      "Audience structure, creative testing, and campaign optimization loops",
      "Landing-page and WhatsApp-first conversion flow improvements",
      "Tracking, reporting, and decision-ready weekly performance reviews",
    ],
    idealFor: [
      "Dubai businesses spending on ads without consistent lead quality",
      "Brands that need campaign execution tied to operations, not just media buying",
      "Founders who want fewer dashboards and clearer commercial signal",
    ],
    faqs: [
      {
        question: "Do you manage both strategy and execution?",
        answer:
          "Yes. I handle planning, campaign setup, conversion flow improvements, tracking, creative feedback, and reporting so the growth system stays connected end to end.",
      },
      {
        question: "Can this work for service businesses in Dubai?",
        answer:
          "Yes. The systems are built for local lead generation where speed, qualification, and follow-up quality matter as much as raw volume.",
      },
      {
        question: "What channels do you usually combine?",
        answer:
          "Typically Meta, Google, landing pages, WhatsApp, and reporting layers. The mix depends on buyer intent, budget, and how your team closes leads.",
      },
    ],
    relatedProjectSlugs: ["bluemark-real-estate-leadgen", "multi-company-digital-ops"],
  },
  {
    slug: "dubai-technical-seo",
    shortTitle: "Technical SEO",
    title: "Dubai Technical SEO, Site Architecture, and Search Visibility",
    summary:
      "Technical SEO for Dubai businesses that need clean crawl paths, strong internal linking, location-relevant content architecture, schema, and search visibility foundations that support long-term ranking.",
    intro:
      "Technical SEO is not one tag or plugin. It is the combined structure of crawlability, indexing, canonical control, internal linking, content hierarchy, metadata, schema, and performance. I fix the architecture so search engines can understand the site correctly.",
    localAngle:
      "For Dubai search intent, the site needs more than brand pages. It needs clear service clusters, UAE-relevant language, local intent coverage, and pages that match commercial searches such as digital marketing Dubai, technical SEO Dubai, and lead generation Dubai.",
    deliverables: [
      "Crawl and indexing architecture: robots, sitemap, canonicals, structured data, and metadata",
      "Service-page keyword mapping and internal linking plan for Dubai intent",
      "Content architecture recommendations for authority building around core services",
      "Search Console and Bing Webmaster setup requirements with verification hooks",
    ],
    idealFor: [
      "Sites that look polished but do not rank or get crawled correctly",
      "Businesses that rely too heavily on one home page for every query",
      "Founders who need technical fixes plus commercial keyword architecture",
    ],
    faqs: [
      {
        question: "Can technical SEO alone get first-page rankings?",
        answer:
          "No. Technical SEO makes the site indexable and understandable, but first-page performance still depends on competition, content depth, internal linking, backlinks, and domain trust.",
      },
      {
        question: "Do I need separate service pages for Dubai keywords?",
        answer:
          "Usually yes. One portfolio page rarely covers all commercial intent. Separate service pages create clearer relevance and better internal link structure.",
      },
      {
        question: "Do you handle GEO and AI discoverability too?",
        answer:
          "Yes. That includes crawl access, structured data, concise service pages, and documentation that makes the site easier for AI-assisted search systems to interpret.",
      },
    ],
    relatedProjectSlugs: ["180-degree-meal-planner", "multi-company-digital-ops"],
  },
  {
    slug: "dubai-lead-generation-web-systems",
    shortTitle: "Lead Generation Systems",
    title: "Dubai Lead Generation Funnels and Web Systems",
    summary:
      "Lead-generation systems for Dubai brands that need landing pages, qualification flows, CRM-ready tracking, WhatsApp conversion paths, and operational web systems that support revenue instead of just traffic.",
    intro:
      "A site should not stop at presentation. It should qualify traffic, route leads cleanly, capture intent data, and give the team operational control. I build those systems across landing pages, plugins, CRM handoff, and campaign-specific flows.",
    localAngle:
      "Dubai lead generation often breaks at handoff: ad traffic lands, but follow-up, qualification, or channel routing is weak. This service focuses on the full path from click to qualified enquiry so the website supports actual sales activity.",
    deliverables: [
      "Landing pages and conversion paths designed for lead quality, not just clicks",
      "WhatsApp, form, and tracking integration for enquiry capture and follow-up",
      "Operational web systems including WordPress workflows and plugin-led logic",
      "Measurement layers that connect traffic, actions, and lead handling",
    ],
    idealFor: [
      "Businesses with traffic but inconsistent enquiries",
      "Teams relying on WhatsApp and manual follow-up without proper funnel logic",
      "Founders who need web systems that support day-to-day operations",
    ],
    faqs: [
      {
        question: "Can you improve an existing funnel instead of rebuilding it?",
        answer:
          "Yes. Many projects start with diagnosis and selective improvements to landing pages, forms, WhatsApp flows, and tracking rather than a full rebuild.",
      },
      {
        question: "Do you work with WordPress systems?",
        answer:
          "Yes. WordPress, Elementor, plugin-led workflows, and custom operational logic are part of the service when they support the business model.",
      },
      {
        question: "How do you measure lead quality?",
        answer:
          "By mapping the funnel to actual business outcomes, not just form fills. That means tracking source quality, follow-up behavior, qualification steps, and conversion continuity.",
      },
    ],
    relatedProjectSlugs: ["180-degree-meal-planner", "bluemark-real-estate-leadgen"],
  },
];
