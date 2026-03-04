import type { APIRoute } from 'astro';

const PLAUSIBLE_SCRIPT_URL = 'https://plausible.io/js/pa-VlDKar7AJzBBxfg-vXhrp.js';
export const prerender = false;

export const GET: APIRoute = async () => {
  const upstream = await fetch(PLAUSIBLE_SCRIPT_URL, {
    headers: {
      Accept: 'application/javascript,text/javascript,*/*;q=0.1',
    },
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.set('cache-control', 'public, max-age=3600, s-maxage=3600');

  return new Response(upstream.body, {
    headers: responseHeaders,
    status: upstream.status,
    statusText: upstream.statusText,
  });
};
