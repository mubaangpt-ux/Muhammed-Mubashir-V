import type { APIRoute } from "astro";

import { renderHomeOgPng } from "../../lib/og/home";

export const prerender = true;

export const GET: APIRoute = async () => {
  const pngBuffer = await renderHomeOgPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
};
