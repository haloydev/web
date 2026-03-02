import type { APIRoute } from 'astro';

export const prerender = false;

interface NewsletterRequest {
  email: string;
  turnstile_token: string;
  honeypot: string;
  timestamp: number;
}

export const POST: APIRoute = async ({ request }) => {
  let body: NewsletterRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, turnstile_token, honeypot, timestamp } = body;

  if (!email || !turnstile_token) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (honeypot) {
    return Response.json({ error: 'Bot detected' }, { status: 422 });
  }

  if (Date.now() - timestamp < 2000) {
    return Response.json({ error: 'Submitted too quickly' }, { status: 422 });
  }

  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: turnstileSecret,
      response: turnstile_token,
    }),
  });

  const turnstileData = await turnstileRes.json();
  if (!turnstileData.success) {
    return Response.json({ error: 'Turnstile verification failed' }, { status: 422 });
  }

  const apiKey = import.meta.env.EMAILOCTOPUS_API_KEY;
  const listId = import.meta.env.EMAILOCTOPUS_LIST_ID;

  const eoRes = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      email_address: email,
      status: 'PENDING',
    }),
  });

  if (!eoRes.ok) {
    const eoData = await eoRes.json();
    if (eoData?.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
      return Response.json({ error: 'This email is already subscribed.' }, { status: 409 });
    }
    return Response.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }

  return Response.json({ success: true });
};
