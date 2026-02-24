# PROJECT SNAPSHOT FOR CLAUDE

Generated: 2026-02-24 04:10:29


# REPO + DEPLOY


Repo root: C:/Users/USER/Documents/Portfolio/muhammed-portfolio

Branch: main

Remote:

origin	https://github.com/mubaangpt-ux/Muhammed-Mubashir-V.git (fetch)
origin	https://github.com/mubaangpt-ux/Muhammed-Mubashir-V.git (push)


Netlify: base=site | publish=dist | command=npm run build


# ROOT FILES



---


## FILE: netlify.toml

`"
   = [build]   base = "site"   command = "npm run build"   publish = "dist" | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: .gitignore

`"
   = site/node_modules/ site/dist/ site/.astro/ site/.env site/.env.* site/.DS_Store site/.vscode/ site/.astro/ site/.env site/.env.* | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: .vscode\tasks.json

`"
   = {   "version": "2.0.0",   "tasks": [     {       "label": "Publish Live (Netlify)",       "type": "shell",       "command": "powershell",       "args": [         "-NoProfile",         "-ExecutionPolicy",         "Bypass",         "-Command",         "cd \"${workspaceFolder}\"; git add -A; if (git diff --cached --quiet) { Write-Host 'No changes to publish.' } else { git commit -m \"publish: $(Get-Date -Format yyyy-MM-dd_HH-mm-ss)\" }; git push origin main"       ],       "problemMatcher": [],       "group": "build"     }   ] } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: .vscode\settings.json

`"
   = {     "VsCodeTaskButtons.showCounter":  false,     "VsCodeTaskButtons.tasks":  [                                     {                                         "label":  "ðŸš€ Publish Live",                                         "alignment":  "left",                                         "task":  "Publish Live (Netlify)",                                         "tooltip":  "Stage â†’ commit â†’ push to main (Netlify auto-deploy)"                                     }                                 ],                                 "snyk.advanced.autoSelectOrganization": true } | Select-Object -First 2000
  WriteLine ( -join 


# FILE TREE (filtered)


`"
foreach ( in .gitignore extensions.json launch.json astro.config.mjs package.json package-lock.json deploy-test.txt favicon.ico favicon.svg resume.pdf README.md HoverTiltCard.tsx PageHeading.tsx Reveal.tsx HeroGlassOrb.tsx Button.astro Container.astro GlassCard.astro InstagramProfileCard.astro Section.astro Tag.astro education.ts experience.ts profile.ts projects.ts skills.ts testimonials.ts BaseLayout.astro about.astro contact.astro index.astro resume.astro [slug].astro index.astro global.css tailwind.config.mjs tsconfig.json) {
   = .FullName.Substring(C:\Users\USER\Documents\Portfolio\muhammed-portfolio\site.Length + 1)
  WriteLine 
}
WriteLine 


# SITE CONFIG



---


## FILE: site\package.json

`"
   = {   "name": "teal-transit",   "type": "module",   "version": "0.0.1",   "scripts": {     "dev": "astro dev",     "build": "astro build",     "preview": "astro preview",     "astro": "astro"   },   "dependencies": {     "@astrojs/react": "^4.4.2",     "@fontsource/inter": "^5.2.8",     "@fontsource/sora": "^5.2.8",     "@react-three/drei": "^10.7.7",     "@react-three/fiber": "^9.5.0",     "@tailwindcss/vite": "^4.2.1",     "@types/react": "^19.2.14",     "@types/react-dom": "^19.2.3",     "astro": "^5.17.1",     "framer-motion": "^12.34.3",     "react": "^19.2.4",     "react-dom": "^19.2.4",     "tailwindcss": "^4.2.1",     "three": "^0.183.1"   } } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\astro.config.mjs

`"
   = // @ts-check import { defineConfig } from 'astro/config';  import tailwindcss from '@tailwindcss/vite';  import react from '@astrojs/react';  // https://astro.build/config export default defineConfig({   vite: {     plugins: [tailwindcss()]   },    integrations: [react()] }); | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\tsconfig.json

`"
   = {   "extends": "astro/tsconfigs/strict",   "include": [     ".astro/types.d.ts",     "**/*"   ],   "exclude": [     "dist"   ],   "compilerOptions": {     "jsx": "react-jsx",     "jsxImportSource": "react"   } } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\tailwind.config.mjs

`"
   = /** @type {import('tailwindcss').Config} */ export default {   content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],   theme: {     extend: {       colors: {         obsidian: "#07090f",         ink: "#0c1220",         glass: "rgba(255, 255, 255, 0.06)",         "glass-strong": "rgba(255, 255, 255, 0.12)",         accent: "#3b82f6",         "accent-soft": "#93c5fd",       },       borderRadius: {         xl: "1rem",         "2xl": "1.5rem",       },       boxShadow: {         glass: "0 10px 40px rgba(2, 8, 23, 0.45)",         glow: "0 0 0 1px rgba(147, 197, 253, 0.2), 0 15px 55px rgba(37, 99, 235, 0.2)",       },       fontFamily: {         sans: ["Inter", "system-ui", "sans-serif"],         display: ["Sora", "Inter", "system-ui", "sans-serif"],       },     },   },   plugins: [     ({ addUtilities }) => {       addUtilities({         ".glass-panel": {           background: "rgba(255, 255, 255, 0.06)",           border: "1px solid rgba(255, 255, 255, 0.15)",           backdropFilter: "blur(16px)",         },         ".glass-panel-strong": {           background: "rgba(255, 255, 255, 0.1)",           border: "1px solid rgba(255, 255, 255, 0.24)",           backdropFilter: "blur(20px)",         },         ".text-balance": {           textWrap: "balance",         },       });     },   ], }; | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\styles\global.css

`"
   = @config "../../tailwind.config.mjs"; @import "@fontsource/inter/400.css"; @import "@fontsource/inter/500.css"; @import "@fontsource/inter/600.css"; @import "@fontsource/sora/500.css"; @import "@fontsource/sora/600.css"; @import "tailwindcss";  :root {   color-scheme: dark;   --bg-primary: #07090f;   --bg-secondary: #0c1220;   --surface-glass: rgba(255, 255, 255, 0.06);   --surface-glass-strong: rgba(255, 255, 255, 0.1);   --surface-border: rgba(255, 255, 255, 0.18);   --text-main: #e2e8f0;   --text-muted: #9ca3af;   --accent: #3b82f6;   --accent-soft: #93c5fd; }  html {   scroll-behavior: smooth;   background: var(--bg-primary); }  body {   min-height: 100vh;   background:     radial-gradient(1200px 700px at 10% -10%, rgba(59, 130, 246, 0.18), transparent 52%),     radial-gradient(900px 560px at 90% 0%, rgba(56, 189, 248, 0.12), transparent 48%),     radial-gradient(700px 520px at 50% 100%, rgba(15, 23, 42, 0.8), transparent 60%),     linear-gradient(180deg, var(--bg-secondary), var(--bg-primary));   color: var(--text-main);   font-family: "Inter", system-ui, sans-serif; }  h1, h2, h3, h4, h5 {   font-family: "Sora", "Inter", system-ui, sans-serif; }  ::selection {   background: rgba(59, 130, 246, 0.35);   color: #f8fafc; }  *:focus-visible {   outline: 2px solid rgba(147, 197, 253, 0.85);   outline-offset: 2px; }  .noise-overlay {   pointer-events: none;   position: fixed;   inset: 0;   z-index: 0;   opacity: 0.045;   background-image:     radial-gradient(rgba(255, 255, 255, 0.25) 0.6px, transparent 0.6px),     radial-gradient(rgba(255, 255, 255, 0.15) 0.6px, transparent 0.6px);   background-size: 4px 4px, 7px 7px; }  .vignette-overlay {   pointer-events: none;   position: fixed;   inset: 0;   z-index: 0;   background: radial-gradient(circle at center, transparent 45%, rgba(2, 6, 23, 0.65) 100%); }  .glass-divider {   border-top: 1px solid rgba(255, 255, 255, 0.08); }  .container-shell {   position: relative;   z-index: 10; }  .ring-hover {   transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease; }  .ring-hover:hover {   border-color: rgba(147, 197, 253, 0.45);   box-shadow: 0 0 0 1px rgba(147, 197, 253, 0.25), 0 12px 34px rgba(37, 99, 235, 0.22); }  @media (prefers-reduced-motion: reduce) {   html {     scroll-behavior: auto;   }    *,   *::before,   *::after {     animation-duration: 0.01ms !important;     animation-iteration-count: 1 !important;     transition-duration: 0.01ms !important;   } } | Select-Object -First 2000
  WriteLine ( -join 


# LAYOUTS



---


## FILE: site\src\layouts\BaseLayout.astro

`"
   = --- import "../styles/global.css"; import { profile } from "../data/profile"; import InstagramProfileCard from "../components/ui/InstagramProfileCard.astro"; import Button from "../components/ui/Button.astro";  type JsonLd = Record<string, unknown>;  interface Props {   title?: string;   description?: string;   path?: string;   image?: string;   noindex?: boolean;   jsonLd?: JsonLd | JsonLd[]; }  const {   title = `${profile.name} | ${profile.roleTitle}`,   description = profile.summary,   path = Astro.url.pathname,   image = "/favicon.svg",   noindex = false,   jsonLd, } = Astro.props;  const canonical = new URL(path, profile.siteUrl).toString(); const ogImage = image.startsWith("http") ? image : new URL(image, profile.siteUrl).toString();  const navItems = [   { href: "/", label: "Home" },   { href: "/work", label: "Work" },   { href: "/about", label: "About" },   { href: "/resume", label: "Resume" },   { href: "/contact", label: "Contact" }, ];  const isActive = (href: string) =>   href === "/"     ? Astro.url.pathname === "/"     : Astro.url.pathname === href || Astro.url.pathname.startsWith(`${href}/`); ---  <!doctype html> <html lang="en">   <head>     <meta charset="UTF-8" />     <meta name="viewport" content="width=device-width, initial-scale=1" />     <title>{title}</title>     <meta name="description" content={description} />     <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />     <link rel="canonical" href={canonical} />      <meta property="og:type" content="website" />     <meta property="og:title" content={title} />     <meta property="og:description" content={description} />     <meta property="og:url" content={canonical} />     <meta property="og:image" content={ogImage} />      <meta name="twitter:card" content="summary_large_image" />     <meta name="twitter:title" content={title} />     <meta name="twitter:description" content={description} />     <meta name="twitter:image" content={ogImage} />      {jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}   </head>   <body class="antialiased">     <div class="noise-overlay" aria-hidden="true"></div>     <div class="vignette-overlay" aria-hidden="true"></div>      <div class="container-shell min-h-full flex flex-col">       <header class="fixed inset-x-0 top-0 z-50 px-4 pt-4" data-debug="BaseLayout/header">         <div class="mx-auto max-w-6xl glass-panel ring-hover rounded-2xl">           <div class="flex items-center justify-between px-5 py-3">             <a href="/" class="text-sm font-semibold tracking-[0.18em] uppercase text-slate-100">               {profile.name}             </a>             <nav class="flex items-center gap-2 overflow-x-auto text-sm text-slate-200">               {                 navItems.map((item) => (                   <a                     href={item.href}                     class={`rounded-full px-3 py-1.5 transition ${isActive(item.href) ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}                   >                     {item.label}                   </a>                 ))               }               <Button href={profile.links.whatsapp} variant="secondary" class="ml-1 hidden sm:inline-flex">                 WhatsApp               </Button>             </nav>           </div>         </div>       </header>        <main class="flex-1 pt-20 md:pt-24" data-debug="BaseLayout/main">         <slot />       </main>        <footer class="mt-8 px-4 pb-10">         <div class="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl glass-panel px-6 py-7 md:flex-row md:items-start md:justify-between">           <div class="space-y-1">             <p class="text-sm text-slate-200">{profile.name}</p>             <p class="text-sm text-slate-400">{profile.headline}</p>             <div class="flex flex-wrap gap-2 text-sm mt-2">               <a class="rounded-full border border-white/15 px-3 py-1.5 hover:border-blue-300/60" href={profile.links.whatsapp}>                 WhatsApp               </a>               <a class="rounded-full border border-white/15 px-3 py-1.5 hover:border-blue-300/60" href={profile.links.email}>                 {profile.email}               </a>             </div>           </div>           <div class="w-full md:w-80">             <InstagramProfileCard />           </div>         </div>       </footer>     </div>     <script is:inline>       (() => {         const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "1";         if (!debugEnabled) return;          const entries = [];         document.querySelectorAll("[data-debug]").forEach((el) => {           const name = el.getAttribute("data-debug") || el.tagName.toLowerCase();           const computedStyle = window.getComputedStyle(el);           if (computedStyle.position === "static") {             el.style.position = "relative";           }           el.style.outline = "1px solid rgba(255,0,0,.35)";           if (!el.classList.contains("noise-overlay") && !el.classList.contains("vignette-overlay")) {             el.style.backgroundColor = "rgba(255,0,0,.03)";           }            const height = el.offsetHeight;           let badge = el.querySelector(":scope > [data-debug-badge]");           if (!badge) {             badge = document.createElement("div");             badge.setAttribute("data-debug-badge", "1");             badge.className =               "pointer-events-none absolute left-1 top-1 z-[100] rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-rose-100";             el.appendChild(badge);           }           badge.textContent = `${name}: ${height}px`;           entries.push({ name, height });         });         if (entries.length) {           entries.sort((a, b) => b.height - a.height);           console.table(entries);         }       })();     </script>   </body> </html> | Select-Object -First 2000
  WriteLine ( -join 


# PAGES (ROUTES)



---


## FILE: site\src\pages\about.astro

`"
   = --- import BaseLayout from "../layouts/BaseLayout.astro"; import Section from "../components/ui/Section.astro"; import GlassCard from "../components/ui/GlassCard.astro"; import Tag from "../components/ui/Tag.astro"; import PageHeading from "../components/motion/PageHeading"; import Reveal from "../components/motion/Reveal"; import { profile } from "../data/profile"; import { experience } from "../data/experience"; import { skillGroups, toolsStack } from "../data/skills"; import { education } from "../data/education";  const personJsonLd = {   "@context": "https://schema.org",   "@type": "Person",   name: profile.name,   jobTitle: profile.roleTitle,   description: profile.summary,   url: profile.siteUrl,   email: profile.email,   knowsLanguage: profile.languages.map((item) => item.language),   sameAs: profile.instagram.map((item) => item.href), }; ---  <BaseLayout   title={`About | ${profile.name}`}   description={`${profile.roleTitle} in ${profile.location}`}   path="/about"   jsonLd={personJsonLd} >   <Section hero>     <PageHeading       eyebrow="About"       title={`${profile.roleTitle}`}       description={`${profile.summary} Based in ${profile.location}.`}     />   </Section>    <Section>     <div class="grid gap-4 md:gap-6 md:grid-cols-2">       {profile.aboutNarrative.map((paragraph, index) => (         <Reveal client:visible delay={index * 0.08}>           <GlassCard class="h-full">             <p class="text-sm leading-relaxed text-slate-300">{paragraph}</p>           </GlassCard>         </Reveal>       ))}     </div>   </Section>    <Section eyebrow="Experience" title="Career timeline">     <div class="space-y-4 md:space-y-6">       {experience.map((item, index) => (         <Reveal client:visible delay={index * 0.05}>           <GlassCard>             <div class="flex flex-wrap items-center justify-between gap-2">               <h3 class="text-lg font-semibold text-white">{item.role}</h3>               <Tag>{item.period}</Tag>             </div>             <p class="mt-1 text-sm text-blue-100">{item.company} | {item.location}</p>             <ul class="mt-3 space-y-2">               {item.impact.map((point) => (                 <li class="text-sm text-slate-300">- {point}</li>               ))}             </ul>           </GlassCard>         </Reveal>       ))}     </div>   </Section>    <Section eyebrow="Skills" title="Core capabilities">     <div class="grid gap-4 md:gap-6 md:grid-cols-2">       {skillGroups.map((group, index) => (         <Reveal client:visible delay={index * 0.04}>           <GlassCard class="h-full">             <h3 class="text-base font-semibold text-white">{group.title}</h3>             <div class="mt-3 flex flex-wrap gap-2">               {group.items.map((item) => (                 <Tag>{item}</Tag>               ))}             </div>           </GlassCard>         </Reveal>       ))}     </div>   </Section>    <Section tight>     <div class="grid gap-4 md:gap-6 md:grid-cols-2">       <GlassCard class="h-full">         <h3 class="text-base font-semibold text-white">Languages</h3>         <div class="mt-3 flex flex-wrap gap-2">           {profile.languages.map((item) => (             <Tag>{item.language} - {item.proficiency}</Tag>           ))}         </div>       </GlassCard>       <GlassCard class="h-full">         <h3 class="text-base font-semibold text-white">Tools stack</h3>         <div class="mt-3 flex flex-wrap gap-2">           {toolsStack.map((tool) => (             <Tag>{tool}</Tag>           ))}         </div>       </GlassCard>     </div>   </Section>    <Section eyebrow="Education" title="Academic background">     <div class="grid gap-4 md:gap-6 md:grid-cols-2">       {education.map((item) => (         <GlassCard>           <h3 class="text-base font-semibold text-white">{item.program}</h3>           <p class="mt-2 text-sm text-slate-300">{item.institution}</p>           <p class="mt-1 text-xs text-blue-100">{item.period}</p>         </GlassCard>       ))}     </div>   </Section> </BaseLayout> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\pages\contact.astro

`"
   = --- import BaseLayout from "../layouts/BaseLayout.astro"; import Section from "../components/ui/Section.astro"; import Button from "../components/ui/Button.astro"; import GlassCard from "../components/ui/GlassCard.astro"; import Tag from "../components/ui/Tag.astro"; import InstagramProfileCard from "../components/ui/InstagramProfileCard.astro"; import { profile } from "../data/profile"; ---  <BaseLayout title={`Contact | ${profile.name}`} description={`Start a project with ${profile.name}`} path="/contact">   <Section     hero     eyebrow="Contact"     title="Start with a focused brief"     description="Share your goals, timeline, and current blockers. You can start by WhatsApp or email."   >     <div class="flex flex-wrap gap-3">       <Button href={profile.links.whatsapp} target="_blank" rel="noreferrer">Message on WhatsApp</Button>       <Button href={profile.links.email} variant="secondary">Email {profile.email}</Button>     </div>   </Section>    <Section>     <div class="grid gap-4 md:gap-6 md:grid-cols-[1.2fr,0.8fr] md:items-start">       <GlassCard>         <h2 class="text-lg font-semibold text-white">Send project details</h2>         <form           name="contact"           method="POST"           action="/contact/?success=true#thanks"           data-netlify="true"           netlify-honeypot="bot-field"           class="mt-4 space-y-4"         >           <input type="hidden" name="form-name" value="contact" />           <p class="hidden">             <label>               Do not fill this out if you are human:               <input name="bot-field" />             </label>           </p>           <div>             <label for="name" class="mb-1 block text-sm text-slate-300">Name</label>             <input               id="name"               name="name"               type="text"               required               class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400"               placeholder="Your name"             />           </div>           <div>             <label for="email" class="mb-1 block text-sm text-slate-300">Email</label>             <input               id="email"               name="email"               type="email"               required               class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400"               placeholder="you@company.com"             />           </div>           <div>             <label for="message" class="mb-1 block text-sm text-slate-300">Message</label>             <textarea               id="message"               name="message"               rows="5"               required               class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400"               placeholder="Brief summary of your project and required outcomes"             ></textarea>           </div>           <Button type="submit">Submit request</Button>         </form>       </GlassCard>        <div class="space-y-4">         <GlassCard>           <h2 class="text-lg font-semibold text-white">Direct channels</h2>           <div class="mt-4 space-y-3">             <p class="text-sm text-slate-300">WhatsApp: {profile.whatsappDisplay}</p>             <p class="text-sm text-slate-300">Email: {profile.email}</p>             <div class="flex flex-wrap gap-2">               {profile.instagram.map((item) => (                 <Tag>                   <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a>                 </Tag>               ))}             </div>           </div>         </GlassCard>         <InstagramProfileCard />       </div>     </div>   </Section>    <Section tight>     <GlassCard id="thanks" class="hidden">       <h2 class="text-xl font-semibold text-white">Thank you</h2>       <p class="mt-2 text-slate-300">Your message was submitted. You can also continue on WhatsApp for faster follow-up.</p>       <div class="mt-4">         <Button href={profile.links.whatsapp} target="_blank" rel="noreferrer">Open WhatsApp</Button>       </div>     </GlassCard>   </Section>    <script is:inline>     const params = new URLSearchParams(window.location.search);     const thanks = document.getElementById("thanks");     if (params.get("success") === "true" && thanks) {       thanks.classList.remove("hidden");       thanks.scrollIntoView({ behavior: "smooth", block: "start" });     }   </script> </BaseLayout> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\pages\index.astro

`"
   = --- import BaseLayout from "../layouts/BaseLayout.astro"; import Section from "../components/ui/Section.astro"; import Button from "../components/ui/Button.astro"; import GlassCard from "../components/ui/GlassCard.astro"; import Tag from "../components/ui/Tag.astro"; import Reveal from "../components/motion/Reveal"; import HoverTiltCard from "../components/motion/HoverTiltCard"; import HeroGlassOrb from "../components/three/HeroGlassOrb"; import { profile } from "../data/profile"; import { projects } from "../data/projects"; import { testimonials } from "../data/testimonials";  const featuredProjects = projects.filter((item) => item.featured).slice(0, 3);  const personJsonLd = {   "@context": "https://schema.org",   "@type": "Person",   name: profile.name,   jobTitle: profile.roleTitle,   description: profile.summary,   url: profile.siteUrl,   email: profile.email,   address: {     "@type": "PostalAddress",     addressLocality: "Dubai",     addressCountry: "AE",   },   sameAs: profile.instagram.map((item) => item.href), }; ---  <BaseLayout   title={`${profile.name} | ${profile.roleTitle}`}   description={profile.summary}   path="/"   jsonLd={personJsonLd} >   <Section hero>     <div class="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">       <Reveal client:visible className="space-y-6" y={12} priority>         <div class="space-y-3">           <p class="text-xs uppercase tracking-[0.25em] text-blue-200/80">{profile.location}</p>           <h1 class="text-4xl md:text-5xl font-semibold text-white leading-tight text-balance">{profile.name}</h1>           <p class="text-lg md:text-xl text-blue-100/90">{profile.roleTitle}</p>         </div>         <p class="max-w-2xl text-slate-300 text-balance">{profile.headline}</p>         <p class="max-w-2xl text-slate-300 text-balance">{profile.summary}</p>         <div class="flex flex-wrap gap-3">           <Button href={profile.links.whatsapp} target="_blank" rel="noreferrer">{profile.primaryCtas[0].label}</Button>           <Button href={profile.links.email} variant="secondary">{profile.primaryCtas[1].label}</Button>         </div>         <div class="flex flex-wrap gap-2">           {profile.instagram.map((item) => (             <Tag>               <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a>             </Tag>           ))}         </div>       </Reveal>        <Reveal client:visible delay={0.12} className="lg:pl-6" priority>         <HeroGlassOrb client:media="(min-width: 1024px) and (prefers-reduced-motion: no-preference)" />       </Reveal>     </div>   </Section>    <Section tight>     <Reveal client:visible>       <div class="glass-panel rounded-2xl px-6 py-5 md:px-8 md:py-6">         <div class="grid gap-5 md:grid-cols-3">           {profile.impactMetrics.map((metric) => (             <div class="space-y-1">               <p class="text-2xl font-semibold text-white">{metric.value}</p>               <p class="text-sm text-blue-100">{metric.label}</p>               <p class="text-sm text-slate-400">{metric.detail}</p>             </div>           ))}         </div>       </div>     </Reveal>   </Section>    <Section     eyebrow="Capabilities"     title="Digital systems built for predictable growth"     description="Lean execution across strategy, operations, and measurement."   >     <div class="grid gap-4 md:grid-cols-3">       {profile.capabilities.map((capability, index) => (         <Reveal client:visible delay={index * 0.06}>           <GlassCard class="h-full">             <h3 class="text-lg font-semibold text-white">{capability.title}</h3>             <p class="mt-2 text-sm text-slate-300">{capability.description}</p>           </GlassCard>         </Reveal>       ))}     </div>   </Section>    <Section     eyebrow="Case Studies"     title="Featured work"     description="Selected projects with measurable operational and growth outcomes."   >     <div class="grid gap-4 md:grid-cols-3">       {featuredProjects.map((project, index) => (         <HoverTiltCard client:visible className="h-full" maxTilt={6 + index}>           <a href={`/work/${project.slug}`} class="glass-panel ring-hover block h-full rounded-2xl p-6">             <p class="text-xs uppercase tracking-[0.2em] text-blue-200/85">{project.category}</p>             <h3 class="mt-2 text-lg font-semibold text-white">{project.title}</h3>             <p class="mt-2 text-sm text-slate-300">{project.overview}</p>             <div class="mt-4 flex flex-wrap gap-2">               {project.tools.slice(0, 3).map((tool) => (                 <Tag>{tool}</Tag>               ))}             </div>           </a>         </HoverTiltCard>       ))}     </div>   </Section>    <Section eyebrow="Testimonials" title="What partners say">     <div class="grid gap-4 md:grid-cols-2">       {testimonials.entries.map((item, index) => (         <Reveal client:visible delay={index * 0.08}>           <GlassCard class="h-full">             <p class="text-sm leading-relaxed text-slate-200">{item.quote}</p>             <p class="mt-4 text-sm text-blue-100">{item.name}</p>             <p class="text-xs text-slate-400">{item.role} | {item.company}</p>           </GlassCard>         </Reveal>       ))}     </div>     <p class="mt-5 text-sm text-slate-400">{testimonials.requestLine}</p>   </Section>    <Section>     <Reveal client:visible>       <div class="glass-panel-strong rounded-2xl px-6 py-8 md:flex md:items-center md:justify-between md:px-8">         <div class="max-w-2xl">           <h2 class="text-2xl font-semibold text-white text-balance">{profile.finalCta.title}</h2>           <p class="mt-2 text-slate-300">{profile.finalCta.description}</p>         </div>         <div class="mt-4 flex flex-wrap gap-3 md:mt-0">           <Button href={profile.links.whatsapp} target="_blank" rel="noreferrer">Message on WhatsApp</Button>           <Button href="/contact" variant="ghost">Open contact page</Button>         </div>       </div>     </Reveal>   </Section> </BaseLayout> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\pages\resume.astro

`"
   = --- import BaseLayout from "../layouts/BaseLayout.astro"; import Section from "../components/ui/Section.astro"; import Button from "../components/ui/Button.astro"; import GlassCard from "../components/ui/GlassCard.astro"; import { profile } from "../data/profile"; ---  <BaseLayout title={`Resume | ${profile.name}`} description={`Resume and credentials for ${profile.name}`} path="/resume">   <Section     hero     eyebrow="Resume"     title={profile.name}     description={`${profile.roleTitle} | ${profile.headline}`}   >     <div class="flex flex-col gap-4">       <Button href="/resume.pdf" target="_blank" rel="noreferrer">Download PDF</Button>       <p class="text-xs text-slate-400">Replace `site/public/resume.pdf` with your final resume PDF.</p>     </div>   </Section>    <Section>     <GlassCard class="p-0 overflow-hidden">       <iframe         title="Resume PDF"         src="/resume.pdf"         class="h-[70vh] w-full bg-white"         loading="lazy"       ></iframe>       <div class="glass-divider px-6 py-4 text-sm text-slate-300">         If the viewer does not load, open the file directly:         <a class="ml-1 text-blue-200 underline underline-offset-4" href="/resume.pdf" target="_blank" rel="noreferrer">           resume.pdf         </a>       </div>     </GlassCard>   </Section> </BaseLayout> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\pages\work\index.astro

`"
   = --- import BaseLayout from "../../layouts/BaseLayout.astro"; import Section from "../../components/ui/Section.astro"; import Tag from "../../components/ui/Tag.astro"; import HoverTiltCard from "../../components/motion/HoverTiltCard"; import PageHeading from "../../components/motion/PageHeading"; import { projects } from "../../data/projects";  const categories = ["All", ...new Set(projects.map((item) => item.category))]; ---  <BaseLayout   title="Work | Muhammed Mubashir V"   description="Case studies across performance marketing, digital operations, and web systems."   path="/work" >   <Section hero>     <PageHeading       eyebrow="Work"       title="Case studies and delivery systems"       description="Focused execution across campaigns, tracking, and operational design."     />   </Section>    <Section tight>     <div class="flex flex-wrap gap-2" data-filter-root>       {categories.map((category, index) => (         <button           type="button"           class={`rounded-full border px-3 py-1.5 text-sm transition ${             index === 0               ? "border-blue-300/65 bg-blue-500/20 text-white"               : "border-white/15 bg-white/5 text-slate-300 hover:border-blue-300/45"           }`}           data-filter-chip           data-filter={category}           aria-pressed={index === 0 ? "true" : "false"}         >           {category}         </button>       ))}     </div>   </Section>    <Section>     <div class="grid gap-4 md:gap-6 md:grid-cols-2">       {projects.map((project) => (         <HoverTiltCard client:visible className="h-full" maxTilt={6}>           <a             href={`/work/${project.slug}`}             class="glass-panel ring-hover block h-full rounded-2xl p-6"             data-project-card             data-category={project.category}           >             <div class="flex flex-wrap items-center justify-between gap-3">               <p class="text-xs uppercase tracking-[0.2em] text-blue-200/80">{project.category}</p>               <Tag>{project.period}</Tag>             </div>             <h2 class="mt-3 text-xl font-semibold text-white">{project.title}</h2>             <p class="mt-2 text-sm text-slate-300">{project.overview}</p>             <div class="mt-4 flex flex-wrap gap-2">               {project.tools.slice(0, 4).map((tool) => (                 <Tag>{tool}</Tag>               ))}             </div>           </a>         </HoverTiltCard>       ))}     </div>   </Section>    <script is:inline>     const chips = Array.from(document.querySelectorAll("[data-filter-chip]"));     const cards = Array.from(document.querySelectorAll("[data-project-card]"));      function applyFilter(filter) {       cards.forEach((card) => {         const value = card.getAttribute("data-category");         const isVisible = filter === "All" || value === filter;         const container = card.parentElement;         if (container) {           container.toggleAttribute("hidden", !isVisible);         }       });       chips.forEach((chip) => {         const selected = chip.getAttribute("data-filter") === filter;         chip.setAttribute("aria-pressed", selected ? "true" : "false");         chip.classList.toggle("border-blue-300/65", selected);         chip.classList.toggle("bg-blue-500/20", selected);         chip.classList.toggle("text-white", selected);         chip.classList.toggle("border-white/15", !selected);         chip.classList.toggle("bg-white/5", !selected);         chip.classList.toggle("text-slate-300", !selected);       });     }      chips.forEach((chip) => {       chip.addEventListener("click", () => applyFilter(chip.getAttribute("data-filter") || "All"));     });   </script> </BaseLayout> | Select-Object -First 2000
  WriteLine ( -join 


# COMPONENTS



---


## FILE: site\src\components\motion\HoverTiltCard.tsx

`"
   = import type { ReactNode } from "react"; import { useRef } from "react"; import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";  type HoverTiltCardProps = {   children: ReactNode;   className?: string;   maxTilt?: number; };  export default function HoverTiltCard({ children, className = "", maxTilt = 7 }: HoverTiltCardProps) {   const prefersReducedMotion = useReducedMotion();   const cardRef = useRef<HTMLDivElement | null>(null);    const rotateXRaw = useMotionValue(0);   const rotateYRaw = useMotionValue(0);   const rotateX = useSpring(rotateXRaw, { stiffness: 170, damping: 20, mass: 0.4 });   const rotateY = useSpring(rotateYRaw, { stiffness: 170, damping: 20, mass: 0.4 });    function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {     if (prefersReducedMotion || !cardRef.current) return;     const rect = cardRef.current.getBoundingClientRect();     const x = event.clientX - rect.left;     const y = event.clientY - rect.top;     const centerX = rect.width / 2;     const centerY = rect.height / 2;     rotateYRaw.set(((x - centerX) / centerX) * maxTilt);     rotateXRaw.set((-(y - centerY) / centerY) * maxTilt);   }    function onPointerLeave() {     rotateXRaw.set(0);     rotateYRaw.set(0);   }    if (prefersReducedMotion) {     return <div className={className}>{children}</div>;   }    return (     <motion.div       ref={cardRef}       className={className}       style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}       onPointerMove={onPointerMove}       onPointerLeave={onPointerLeave}       whileHover={{ scale: 1.01 }}       transition={{ type: "spring", stiffness: 180, damping: 20 }}     >       {children}     </motion.div>   ); } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\motion\PageHeading.tsx

`"
   = import { motion, useReducedMotion } from "framer-motion";  type PageHeadingProps = {   eyebrow: string;   title: string;   description?: string;   centered?: boolean; };  export default function PageHeading({ eyebrow, title, description, centered = false }: PageHeadingProps) {   const prefersReducedMotion = useReducedMotion();   const alignClass = centered ? "text-center mx-auto" : "";    if (prefersReducedMotion) {     return (       <div className={alignClass}>         <p className="text-xs uppercase tracking-[0.25em] text-blue-200/80">{eyebrow}</p>         <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-white text-balance">{title}</h1>         {description && <p className="mt-3 max-w-2xl text-slate-300 text-balance">{description}</p>}       </div>     );   }    return (     <motion.div       className={alignClass}       initial={false}       animate={{ opacity: 1, y: 0 }}       transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}     >       <p className="text-xs uppercase tracking-[0.25em] text-blue-200/80">{eyebrow}</p>       <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-white text-balance">         {title}       </h1>       {description && (         <p className="mt-3 max-w-2xl text-slate-300 text-balance">           {description}         </p>       )}     </motion.div>   ); } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\motion\Reveal.tsx

`"
   = import type { ReactNode } from "react"; import { motion, useReducedMotion } from "framer-motion";  type RevealProps = {   children: ReactNode;   className?: string;   delay?: number;   y?: number;   once?: boolean;   priority?: boolean; };  export default function Reveal({ children, className, delay = 0, y = 18, once = true }: RevealProps) {   const prefersReducedMotion = useReducedMotion();    if (prefersReducedMotion) {     return <div className={className}>{children}</div>;   }    return (     <motion.div       className={className}       initial={false}       whileInView={{ opacity: 1, y: 0 }}       viewport={{ once, amount: 0.2 }}       transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}     >       {children}     </motion.div>   ); } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\three\HeroGlassOrb.tsx

