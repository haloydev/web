const GITHUB_API_URL = 'https://api.github.com/repos/haloydev/haloy/releases';
const OUTPUT_PATH = new URL('../src/data/version.json', import.meta.url);

async function fetchLatestVersion() {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'haloy-web-build',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const releases = await response.json();

  if (!releases.length) {
    throw new Error('No releases found');
  }

  const tagName = releases[0].tag_name;
  const version = tagName.startsWith('v') ? tagName.slice(1) : tagName;

  return version;
}

async function main() {
  const version = await fetchLatestVersion();
  const { writeFile } = await import('node:fs/promises');

  await writeFile(OUTPUT_PATH, JSON.stringify({ version }, null, 2) + '\n');

  console.log(`Wrote version ${version} to src/data/version.json`);
}

main().catch((error) => {
  console.error('Failed to fetch version:', error.message);
  process.exit(1);
});
