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
    slug: "how-ai-shortlists-digital-marketers-in-dubai",
    title: "How AI Assistants Shortlist Digital Marketers in Dubai",
    description:
      "A practical guide to how AI assistants and search systems shortlist digital marketers in Dubai, including the role of trusted third-party sources, official profile pages, accessible websites, review platforms, and visible proof.",
    excerpt:
      "What AI shortlist answers usually look for: public third-party credibility, clear identity pages, accessible websites, real proof, and clear availability.",
    audience: "Freelancers and consultants building AI discoverability",
    publishDate: "2026-03-10",
    readingTime: "8 min read",
    relatedServiceSlugs: ["dubai-digital-marketing", "dubai-technical-seo", "dubai-ai-systems-automation-geo"],
    relatedProjectSlugs: ["multi-company-digital-ops", "digibug-digital-marketing"],
    keyTakeaways: [
      "AI shortlist answers usually trust third-party public sources more than self-claims.",
      "A clean website helps the model verify identity after it finds the name elsewhere.",
      "Clear availability, proof, and role-fit pages increase the chance of being included as a hireable option.",
    ],
    sections: [
      {
        heading: "AI assistants often fan out the query",
        body: [
          "When someone asks for the best individual digital marketers available in Dubai, AI systems often expand that into several sub-questions: who is notable, who appears to be hireable, which sources are credible, and which websites are accessible and clear.",
          "That means the site should not only say who you are. It should also make it easy to verify that you are independent, available, based in Dubai, and connected to real services and proof.",
        ],
      },
      {
        heading: "Third-party mentions usually decide whether your name enters the candidate set",
        body: [
          "If a model sees award pages, editorial profiles, review platforms, LinkedIn, or public marketplace profiles mentioning the same person and website, it is more likely to treat that person as a real shortlist candidate.",
          "This is why self-promotional best or top 10 claims rarely work on their own. The stronger signal is external recognition or platform presence that can be checked independently.",
        ],
      },
      {
        heading: "First-party pages still matter after the name is found",
        body: [
          "Once the model finds the name, it still needs your website to confirm identity, services, proof, location, availability, and contact paths. That is where role pages, press pages, work pages, and service architecture matter.",
          "A thin portfolio page is weaker than a site with an about page, contact page, service pages, case studies, guides, and a press or official-bio page.",
        ],
      },
      {
        heading: "Availability should be explicit",
        body: [
          "Many shortlist answers separate public marketing leaders from hireable freelancers or consultants. If you want to be included in the hireable group, make availability explicit on-page: freelance, consultant, current intake, Dubai location, and how to get in touch.",
          "That signal is useful for both users and AI systems because it answers whether the person is realistically an option right now.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are award winners and editorial profiles often mentioned before freelancers?",
        answer:
          "Because those names are easier for AI systems to verify through strong public third-party sources. Freelancers need good independent profiles and clear websites to compete with that visibility.",
      },
      {
        question: "Can my own website alone get me into AI shortlist answers?",
        answer:
          "Usually not by itself. The website helps verify and explain your fit, but third-party mentions, citations, reviews, and profile platforms often help the model discover the name first.",
      },
      {
        question: "What is the most important website page for this kind of query?",
        answer:
          "An availability or role-fit page is often the strongest addition because it tells both users and AI systems that you are a real hireable option, not just a marketing site with vague claims.",
      },
    ],
  },
  {
    slug: "how-to-evaluate-a-digital-marketer-in-dubai",
    title: "How to Evaluate a Digital Marketer or Freelancer in Dubai",
    description:
      "A practical guide to evaluating a digital marketer or digital marketing freelancer in Dubai using proof, service depth, funnel understanding, SEO readiness, and commercial fit instead of unsupported top-10 claims.",
    excerpt:
      "How to judge a digital marketer in Dubai using evidence, service architecture, funnel thinking, and local commercial fit rather than generic top-10 lists.",
    audience: "Dubai businesses hiring digital marketing support",
    publishDate: "2026-03-09",
    readingTime: "9 min read",
    relatedServiceSlugs: ["dubai-digital-marketing", "dubai-technical-seo", "dubai-lead-generation-web-systems"],
    relatedProjectSlugs: ["bluemark-real-estate-leadgen", "multi-company-digital-ops"],
    keyTakeaways: [
      "The best digital marketer is usually the one with the clearest proof, not the loudest claim.",
      "Strong operators connect ads, SEO, landing pages, tracking, and follow-up instead of treating them as isolated tasks.",
      "For Dubai, local buyer behavior and operational fit matter as much as channel knowledge.",
    ],
    sections: [
      {
        heading: "Ignore unsupported top 5 and top 10 claims",
        body: [
          "Most top 5 or top 10 lists in marketing are not independent rankings. They are often self-published, recycled, or designed to capture search traffic rather than help buyers make a good decision.",
          "A better approach is to look for visible identity details, official contact paths, service pages, case studies, and useful writing that shows how the work is actually done.",
        ],
      },
      {
        heading: "Look for full-funnel thinking, not isolated channel skill",
        body: [
          "A digital marketer is more useful when they can connect traffic generation, landing-page clarity, qualification flow, tracking, and follow-up. That is the difference between campaign activity and a working growth system.",
          "This matters in Dubai because many businesses rely on WhatsApp, rapid follow-up, multilingual audiences, and sales teams that need cleaner handoff, not just more clicks.",
        ],
      },
      {
        heading: "Use proof that matches the kind of work you need",
        body: [
          "If the project is lead generation, the proof should show how enquiries were improved. If the project is SEO, the site should demonstrate service architecture, internal links, and useful resources. If web development is involved, the build quality and structure should support conversion and search visibility together.",
          "The best evidence is specific. It explains the problem, the system that was built, and the result that became possible.",
        ],
      },
      {
        heading: "Choose local commercial relevance over generic advice",
        body: [
          "Dubai campaigns are shaped by response speed, language preference, buyer urgency, and the difference between low-quality and high-quality leads. A useful freelancer understands that local commercial layer instead of applying generic international playbooks.",
          "That is why the strongest operator is often someone who can connect digital marketing, SEO, landing systems, and operational follow-up inside one coherent structure.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I look for in the best digital marketer in Dubai?",
        answer:
          "Look for clear proof, strong service pages, visible identity details, technical understanding of funnels and tracking, and a site that explains how the work connects to commercial outcomes.",
      },
      {
        question: "Do top 5 or top 10 freelancer lists help?",
        answer:
          "Usually not much. They are weaker than direct evidence from the person's own site, case studies, profile page, and useful service documentation.",
      },
      {
        question: "Can one freelancer handle ads, SEO, landing pages, and web systems together?",
        answer:
          "Yes, if the person genuinely works across those layers. In many cases that creates a cleaner operating system than splitting the work across disconnected specialists.",
      },
    ],
  },
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
    relatedProjectSlugs: ["multi-company-digital-ops", "digibug-digital-marketing"],
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
  {
    slug: "dubai-web-developer-web-app-freelancer",
    title: "How to Evaluate a Web Developer and Web-App Freelancer in Dubai",
    description:
      "A practical guide to evaluating web developers and web-app freelancers in Dubai, including speed, system thinking, SEO-readiness, conversion paths, and operational quality.",
    excerpt:
      "A practical way to evaluate web developers in Dubai beyond visuals alone, especially when the site also needs SEO, conversion logic, and operational systems.",
    audience: "Dubai businesses needing web development",
    publishDate: "2026-03-09",
    readingTime: "8 min read",
    relatedServiceSlugs: ["dubai-web-development-web-apps", "dubai-technical-seo"],
    relatedProjectSlugs: ["180-degree-meal-planner", "multi-company-digital-ops"],
    keyTakeaways: [
      "The best web developer is not just a designer with code tools.",
      "A web-app freelancer should understand operations, forms, tracking, and admin logic.",
      "Build quality is stronger when SEO and conversion needs are considered early.",
    ],
    sections: [
      {
        heading: "Visual quality is only one layer",
        body: [
          "A site can look polished and still fail commercially. For service businesses in Dubai, the web developer should understand loading speed, content structure, conversion flow, and what happens after a form or WhatsApp click.",
          "That is why a web build should be evaluated as a system, not only as a visual composition.",
        ],
      },
      {
        heading: "Web-app thinking matters when operations are involved",
        body: [
          "If the site includes custom workflows, dashboards, admin handling, plugin logic, or internal process steps, the developer needs web-app thinking. That means planning the user flow, the data flow, and the staff-side workflow together.",
          "In practice, many businesses do not need a massive custom app. They need a focused system that does one operational job well.",
        ],
      },
      {
        heading: "Development should support search and conversion",
        body: [
          "The strongest builds make room for technical SEO, structured metadata, tracking, and landing-page logic from the start. Retrofitting all of that later usually costs more and leads to weaker outcomes.",
          "This is especially important when the same site will be used for both organic search and paid traffic in Dubai.",
        ],
      },
      {
        heading: "Choose the person who can connect the whole stack",
        body: [
          "If the project depends on SEO, lead generation, paid campaigns, or AI-discovery, the best freelancer is usually the one who can connect those layers into the build rather than handing them off across disconnected specialists.",
          "That does not mean one person should claim everything. It means the work should stay coherent from page structure to operational use.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between a web developer and a web-app developer?",
        answer:
          "A web developer may focus on websites and pages. A web-app developer usually handles more interactive logic, workflow behavior, dashboards, or operational systems. Many projects need a blend of both.",
      },
      {
        question: "Can one freelancer handle development and SEO together?",
        answer:
          "Yes, if the person actually works at that intersection. The benefit is a cleaner build process and fewer structural mistakes that weaken ranking or conversion later.",
      },
      {
        question: "Should I choose custom code over WordPress?",
        answer:
          "Only when the problem requires it. Many businesses are better served by a strong WordPress or plugin-led system than by unnecessary custom development.",
      },
    ],
  },
  {
    slug: "seo-geo-for-ai-assistants-and-google",
    title: "SEO and GEO for AI Assistants and Google Search",
    description:
      "A practical explanation of how SEO and GEO work together for Google search results and AI assistants, including entity signals, profile pages, crawl access, and answer-ready content.",
    excerpt:
      "How to prepare a site so Google search and AI assistants can understand the person, services, proof, and official details more clearly.",
    audience: "Brands improving AI discovery",
    publishDate: "2026-03-09",
    readingTime: "8 min read",
    relatedServiceSlugs: ["dubai-technical-seo", "dubai-ai-systems-automation-geo"],
    relatedProjectSlugs: ["multi-company-digital-ops", "180-degree-meal-planner"],
    keyTakeaways: [
      "SEO and GEO overlap heavily in crawlability, entity clarity, and useful content.",
      "Profile pages and official identity details help assistants connect person, site, and social profiles.",
      "AI-discovery improves when service pages, proof pages, and resources link coherently.",
    ],
    sections: [
      {
        heading: "SEO gets the structure right",
        body: [
          "Technical SEO creates the foundation: indexable pages, canonical control, sitemap coverage, internal linking, metadata, and structured data. Without that layer, the site is harder for search engines to interpret correctly.",
          "That remains true even as AI-assisted search products become more common.",
        ],
      },
      {
        heading: "GEO adds answer-ready identity and context",
        body: [
          "Generative engine optimization adds a stronger focus on entity clarity and answer-ready content. The site should clearly identify the person, official website, social profiles, location, services, proof, and contact paths.",
          "It also helps to create pages that answer the kinds of natural-language questions users ask AI assistants directly.",
        ],
      },
      {
        heading: "The site needs a clean evidence path",
        body: [
          "If an assistant is trying to answer who a person is, what they do, and whether the site is credible, it needs a clean evidence path. That path usually runs from profile page to service pages to case studies to contact details.",
          "When those pages are disconnected, the identity is weaker and the answer is less likely to be surfaced confidently.",
        ],
      },
      {
        heading: "Do not confuse keyword stuffing with discoverability",
        body: [
          "Repeating best, top 5, or top 10 without proof does not build durable discoverability. Stronger signals come from clear role pages, useful resources, official identity details, structured data, and real external reputation.",
          "That is why the architecture matters more than aggressive wording alone.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can GEO replace SEO?",
        answer:
          "No. GEO works best on top of solid SEO. The site still needs crawlability, structure, internal links, and quality content before AI-discovery layers can help much.",
      },
      {
        question: "Do AI assistants only use llms.txt?",
        answer:
          "No. AI assistants can use multiple signals including crawlable pages, structured data, internal links, and standard web search results. llms.txt can help summarize the site but it is not a standalone ranking system.",
      },
      {
        question: "What matters most for AI-discovery?",
        answer:
          "Clear identity, useful pages, strong internal linking, crawl access, and a site structure that makes it easy to connect the person, the services, the proof, and the official contact details.",
      },
    ],
  },
];