`"
   = import { Suspense, useEffect, useMemo, useRef, useState } from "react"; import { Canvas, useFrame } from "@react-three/fiber"; import { Float } from "@react-three/drei"; import { useReducedMotion } from "framer-motion"; import type { Mesh } from "three";  function OrbMesh() {   const meshRef = useRef<Mesh | null>(null);    useFrame((_, delta) => {     if (!meshRef.current) return;     meshRef.current.rotation.y += delta * 0.18;     meshRef.current.rotation.x += delta * 0.05;   });    return (     <Float speed={1.15} rotationIntensity={0.5} floatIntensity={0.8}>       <mesh ref={meshRef}>         <icosahedronGeometry args={[1.15, 32]} />         <meshPhysicalMaterial           color="#93c5fd"           roughness={0.08}           metalness={0.2}           transmission={0.95}           thickness={1.1}           clearcoat={1}           clearcoatRoughness={0.05}           envMapIntensity={0.5}         />       </mesh>     </Float>   ); }  export default function HeroGlassOrb() {   const prefersReducedMotion = useReducedMotion();   const [enabled, setEnabled] = useState(false);    useEffect(() => {     if (prefersReducedMotion) {       setEnabled(false);       return;     }      const mediaQuery = window.matchMedia("(max-width: 1023px)");     const updateState = () => setEnabled(!mediaQuery.matches);     updateState();     mediaQuery.addEventListener("change", updateState);     return () => mediaQuery.removeEventListener("change", updateState);   }, [prefersReducedMotion]);    const fallback = useMemo(     () => (       <div         className="w-full rounded-2xl glass-panel ring-hover relative overflow-hidden h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px]"         data-debug="HeroMedia/Fallback"       >         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(147,197,253,0.3),transparent_55%)]" />         <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_65%,rgba(59,130,246,0.2),transparent_58%)]" />       </div>     ),     [],   );    if (!enabled) return fallback;    return (     <div       className="w-full rounded-2xl overflow-hidden glass-panel ring-hover h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px]"       data-debug="HeroMedia/Canvas"     >       <Canvas camera={{ position: [0, 0, 3.5], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: false }}>         <ambientLight intensity={0.5} />         <directionalLight position={[2.5, 2.5, 1]} intensity={0.85} />         <pointLight position={[-2, -1, 2]} intensity={0.45} color="#60a5fa" />         <Suspense fallback={null}>           <OrbMesh />         </Suspense>       </Canvas>     </div>   ); } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\ui\Button.astro

`"
   = --- interface Props {   href?: string;   variant?: "primary" | "secondary" | "ghost";   target?: string;   rel?: string;   type?: "button" | "submit";   class?: string; }  const {   href,   variant = "primary",   target,   rel,   type = "button",   class: className = "", } = Astro.props;  const baseClass =   "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none"; const variants = {   primary: "bg-blue-500 text-white shadow-glow hover:bg-blue-400",   secondary: "glass-panel text-slate-100 hover:border-blue-300/60",   ghost: "border border-white/15 text-slate-200 hover:border-blue-300/55 hover:text-white", }; const classes = `${baseClass} ${variants[variant]} ${className}`; ---  {   href ? (     <a href={href} target={target} rel={rel} class={classes}>       <slot />     </a>   ) : (     <button type={type} class={classes}>       <slot />     </button>   ) } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\ui\Container.astro

