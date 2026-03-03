import type { APIRoute } from 'astro';

export const prerender = false;

interface NewsletterRequest {
  email: string;
  turnstile_token: string;
  honeypot: string;
  timestamp: number;
}

interface TurnstileVerificationResponse {
  success: boolean;
  hostname?: string;
  'error-codes'?: string[];
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

  if (typeof timestamp !== 'number') {
    return Response.json({ error: 'Invalid timestamp' }, { status: 400 });
  }

  if (honeypot) {
    return Response.json({ error: 'Bot detected' }, { status: 422 });
  }

  if (Date.now() - timestamp < 2000) {
    return Response.json({ error: 'Submitted too quickly' }, { status: 422 });
  }

  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return Response.json({ error: 'Newsletter service misconfigured' }, { status: 500 });
  }

  const ipHeader = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  const remoteIp = ipHeader.split(',')[0]?.trim();

  let turnstileData: TurnstileVerificationResponse;
  try {
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstile_token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });

    if (!turnstileRes.ok) {
      return Response.json({ error: 'Turnstile verification unavailable' }, { status: 503 });
    }

    turnstileData = await turnstileRes.json();
  } catch {
    return Response.json({ error: 'Turnstile verification unavailable' }, { status: 503 });
  }

  const expectedHostname = new URL(request.url).hostname;
  if (!turnstileData.success || (turnstileData.hostname && turnstileData.hostname !== expectedHostname)) {
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
