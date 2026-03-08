export type ResourceSection = {
  heading: string;
  body: string[];
};

export type ResourceFaq = {
  question: string;
  answer: string;
};

export type Resource = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  audience: string;
  publishDate: string;
  readingTime: string;
  relatedServiceSlugs: string[];
  relatedProjectSlugs: string[];
  keyTakeaways: string[];
  sections: ResourceSection[];
  faqs: ResourceFaq[];
};

export const resources: Resource[] = [
  {
    slug: "dubai-technical-seo-checklist",
    title: "Dubai Technical SEO Checklist for Service Businesses",
    description:
      "A practical Dubai technical SEO checklist covering crawlability, indexation, internal linking, service architecture, schema, and local intent signals for service businesses.",
    excerpt:
      "A practical checklist for fixing crawl paths, internal links, schema, and local intent coverage so a Dubai service site can rank on stronger foundations.",
    audience: "Dubai service businesses",
    publishDate: "2026-03-08",
    readingTime: "8 min read",
    relatedServiceSlugs: ["dubai-technical-seo"],
    relatedProjectSlugs: ["180-degree-meal-planner", "multi-company-digital-ops"],
    keyTakeaways: [
      "Technical SEO is site architecture, not a plugin setting.",
      "Separate service pages are usually required for commercial Dubai intent.",
      "Internal links should connect home, services, proof, and contact paths clearly.",
    ],
    sections: [
      {
        heading: "Start with crawl and index control",
        body: [
          "A site that cannot be crawled and indexed cleanly will always underperform, no matter how polished the front end looks. The first layer is canonical control, sitemap coverage, robots directives, and making sure core pages are reachable through normal HTML links.",
          "For a Dubai service site, the priority pages are usually the home page, each commercial service page, the work or proof pages, and the contact page. If those pages are not all linked from the site navigation, footer, and relevant content blocks, discovery and relevance signals weaken.",
        ],
      },
      {
        heading: "Build pages around real commercial intent",
        body: [
          "Many portfolios try to rank every keyword from the home page. That usually fails because the page is trying to satisfy too many different search intents at once. A better structure is one service page per core demand area, for example technical SEO, digital marketing, and lead-generation web systems.",
          "Those pages should explain the problem, the method, the deliverables, and the local angle for Dubai or UAE buyers. This creates clearer topical relevance and gives the site more opportunities to rank for specific commercial searches.",
        ],
      },
      {
        heading: "Use internal links to pass context, not just traffic",
        body: [
          "Internal links are strongest when they help both users and crawlers understand how topics relate. A technical SEO guide should link to the technical SEO service page, relevant case studies, and a contact path. Case studies should link back into the services they prove.",
          "Anchor text should describe the destination naturally. Generic links such as read more or click here waste contextual value. Service names, problem statements, and specific outcomes make the link graph more useful.",
        ],
      },
      {
        heading: "Add visible trust signals",
        body: [
          "Trust on a professional services site comes from clarity, not decoration. That means showing who does the work, where the business operates, how to make contact, what kind of projects have been delivered, and what the process looks like.",
          "If testimonials are placeholders, do not mark them up as reviews. Real client evidence, references, and documented work matter far more than inflated schema or vague claims.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can one home page rank for all Dubai SEO keywords?",
        answer:
          "Usually no. Service-specific pages make intent clearer and give Google better topical separation than one page trying to rank for everything.",
      },
      {
        question: "What is the most common technical SEO weakness on portfolio sites?",
        answer:
          "Thin service architecture. The site may look good visually, but it has too few pages that match commercial search intent and too few internal links connecting proof to services.",
      },
      {
        question: "Should I add lots of pages quickly?",
        answer:
          "Only if the pages are genuinely useful. Thin or repetitive pages do not build trust and can weaken site quality overall.",
      },
    ],
  },
  {
    slug: "dubai-lead-generation-landing-pages",
    title: "Dubai Lead Generation Landing Pages That Improve Enquiry Quality",
    description:
      "A detailed guide to building landing pages for Dubai lead generation with stronger qualification, WhatsApp flows, tracking, and operational follow-up.",
    excerpt:
      "How to structure landing pages and enquiry flows so Dubai traffic turns into higher-quality leads instead of noisy form fills.",
    audience: "Dubai businesses running campaigns",
    publishDate: "2026-03-08",
    readingTime: "7 min read",
    relatedServiceSlugs: ["dubai-lead-generation-web-systems", "dubai-digital-marketing"],
    relatedProjectSlugs: ["bluemark-real-estate-leadgen", "180-degree-meal-planner"],
    keyTakeaways: [
      "Lead quality depends on qualification and follow-up design, not just traffic volume.",
      "WhatsApp-first flows can work well in Dubai when tracking and routing are clean.",
      "Landing pages should connect directly to campaign message and next-step clarity.",
    ],
    sections: [
      {
        heading: "Lead volume and lead quality are different problems",
        body: [
          "Many businesses focus on getting more leads before fixing what happens after the click. That creates waste. A better system defines what a useful enquiry looks like, then shapes the form, CTA, message, and follow-up flow around that definition.",
          "For Dubai markets, this matters even more because response speed, language preference, and channel choice often affect qualification as much as ad targeting does.",
        ],
      },
      {
        heading: "Design the page around the next action",
        body: [
          "A landing page should make the next step obvious. If the preferred channel is WhatsApp, the page should explain what happens after the click, what information the user should send, and how quickly the business usually responds.",
          "If the path is a form, reduce ambiguity. Ask only for the fields needed to route and qualify the lead, and connect those submissions to tracking so the source and intent are visible later.",
        ],
      },
      {
        heading: "Message match is the difference between bounce and enquiry",
        body: [
          "The landing page should feel like the natural continuation of the ad or search result. If the ad promises premium real-estate leads, the first screen should confirm that offer directly rather than switching to generic brand copy.",
          "This is where campaign quality and page quality meet. A clean message match raises trust and usually lowers wasted clicks.",
        ],
      },
      {
        heading: "Measure the operational side too",
        body: [
          "Traffic and form submissions are not enough. The business should track whether leads were reachable, qualified, and commercially relevant. That feedback loop is how the page improves over time.",
          "Without that layer, teams often optimize for the easiest conversion event rather than the most valuable one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I send Dubai ad traffic to WhatsApp or a form?",
        answer:
          "It depends on how the team handles enquiries. WhatsApp can work very well in Dubai, but only if the business responds quickly and tracks source quality properly.",
      },
      {
        question: "How many sections should a landing page have?",
        answer:
          "As many as needed to reduce friction and answer objections, but not so many that the page loses momentum. The exact structure depends on offer complexity and buyer hesitation.",
      },
      {
        question: "Can landing-page changes improve ranking too?",
        answer:
          "They can support user experience and relevance, but ranking depends on broader SEO factors as well. For search growth, the page should sit inside a stronger service and internal-link architecture.",
      },
    ],
  },
  {
    slug: "dubai-digital-marketing-content-depth",
    title: "Content Depth for Dubai Digital Marketing Sites",
    description:
      "A practical framework for creating deeper, people-first service content that improves trust, internal linking, and topical coverage for Dubai digital marketing websites.",
    excerpt:
      "How to turn a thin portfolio into a deeper commercial website with service clusters, proof pages, and useful articles built for Dubai search intent.",
    audience: "Agencies, consultants, and service brands",
    publishDate: "2026-03-08",
    readingTime: "9 min read",
    relatedServiceSlugs: ["dubai-digital-marketing", "dubai-technical-seo"],
    relatedProjectSlugs: ["multi-company-digital-ops", "raslan-media-content-performance"],
    keyTakeaways: [
      "Content depth comes from coverage, evidence, and usefulness, not word count.",
      "Every core service should be supported by proof pages and supporting resources.",
      "People-first content is more durable than ranking-first filler.",
    ],
    sections: [
      {
        heading: "Depth is not the same as length",
        body: [
          "A long page can still be thin if it repeats generic points. Content depth comes from answering the real questions a buyer has: what is offered, who it is for, how it works, what proof exists, and what happens next.",
          "For Dubai digital marketing sites, that usually means service pages, case studies, FAQ layers, and a small number of strong resources that connect those pieces together.",
        ],
      },
      {
        heading: "Build topical clusters, not isolated pages",
        body: [
          "The strongest architecture is a cluster: a service hub, individual service pages, related work pages, and support content that explains specific problems. This helps both search engines and users understand the site's real focus.",
          "If the service is technical SEO, the support content might cover crawlability, service-page structure, or local intent mapping. If the service is digital marketing, the support content might cover lead quality, landing pages, or attribution hygiene.",
        ],
      },
      {
        heading: "Use evidence wherever possible",
        body: [
          "Claims become more credible when they connect to work examples, systems, or outcomes. Even without public dashboards, a case study can still describe the problem, the approach, the operational decisions, and the observed result.",
          "This is more convincing than generic statements about growth or optimization. It also creates more useful internal links between commercial pages and proof pages.",
        ],
      },
      {
        heading: "Give the site a clear editorial standard",
        body: [
          "Every new page should have a purpose inside the site structure. It should support a service, answer a real question, or document a real type of work. If a page exists only because a keyword tool suggested it, it is probably weak.",
          "A smaller number of useful pages usually builds more trust than a large set of shallow pages written for search volume alone.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many content pages does a service site need?",
        answer:
          "There is no ideal number. The right number is the set of pages needed to cover the real services, proof, and support topics without repetition.",
      },
      {
        question: "Will adding many short pages improve trust?",
        answer:
          "Not by itself. Trust improves when pages are accurate, useful, and connected to demonstrated experience, not when the site simply becomes larger.",
      },
      {
        question: "What should come first: service pages or resource pages?",
        answer:
          "Service pages first. Resource pages work best when they support existing services and link naturally into proof and contact paths.",
      },
    ],
  },
];