`"
   = --- interface Props {   class?: string; }  const { class: className = "" } = Astro.props; ---  <div class={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 ${className}`}>   <slot /> </div> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\ui\GlassCard.astro

`"
   = --- interface Props {   id?: string;   class?: string;   href?: string;   target?: string;   rel?: string; }  const { id, class: className = "", href, target, rel } = Astro.props; const cardClass = `glass-panel ring-hover rounded-2xl p-6 ${className}`; ---  {   href ? (     <a id={id} href={href} target={target} rel={rel} class={cardClass}>       <slot />     </a>   ) : (     <article id={id} class={cardClass}>       <slot />     </article>   ) } | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\ui\InstagramProfileCard.astro

`"
   = --- import GlassCard from "./GlassCard.astro"; import Button from "./Button.astro"; import { profile } from "../../data/profile"; ---  <GlassCard class="flex flex-col gap-4">   <div class="flex items-center gap-3">     <div class="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 via-pink-400 to-amber-300">       <div class="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">         M       </div>     </div>     <div>       <p class="text-sm text-slate-200">Instagram</p>       <p class="text-base font-semibold text-white">{profile.links.instagramHandle}</p>     </div>   </div>   <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">     View profile {profile.links.instagramHandle}   </div>   <Button href={profile.links.instagram} target="_blank" rel="noreferrer" variant="secondary">     Open Instagram   </Button> </GlassCard> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\ui\Section.astro

