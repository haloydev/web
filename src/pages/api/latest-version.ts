import type { APIRoute } from 'astro';

export const prerender = false;

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/haloydev/haloy/releases?per_page=10';
const RELEASES_FALLBACK_URL = 'https://github.com/haloydev/haloy/releases';
const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

type Runtime = {
  env?: Record<string, string | undefined>;
};

type GitHubRelease = {
  tag_name?: unknown;
  html_url?: unknown;
  published_at?: unknown;
  draft?: unknown;
};

type LatestVersion = {
  version: string;
  tagName: string;
  url: string;
  publishedAt: string;
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

function toLatestVersion(releases: GitHubRelease[]): LatestVersion | null {
  const release = releases
    .filter((item) => item.draft !== true && typeof item.tag_name === 'string' && typeof item.published_at === 'string')
    .sort((a, b) => {
      const aTime = Date.parse(a.published_at as string);
      const bTime = Date.parse(b.published_at as string);
      return bTime - aTime;
    })[0];

  if (!release || typeof release.tag_name !== 'string' || typeof release.published_at !== 'string') {
    return null;
  }

  const tagName = release.tag_name;
  const url = typeof release.html_url === 'string' ? release.html_url : `${RELEASES_FALLBACK_URL}/tag/${tagName}`;

  return {
    version: tagName.startsWith('v') ? tagName.slice(1) : tagName,
    tagName,
    url,
    publishedAt: release.published_at,
  };
}

async function fetchLatestVersion(githubToken?: string) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'haloy-web',
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(GITHUB_RELEASES_URL, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  const releases = await response.json();

  if (!Array.isArray(releases)) {
    throw new Error('GitHub API returned an invalid release list');
  }

  const latest = toLatestVersion(releases);
  if (!latest) {
    throw new Error('No published Haloy release found');
  }

  return latest;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const cacheKey = new Request(request.url, { method: 'GET' });
  const cache = typeof caches !== 'undefined' ? caches.default : undefined;
  const cached = await cache?.match(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const runtime = (locals.runtime ?? {}) as Runtime;
    const latest = await fetchLatestVersion(runtime.env?.GITHUB_TOKEN);
    const response = jsonResponse(latest, {
      headers: {
        'cache-control': CACHE_CONTROL,
      },
    });

    await cache?.put(cacheKey, response.clone());

    return response;
  } catch (error) {
    console.error('Failed to fetch latest Haloy version:', error);

    return jsonResponse(
      { error: 'Latest Haloy version unavailable' },
      {
        status: 503,
        headers: {
          'cache-control': 'no-store',
        },
      },
    );
  }
};
