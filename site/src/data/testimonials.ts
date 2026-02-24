export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type TestimonialsContent = {
  entries: Testimonial[];
  requestLine: string;
};

export const testimonials: TestimonialsContent = {
  entries: [
    {
      quote:
        "Execution quality improved quickly once the funnel, creatives, and reporting were aligned under one operating rhythm.",
      name: "Placeholder Client",
      role: "Commercial Director",
      company: "Regional Services Group",
    },
    {
      quote:
        "Campaign decisions became easier because tracking and lead-quality signals were finally consistent across teams.",
      name: "Placeholder Stakeholder",
      role: "Marketing Head",
      company: "Growth Portfolio",
    },
  ],
  requestLine: "Request a formal testimonial package or references during the discovery call.",
};