`"
   = --- import Container from "./Container.astro";  interface Props {   id?: string;   eyebrow?: string;   title?: string;   description?: string;   tight?: boolean;   loose?: boolean;   hero?: boolean;   class?: string; }  const {   id,   eyebrow,   title,   description,   tight = false,   loose = false,   hero = false,   class: className = "", } = Astro.props; const spacing = hero   ? "pt-10 md:pt-14 pb-8 md:pb-10"   : tight     ? "py-8 md:py-10"     : loose       ? "py-12 md:py-16"       : "py-10 md:py-14"; const debugLabel = title || id || "Section"; ---  <section id={id} class={`${spacing} ${className}`} data-debug={`Section/${debugLabel}`}>   <Container>     {(eyebrow || title || description) && (       <header class="mb-8 md:mb-10" data-debug={`SectionHeader/${debugLabel}`}>         {eyebrow && <p class="text-xs uppercase tracking-[0.25em] text-blue-200/80">{eyebrow}</p>}         {title && <h2 class="mt-2 text-2xl md:text-3xl font-semibold text-white text-balance">{title}</h2>}         {description && <p class="mt-3 max-w-3xl text-slate-300 text-balance">{description}</p>}       </header>     )}     <slot />   </Container> </section> | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\components\ui\Tag.astro

`"
   = --- interface Props {   class?: string; }  const { class: className = "" } = Astro.props; ---  <span class={`inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200 ${className}`}>   <slot /> </span> | Select-Object -First 2000
  WriteLine ( -join 


# DATA



---


## FILE: site\src\data\education.ts

`"
   = export type EducationItem = {   program: string;   institution: string;   period: string; };  export const education: EducationItem[] = [   {     program: "Digital Marketing",     institution: "Calicut Digital Academy",     period: "2022 - 2023",   },   {     program: "Computer Engineering",     institution: "Government Polytechnic College, Kerala",     period: "2018 - 2022",   }, ]; | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\data\experience.ts

`"
   = export type ExperienceItem = {   role: string;   company: string;   location: string;   period: string;   impact: string[]; };  export const experience: ExperienceItem[] = [   {     role: "Digital Operations & Growth Manager (Multi-Company Portfolio)",     company: "Emirati Owned Companies",     location: "Dubai, UAE",     period: "Jul 2025 - Jan 2026",     impact: [       "Managed websites, social profiles, paid ads, creatives, tracking, and reporting across multiple UAE businesses.",       "Built and optimized WordPress and Elementor sites plus lead funnels.",       "Planned and optimized Meta Ads with creative testing and CPL and lead-quality focus.",       "Implemented Pixel and tag tracking, form-submit events, UTMs, and troubleshooting workflows.",       "Produced premium creative assets and templates using Canva and Adobe workflows.",       "Built and maintained a custom meal planner web-app/plugin with custom tables and workflow logic.",     ],   },   {     role: "Digital Marketing Manager",     company: "bluemark Real Estate Dubai",     location: "Dubai, UAE",     period: "Jan 2025 - Jul 2025",     impact: [       "Ran lead-generation Meta campaigns targeting UAE, UK, and India audiences.",       "Designed conversion-oriented landing pages and lead forms.",       "Generated 600+ verified quality leads in 6 months.",       "Produced ad reels and 3D walkthrough-style content.",       "Automated lead delivery to sales teams using sheets and automation workflows.",       "Built funnels from awareness to conversion with WhatsApp integration.",     ],   },   {     role: "Digital Marketing Executive",     company: "CEE YEM Oil Co. Industry",     location: "Kerala, India",     period: "Feb 2023 - Aug 2024",     impact: [       "Improved website UX and SEO performance.",       "Increased website traffic by 2,000+ visitors per month through SEO and content.",       "Managed Google Analytics, Ads, and Search Console with campaign optimization.",       "Grew social engagement and executed email marketing programs.",     ],   },   {     role: "Digital Marketing Intern",     company: "Quad Cubes",     location: "Kerala, India",     period: "Sep 2022 - Jan 2023",     impact: [       "Supported campaign execution and content operations.",       "Assisted with reporting routines and analytics basics.",       "Helped maintain publishing consistency across channels.",     ],   }, ]; | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\data\profile.ts

`"
   = export type ContactLink = {   label: string;   href: string; };  export type LanguageSkill = {   language: string;   proficiency: string; };  export type ImpactMetric = {   value: string;   label: string;   detail: string; };  export type Capability = {   title: string;   description: string; };  export type Profile = {   name: string;   roleTitle: string;   headline: string;   summary: string;   location: string;   siteUrl: string;   email: string;   links: {     whatsapp: string;     email: string;     instagram: string;     instagramHandle: string;   };   whatsappDisplay: string;   whatsappUrl: string;   instagram: ContactLink[];   primaryCtas: ContactLink[];   languages: LanguageSkill[];   impactMetrics: ImpactMetric[];   capabilities: Capability[];   finalCta: {     title: string;     description: string;   };   aboutNarrative: string[]; };  export const profile: Profile = {   name: "Muhammed Mubashir V",   roleTitle: "Digital Operations & Growth Manager",   headline: "Digital Marketing â€¢ Performance â€¢ Design â€¢ Web Systems",   summary:     "Growth, Performance Marketing, Design & Web Systemsâ€”Meta/Google ads, SEO, analytics & tracking (Pixel/UTM), premium content/video, WordPress+Elementor, and MySQL-based workflows. I build conversion-ready digital engines for scale.",   location: "Dubai, UAE",   siteUrl: "https://muhammed-mubashir-v.netlify.app",   email: "mubaan74@gmail.com",   links: {     whatsapp: "https://wa.me/971529144135",     email: "mailto:mubaan74@gmail.com",     instagram: "https://instagram.com/mubaa.n",     instagramHandle: "@mubaa.n",   },   whatsappDisplay: "+971 52 914 4135",   whatsappUrl: "https://wa.me/971529144135",   instagram: [{ label: "@mubaa.n", href: "https://instagram.com/mubaa.n" }],   primaryCtas: [     { label: "Message on WhatsApp", href: "https://wa.me/971529144135" },     { label: "Send Email", href: "mailto:mubaan74@gmail.com" },   ],   languages: [     { language: "English", proficiency: "Fluent" },     { language: "Hindi", proficiency: "Fluent" },     { language: "Arabic", proficiency: "Read & Write" },     { language: "Malayalam", proficiency: "Native" },   ],   impactMetrics: [     { value: "600+", label: "Verified leads", detail: "Generated in 6 months for real estate campaigns." },     { value: "2,000+", label: "Monthly traffic growth", detail: "Lift from SEO and content performance systems." },     { value: "5+", label: "Brands managed", detail: "Governed channel consistency, tracking, and reporting." },   ],   capabilities: [     {       title: "Growth Strategy & Performance",       description: "Campaign architecture, creative testing loops, and channel-level budget controls.",     },     {       title: "Tracking, Analytics & Reporting",       description: "Pixel/event mapping, UTMs, lead-quality diagnostics, and executive-ready reporting.",     },     {       title: "Web Systems & Conversion Flows",       description: "WordPress and landing systems designed for speed, clarity, and lead qualification.",     },   ],   finalCta: {     title: "Ready for an operator-led growth system?",     description: "Share your funnel goals and constraints. I'll return a focused rollout plan.",   },   aboutNarrative: [     "I work at the intersection of digital operations, growth marketing, and content systems for businesses that need reliable outcomes and clean execution.",     "My focus is building practical systems: lead funnels, creative pipelines, tracking frameworks, and reporting standards that can scale across teams.",   ], }; | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\data\projects.ts

`"
   = export type Project = {   slug: string;   title: string;   category: string;   client: string;   period: string;   featured: boolean;   overview: string;   problem: string;   approach: string;   deliverables: string[];   results: string[];   tools: string[]; };  export const projects: Project[] = [   {     slug: "180-degree-meal-planner",     title: "180 Degree - Healthy Meal Plans + Web App Plugin",     category: "Web App / Growth Ops",     client: "180 Degree",     period: "2025",     featured: true,     overview:       "Built a structured meal-planner system with plugin workflows and operational controls for plan management.",     problem:       "The team needed a custom workflow to manage meal plans, user interactions, and internal updates without relying on fragmented tools.",     approach:       "Designed a plugin-led workflow with role-specific operations, practical admin UX, and measurable user actions tied to campaign traffic.",     deliverables: [       "Workflow-mapped WordPress plugin logic",       "Custom MySQL table structures for operational data",       "Landing and onboarding improvements connected to campaigns",       "Tracking hooks for form and CTA behaviors",     ],     results: [       "Faster internal handling of meal-plan operations",       "Clearer campaign-to-conversion visibility",       "Better continuity between ad traffic and product usage",     ],     tools: [       "WordPress",       "Elementor",       "MySQL custom tables",       "VS Code",       "AI-assisted development",       "Meta Business Suite",     ],   },   {     slug: "bluemark-real-estate-leadgen",     title: "bluemark Real Estate - Luxury Lead Gen System",     category: "Performance Marketing",     client: "bluemark Real Estate Dubai",     period: "Jan 2025 - Jul 2025",     featured: true,     overview:       "Developed a real-estate lead engine using creative testing, segmented audience strategy, and WhatsApp-first follow-up flows.",     problem:       "The business required stable lead volume with tighter quality controls across multiple target markets.",     approach:       "Launched full-funnel Meta campaigns for UAE, UK, and India audiences, then iterated landing and form UX based on lead quality signals.",     deliverables: [       "Audience architecture (custom data, lookalike, and interest sets)",       "Landing pages and lead-form optimization",       "WhatsApp-integrated follow-up funnel",       "Creative testing pipeline with performance reporting",     ],     results: [       "600+ verified quality leads in 6 months",       "Stronger lead qualification before sales contact",       "Improved conversion continuity from ad click to WhatsApp",     ],     tools: ["Meta Ads Manager", "Canva", "Premiere Pro", "Sheets automation", "WhatsApp workflows"],   },   {     slug: "multi-company-digital-ops",     title: "Multi-Company Digital Ops",     category: "Digital Operations",     client: "Emirati Owned Companies",     period: "Jul 2025 - Jan 2026",     featured: true,     overview:       "Operated a multi-brand digital stack covering websites, social channels, ads, tracking, reporting, and governance standards.",     problem:       "Parallel business units had inconsistent execution quality, reporting logic, and tracking setup.",     approach:       "Implemented shared operating standards for campaign planning, creative production, event tracking, and weekly reporting reviews.",     deliverables: [       "Cross-brand governance framework",       "WordPress and funnel optimization playbooks",       "Pixel, event, and UTM tracking architecture",       "Weekly and monthly reporting templates",     ],     results: [       "Higher consistency across brand channels",       "Faster debugging and campaign decisions",       "Improved lead-flow reliability with cleaner attribution",     ],     tools: ["WordPress", "Elementor", "Meta Ads Manager", "Google Analytics", "Tag configuration"],   },   {     slug: "raslan-bc-growth",     title: "Raslan BC - Construction/Fit-out Growth",     category: "Brand + Funnel Systems",     client: "Raslan Building Contracting",     period: "2025",     featured: false,     overview:       "Strengthened construction/fits-out demand generation through messaging clarity, portfolio storytelling, and lead-path simplification.",     problem:       "The market-facing brand lacked a clear growth narrative aligned with project proof and offer differentiation.",     approach:       "Created campaign narratives and content structures focused on trust signals, delivery confidence, and inquiry qualification.",     deliverables: [       "Positioning-aligned campaign messaging",       "Portfolio presentation templates",       "Lead-path refinements for site and social channels",     ],     results: [       "Improved quality of inbound inquiries",       "More coherent brand story across channels",     ],     tools: ["Content systems", "Landing page UX", "Creative templates"],   },   {     slug: "raslan-media-content-performance",     title: "Raslan Media - Content System + Performance",     category: "Content Operations",     client: "Raslan Media",     period: "2025",     featured: false,     overview:       "Built repeatable content and campaign workflows to support regular publishing and measurable growth loops.",     problem:       "Content production was inconsistent and difficult to scale while maintaining quality standards.",     approach:       "Defined a production cadence, modular asset templates, and campaign review rituals to tighten execution quality.",     deliverables: [       "Content calendar operations model",       "Reusable design and copy templates",       "Performance feedback loops for content variants",     ],     results: [       "More predictable publishing output",       "Higher reuse of winning creative patterns",     ],     tools: ["Canva", "Premiere Pro", "Meta Business Suite", "Reporting dashboards"],   }, ]; | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\data\skills.ts

`"
   = export type SkillGroup = {   title: string;   items: string[]; };  export const skillGroups: SkillGroup[] = [   {     title: "Growth & Brand Strategy",     items: ["Growth planning", "Offer positioning", "Campaign architecture", "Multi-brand execution"],   },   {     title: "Paid Ads",     items: ["Meta Ads Manager", "Google Ads", "TikTok Ads Manager", "Creative testing frameworks"],   },   {     title: "Tracking & Analytics",     items: ["Pixel and event mapping", "Tag setup", "UTM governance", "Dashboard reporting"],   },   {     title: "Web",     items: ["WordPress", "Elementor", "Landing pages", "Conversion-focused UX"],   },   {     title: "Web App / Plugin",     items: ["Plugin workflows", "MySQL basics", "Custom table logic", "Operational tooling"],   },   {     title: "Content & Design",     items: ["Canva", "Premiere Pro", "Creative templates", "Brand kit systems"],   },   {     title: "CRM/Automation + Email",     items: ["Lead routing", "Automation logic", "Follow-up systems", "Email campaign operations"],   },   {     title: "Copywriting",     items: ["Ad copy", "Landing copy", "Captions", "Performance CTAs"],   }, ];  export const toolsStack: string[] = [   "Meta Ads Manager",   "Google Analytics",   "Google Search Console",   "WordPress",   "Elementor",   "Canva",   "Premiere Pro",   "VS Code", ]; | Select-Object -First 2000
  WriteLine ( -join 


---


## FILE: site\src\data\testimonials.ts

`"
   = export type Testimonial = {   quote: string;   name: string;   role: string;   company: string; };  export type TestimonialsContent = {   entries: Testimonial[];   requestLine: string; };  export const testimonials: TestimonialsContent = {   entries: [     {       quote:         "Execution quality improved quickly once the funnel, creatives, and reporting were aligned under one operating rhythm.",       name: "Placeholder Client",       role: "Commercial Director",       company: "Regional Services Group",     },     {       quote:         "Campaign decisions became easier because tracking and lead-quality signals were finally consistent across teams.",       name: "Placeholder Stakeholder",       role: "Marketing Head",       company: "Growth Portfolio",     },   ],   requestLine: "Request a formal testimonial package or references during the discovery call.", }; | Select-Object -First 2000
  WriteLine ( -join 


# PUBLIC ASSETS NOTE


- CV file should be at: site/public/resume.pdf (served as /resume.pdf)



DONE. Snapshot saved to: PROJECT_SNAPSHOT_FOR_CLAUDE.md

