import type { APIRoute } from "astro";

import { renderStoryPng } from "../../lib/og/story";

export const prerender = true;

export const GET: APIRoute = async () => {
  const pngBuffer = await renderStoryPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
};
