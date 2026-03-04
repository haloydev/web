import type { APIRoute } from 'astro';

const PLAUSIBLE_EVENT_URL = 'https://plausible.io/api/event';
export const prerender = false;

const handler: APIRoute = async ({ request }) => {
  const headers = new Headers(request.headers);
  headers.delete('cookie');

  const upstream = await fetch(PLAUSIBLE_EVENT_URL, {
    body: request.body,
    headers,
    method: request.method,
    redirect: 'manual',
  });

  return new Response(upstream.body, {
    headers: upstream.headers,
    status: upstream.status,
    statusText: upstream.statusText,
  });
};

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
