import type { APIRoute } from 'astro';
import { repos } from '../data/repos';
import {
  buildScope,
  buildSelfUrl,
  ownerRepo,
  releasesToEntries,
  renderAtom,
  resolveSelection,
  selectEntries,
  type FeedOptions,
  type GhRelease,
} from '../lib/feed';

// Runs on-demand as a Vercel function so the feed reflects live GitHub data.
export const prerender = false;

const SITE = 'https://odio.love';
const FEED_URL = `${SITE}/releases.xml`;
// Per-repo fetch cap before filtering; generous so a pre-release burst can't
// bury the latest stable.
const PER_REPO = 30;
const MAX_ENTRIES = 40; // cap on the merged feed
const CACHE_SECONDS = 12 * 60 * 60; // 12h shared CDN cache: GitHub is hit once per window

// Every repo is fetched on every request, then filtered in-memory, so query
// params never change the upstream fetch set, only what we keep. Fetching the
// full list (not just feed/internal) is what lets ?repos= select any known
// repo, e.g. odio-docs, independent of the default gating.
const CANDIDATES = repos;

async function fetchReleases(url: string, token?: string): Promise<GhRelease[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'odio.love-releases-feed',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/repos/${ownerRepo(url)}/releases?per_page=${PER_REPO}`,
    { headers },
  );
  if (!res.ok) return [];
  return (await res.json()) as GhRelease[];
}

export const GET: APIRoute = async ({ url }) => {
  const opts: FeedOptions = {
    includePrerelease: url.searchParams.get('prerelease') === 'true',
    includeInternal: url.searchParams.get('internal') === 'true',
    selection: resolveSelection(url.searchParams.get('repos'), repos),
  };

  // Read at runtime (Vercel function env) with a build-time fallback. Optional:
  // the 12h CDN cache keeps GitHub calls well under the unauthenticated limit.
  const token =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
      ?.GITHUB_TOKEN ?? (import.meta.env.GITHUB_TOKEN as string | undefined);

  // Fetch the full candidate list once, then filter in-memory.
  const perRepo = await Promise.all(
    CANDIDATES.map(async (repo) =>
      releasesToEntries(await fetchReleases(repo.url, token), repo),
    ),
  );

  const entries = selectEntries(perRepo.flat(), opts, MAX_ENTRIES);
  const updated = entries[0]?.published ?? new Date().toISOString();

  const xml = renderAtom({
    site: SITE,
    feedUrl: FEED_URL,
    selfUrl: buildSelfUrl(FEED_URL, opts),
    scope: buildScope(opts),
    updated,
    entries,
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
    },
  });
};
