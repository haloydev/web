# Haloy website

## Newsletter setup

The newsletter form (`/newsletter`) uses a custom React component that posts to a server-side API endpoint (`/api/newsletter`). The endpoint verifies a Cloudflare Turnstile token, then creates a contact in EmailOctopus with `PENDING` status (double opt-in).

Required environment variables (set in Cloudflare Pages dashboard):

```bash
PUBLIC_TURNSTILE_SITE_KEY="..."
TURNSTILE_SECRET_KEY="..."
EMAILOCTOPUS_API_KEY="..."
EMAILOCTOPUS_LIST_ID="..."
```

For local dev, the `.env` file contains Cloudflare's always-pass test keys.
