// Pure, side-effect-free logic for the aggregated releases feed. The HTTP
// endpoint (src/pages/releases.xml.ts) owns the network I/O and wiring; this
// module owns everything testable: parsing, filtering, and rendering.

import { marked } from 'marked';

export interface GhRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  body: string | null;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
}

export interface Entry {
  repo: string;
  tag: string;
  title: string;
  url: string;
  body: string;
  published: string;
  prerelease: boolean;
  feed: boolean;
  internal: boolean;
}

export interface FeedOptions {
  includePrerelease: boolean;
  includeInternal: boolean;
  /** Resolved, whitelisted repo names. Non-empty means a custom ?repos= feed. */
  selection: string[];
}

/** Minimal shape of a repo this module needs (decoupled from the full Repo). */
type RepoRef = { name: string; feed?: boolean; tier: 'core' | 'internal' };

/** Escape the five XML-significant characters for use in text/attributes. */
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Parse `owner/repo` out of a github.com URL. */
export function ownerRepo(url: string): string {
  return new URL(url).pathname.replace(/^\/+|\/+$/g, '');
}

/**
 * Render Markdown release notes to HTML so feed readers show formatted notes
 * instead of raw `##`/`**`/`-` markup. Bodies come only from the project's own
 * GitHub releases (a trusted author), so the output is not further sanitized.
 */
export function renderMarkdown(md: string): string {
  return md ? marked.parse(md, { gfm: true, async: false }) : '';
}

/**
 * Resolve a `?repos=a,b,c` value to canonical repo names, matched
 * case-insensitively against the whitelist of known repos. Unknown names are
 * dropped: only repos present in `repos` can ever be selected, so the endpoint
 * can never be coerced into fetching arbitrary GitHub repositories.
 */
export function resolveSelection(
  param: string | null,
  repos: readonly { name: string }[],
): string[] {
  const known = new Map(repos.map((r) => [r.name.toLowerCase(), r.name]));
  return (param ?? '')
    .split(',')
    .map((n) => known.get(n.trim().toLowerCase()))
    .filter((n): n is string => Boolean(n));
}

/** Map a repo's GitHub releases to feed entries, dropping drafts/unpublished. */
export function releasesToEntries(releases: GhRelease[], repo: RepoRef): Entry[] {
  return releases
    .filter((r) => !r.draft && r.published_at)
    .map((r) => ({
      repo: repo.name,
      tag: r.tag_name,
      title: `${repo.name} ${r.name?.trim() || r.tag_name}`,
      url: r.html_url,
      body: r.body?.trim() || '',
      published: r.published_at as string,
      prerelease: r.prerelease,
      feed: !!repo.feed,
      internal: repo.tier === 'internal',
    }));
}

/**
 * Apply the feed's filtering rules and return the newest `maxEntries`:
 * a non-empty selection wins over the feed/internal gating, the prerelease
 * filter is orthogonal, and results are sorted newest-first.
 */
export function selectEntries(
  entries: Entry[],
  opts: FeedOptions,
  maxEntries: number,
): Entry[] {
  const useSelection = opts.selection.length > 0;
  const selected = new Set(opts.selection);
  return entries
    .filter((e) =>
      useSelection ? selected.has(e.repo) : e.feed || (opts.includeInternal && e.internal),
    )
    .filter((e) => opts.includePrerelease || !e.prerelease)
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, maxEntries);
}

/** Human-readable scope label for the feed title, e.g. "stable, incl. internal". */
export function buildScope(opts: FeedOptions): string {
  const useSelection = opts.selection.length > 0;
  return [
    opts.includePrerelease ? 'all channels' : 'stable',
    useSelection
      ? `repos: ${opts.selection.join(', ')}`
      : opts.includeInternal
        ? 'incl. internal'
        : null,
  ]
    .filter(Boolean)
    .join(', ');
}

/** Canonical self-link for the feed variant described by `opts`. */
export function buildSelfUrl(feedUrl: string, opts: FeedOptions): string {
  const useSelection = opts.selection.length > 0;
  const params = new URLSearchParams();
  if (opts.includePrerelease) params.set('prerelease', 'true');
  // An explicit selection overrides gating, so `internal` is meaningless then.
  if (useSelection) params.set('repos', opts.selection.join(','));
  else if (opts.includeInternal) params.set('internal', 'true');
  const qs = params.toString();
  return qs ? `${feedUrl}?${qs}` : feedUrl;
}

/** Render the Atom XML document for a resolved set of entries. */
export function renderAtom(opts: {
  site: string;
  feedUrl: string;
  selfUrl: string;
  scope: string;
  updated: string;
  entries: Entry[];
}): string {
  const { site, feedUrl, selfUrl, scope, updated, entries } = opts;
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>odio releases (${scope})</title>
  <subtitle>Aggregated GitHub releases across the odio ecosystem</subtitle>
  <link href="${escapeXml(selfUrl)}" rel="self"/>
  <link href="${site}/"/>
  <id>${feedUrl}</id>
  <updated>${updated}</updated>
${entries
  .map(
    (e) => `  <entry>
    <title>${escapeXml(e.title)}${e.prerelease ? ' (pre-release)' : ''}</title>
    <id>${escapeXml(e.url)}</id>
    <link href="${escapeXml(e.url)}"/>
    <updated>${e.published}</updated>
    <author><name>${escapeXml(e.repo)}</name></author>
    <category term="${escapeXml(e.repo)}"/>
    <content type="html">${escapeXml(renderMarkdown(e.body))}</content>
  </entry>`,
  )
  .join('\n')}
</feed>
`;
}
