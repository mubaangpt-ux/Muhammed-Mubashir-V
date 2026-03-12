import type { APIRoute } from "astro";

import { renderHomeOgJpeg } from "../../lib/og/home";

export const prerender = true;

export const GET: APIRoute = async () => {
  const jpegBuffer = await renderHomeOgJpeg();

  return new Response(jpegBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
};
