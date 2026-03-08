# ChatGPT Search Playbook

This file documents what matters for discoverability in ChatGPT search based on official OpenAI guidance.

## What ChatGPT search needs

1. The site must be publicly reachable and crawlable.
2. `OAI-SearchBot` must be allowed in `robots.txt`.
3. Your host, CDN, or firewall must allow OpenAI's published crawler IP ranges.
4. The site should expose reliable, relevant pages that clearly answer likely user questions.
5. Strong internal linking should connect summary pages, service pages, proof pages, and contact paths.

## What has already been implemented in this repo

- `robots.txt` allows `OAI-SearchBot`, `GPTBot`, and `ChatGPT-User`
- `llms.txt` lists the main service, proof, and guide pages
- Dedicated Dubai query-fit page: `/dubai-digital-marketer`
- Service pages for Dubai commercial intent
- Resource guides for natural-language search questions
- Structured data for person, service, FAQ, article, and breadcrumbs

## Infrastructure step you still need to do

At Hostinger, Cloudflare, or any other edge layer:

- allow OpenAI crawler IPs from the official published list
- do not challenge `OAI-SearchBot` with bot protection or geo blocks
- do not block the sitemap or key HTML pages behind login or script-only rendering

## Tracking

OpenAI notes that traffic from ChatGPT search can appear with `utm_source=chatgpt.com`.

You should monitor:

- landing pages from ChatGPT
- contact-page sessions from ChatGPT
- service-page engagement from ChatGPT
- queries that lead to contact or WhatsApp clicks

## Query patterns this site is now better aligned to

- digital marketer in Dubai
- best digital marketer in Dubai
- Dubai technical SEO specialist
- Dubai lead generation expert
- Dubai Meta Ads and Google Ads specialist

## Rule

Do not try to fake authority signals for ChatGPT search. The durable path is clearer service pages, stronger proof, better internal links, and real external reputation.
