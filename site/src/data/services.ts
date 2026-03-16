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
      "Dubai digital marketing service for businesses that need stronger lead generation, cleaner funnels, and better conversion quality across Meta, Google, landing pages, and reporting.",
    intro:
      "This Dubai digital marketing service is built around commercial outcomes, not vanity metrics. That includes ad strategy, landing flow, audience testing, attribution, creative feedback loops, and reporting that a business owner can actually use to make decisions.",
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
    title: "Dubai Technical SEO and GEO, Site Architecture, and Search Visibility",
    summary:
      "Technical SEO and GEO for Dubai businesses that need clean crawl paths, strong internal linking, location-relevant content architecture, schema, AI-discovery readiness, and search visibility foundations that support long-term ranking.",
    intro:
      "This Dubai technical SEO and GEO service is not one tag or plugin. It is the combined structure of crawlability, indexing, canonical control, internal linking, content hierarchy, metadata, schema, and performance. GEO adds the AI-discovery layer: clear entity signals, answer-ready content, profile pages, and crawl access for assistants that surface web results. I fix the architecture so search engines and AI-assisted discovery systems can understand the site correctly.",
    localAngle:
      "For Dubai search intent, the site needs more than brand pages. It needs clear service clusters, UAE-relevant language, local intent coverage, AI-discovery signals, and pages that match commercial searches such as digital marketing Dubai, technical SEO Dubai, web developer Dubai, and lead generation Dubai.",
    deliverables: [
      "Crawl and indexing architecture: robots, sitemap, canonicals, structured data, and metadata",
      "Service-page keyword mapping and internal linking plan for Dubai intent",
      "Entity and profile-page architecture for AI-discovery and generative search surfaces",
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
    slug: "dubai-web-development-web-apps",
    shortTitle: "Web Development",
    title: "Dubai Web Development and Web App Systems",
    summary:
      "Dubai web development and web-app systems for businesses that need fast websites, lead-ready landing pages, WordPress workflows, plugin logic, operational dashboards, and conversion-focused build quality.",
    intro:
      "This Dubai web development service goes beyond design. The website should load cleanly, support search visibility, route enquiries properly, and give the business an operational base. I build websites, landing pages, WordPress systems, and web-app style workflows with that outcome in mind.",
    localAngle:
      "Dubai businesses often need one person who can bridge development, marketing, and operations. That means the site structure, CMS logic, forms, tracking, and conversion flow all need to work together instead of being handed across disconnected teams.",
    deliverables: [
      "Marketing websites and landing pages built for speed, clarity, and conversion",
      "WordPress and Elementor builds with plugin-led workflows and operational logic",
      "Web-app style systems for forms, dashboards, admin flows, and internal handling",
      "Technical handoff that supports SEO, tracking, and campaign use after launch",
    ],
    idealFor: [
      "Businesses that need one freelancer to handle both build quality and growth logic",
      "Founders who need landing pages, websites, and web systems connected to lead generation",
      "Teams using WordPress but needing more than a brochure site",
    ],
    faqs: [
      {
        question: "Do you handle both website builds and web-app style systems?",
        answer:
          "Yes. That can include websites, landing pages, plugin-led WordPress systems, admin workflows, and other operational web structures tied to real business use.",
      },
      {
        question: "Can you build with marketing and SEO needs in mind from the start?",
        answer:
          "Yes. The site structure, speed, content layout, conversion paths, and tracking are designed together so the build supports traffic and ranking after launch.",
      },
      {
        question: "Do you only work on custom-coded apps?",
        answer:
          "No. I work across WordPress, Elementor, plugin-led development, and practical system design where those tools are the right fit.",
      },
    ],
    relatedProjectSlugs: ["180-degree-meal-planner", "multi-company-digital-ops"],
  },
  {
    slug: "dubai-ai-systems-automation-geo",
    shortTitle: "AI Systems",
    title: "Dubai AI Systems, Automation, and GEO",
    summary:
      "AI systems, automation, and GEO for Dubai businesses that need AI-assisted workflows, operational automation, prompt-ready content systems, and stronger discoverability across AI-assisted search experiences.",
    intro:
      "This Dubai AI systems, automation, and GEO service is only useful when it improves real execution. That can mean automation flows, AI-assisted content systems, internal tooling, prompt frameworks, or site structures that are easier for AI assistants to interpret. I focus on that practical layer rather than novelty for its own sake.",
    localAngle:
      "In Dubai markets, AI work needs to support speed, multilingual workflows, lead handling, and discoverability. GEO here means preparing sites and content so assistants can surface the right person, services, and proof pages more clearly.",
    deliverables: [
      "AI-assisted workflow design for content, reporting, lead handling, and operations",
      "Automation setup across tools such as n8n, Make, Zapier, and AI-supported content flows",
      "GEO architecture for clearer AI-assistant discovery and answer-ready pages",
      "Practical AI system mapping that supports sales, marketing, and internal execution",
    ],
    idealFor: [
      "Businesses that want useful AI systems instead of disconnected experiments",
      "Founders who need automation, content systems, and AI-discovery improvements together",
      "Teams trying to improve both operational speed and search visibility",
    ],
    faqs: [
      {
        question: "Do you build AI products or practical AI systems?",
        answer:
          "The focus is practical AI systems: automation, workflows, prompt design, content operations, and discovery improvements that support real business outcomes.",
      },
      {
        question: "What does GEO mean in this context?",
        answer:
          "GEO refers to generative engine optimization: making the site, profile pages, entity signals, and content structure easier for AI-assisted search systems to understand and surface.",
      },
      {
        question: "Can AI systems and SEO work together?",
        answer:
          "Yes. The strongest setup uses technical SEO, service-page clarity, entity signals, and AI-readable content together rather than treating them as separate tracks.",
      },
    ],
    relatedProjectSlugs: ["multi-company-digital-ops", "180-degree-meal-planner"],
  },
  {
    slug: "dubai-lead-generation-web-systems",
    shortTitle: "Lead Generation Systems",
    title: "Dubai Lead Generation Funnels and Web Systems",
    summary:
      "Lead-generation systems for Dubai brands that need landing pages, qualification flows, CRM-ready tracking, WhatsApp conversion paths, and operational web systems that support revenue instead of just traffic.",
    intro:
      "This Dubai lead generation service should not stop at presentation. The site should qualify traffic, route leads cleanly, capture intent data, and give the team operational control. I build those systems across landing pages, plugins, CRM handoff, and campaign-specific flows.",
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
