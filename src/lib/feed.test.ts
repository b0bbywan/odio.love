import { describe, it, expect } from 'vitest';
import {
  buildScope,
  buildSelfUrl,
  escapeXml,
  ownerRepo,
  releasesToEntries,
  renderAtom,
  renderMarkdown,
  resolveSelection,
  selectEntries,
  type Entry,
  type FeedOptions,
  type GhRelease,
} from './feed';

const KNOWN = [
  { name: 'go-odio-api' },
  { name: 'odios' },
  { name: 'odio-ha' },
  { name: 'snapclientmpris' },
  { name: 'mpDris2' },
  { name: 'odio-docs' },
];

function rel(over: Partial<GhRelease> = {}): GhRelease {
  return {
    tag_name: 'v1.0.0',
    name: 'v1.0.0',
    html_url: 'https://github.com/b0bbywan/odios/releases/tag/v1.0.0',
    body: 'notes',
    published_at: '2026-01-01T00:00:00Z',
    prerelease: false,
    draft: false,
    ...over,
  };
}

function entry(over: Partial<Entry> = {}): Entry {
  return {
    repo: 'odios',
    tag: 'v1',
    title: 'odios v1',
    url: 'https://example/v1',
    body: 'b',
    published: '2026-01-01T00:00:00Z',
    prerelease: false,
    feed: true,
    internal: false,
    ...over,
  };
}

function opts(over: Partial<FeedOptions> = {}): FeedOptions {
  return { includePrerelease: false, includeInternal: false, selection: [], ...over };
}

describe('escapeXml', () => {
  it('escapes the XML-significant characters', () => {
    expect(escapeXml('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;');
  });

  it('escapes & first so other escapes are not double-encoded', () => {
    expect(escapeXml('<')).toBe('&lt;');
    expect(escapeXml('&lt;')).toBe('&amp;lt;');
  });

  it('leaves plain text untouched', () => {
    expect(escapeXml('release v1.2.3')).toBe('release v1.2.3');
  });
});

describe('ownerRepo', () => {
  it('extracts owner/repo from a github URL', () => {
    expect(ownerRepo('https://github.com/b0bbywan/odio-ha')).toBe('b0bbywan/odio-ha');
  });

  it('trims surrounding slashes', () => {
    expect(ownerRepo('https://github.com/b0bbywan/odios/')).toBe('b0bbywan/odios');
  });
});

describe('resolveSelection', () => {
  it('returns [] for null or empty input', () => {
    expect(resolveSelection(null, KNOWN)).toEqual([]);
    expect(resolveSelection('', KNOWN)).toEqual([]);
  });

  it('resolves known names and preserves order', () => {
    expect(resolveSelection('odio-ha,odios', KNOWN)).toEqual(['odio-ha', 'odios']);
  });

  it('matches case-insensitively to the canonical name', () => {
    expect(resolveSelection('mpdris2', KNOWN)).toEqual(['mpDris2']);
    expect(resolveSelection('MPDRIS2', KNOWN)).toEqual(['mpDris2']);
  });

  it('tolerates surrounding whitespace', () => {
    expect(resolveSelection(' odio-ha , odios ', KNOWN)).toEqual(['odio-ha', 'odios']);
  });

  it('drops unknown names (whitelist) while keeping valid ones', () => {
    expect(resolveSelection('torvalds/linux,nope,odio-ha', KNOWN)).toEqual(['odio-ha']);
  });

  it('returns [] when every name is invalid', () => {
    expect(resolveSelection('torvalds/linux,nope', KNOWN)).toEqual([]);
  });
});

describe('releasesToEntries', () => {
  const repo = { name: 'odios', feed: true, tier: 'core' as const };

  it('drops drafts and unpublished releases', () => {
    const out = releasesToEntries(
      [rel(), rel({ draft: true }), rel({ published_at: null })],
      repo,
    );
    expect(out).toHaveLength(1);
  });

  it('falls back to the tag when the release name is empty', () => {
    expect(releasesToEntries([rel({ name: null, tag_name: 'v2' })], repo)[0].title).toBe('odios v2');
    expect(releasesToEntries([rel({ name: '   ', tag_name: 'v3' })], repo)[0].title).toBe('odios v3');
  });

  it('normalises a null body to an empty string', () => {
    expect(releasesToEntries([rel({ body: null })], repo)[0].body).toBe('');
  });

  it('derives feed/internal flags from the repo', () => {
    const core = releasesToEntries([rel()], { name: 'odios', feed: true, tier: 'core' })[0];
    expect(core).toMatchObject({ feed: true, internal: false });
    const intern = releasesToEntries([rel()], { name: 'snapclientmpris', feed: true, tier: 'internal' })[0];
    expect(intern).toMatchObject({ feed: true, internal: true });
    const ungated = releasesToEntries([rel()], { name: 'odio-docs', tier: 'core' })[0];
    expect(ungated).toMatchObject({ feed: false, internal: false });
  });
});

describe('selectEntries', () => {
  const feedEntry = entry({ repo: 'odios', feed: true, internal: false });
  const ungatedEntry = entry({ repo: 'odio-docs', feed: false, internal: false });
  const internalNonFeed = entry({ repo: 'odio-mympd', feed: false, internal: true });

  it('keeps feed repos and drops ungated repos by default', () => {
    const out = selectEntries([feedEntry, ungatedEntry], opts(), 40);
    expect(out.map((e) => e.repo)).toEqual(['odios']);
  });

  it('adds internal-tier repos only when includeInternal is set', () => {
    expect(selectEntries([internalNonFeed], opts(), 40)).toHaveLength(0);
    expect(selectEntries([internalNonFeed], opts({ includeInternal: true }), 40)).toHaveLength(1);
  });

  it('lets an explicit selection override the gating', () => {
    const out = selectEntries([feedEntry, ungatedEntry], opts({ selection: ['odio-docs'] }), 40);
    expect(out.map((e) => e.repo)).toEqual(['odio-docs']);
  });

  it('drops pre-releases by default and keeps them with includePrerelease', () => {
    const pre = entry({ prerelease: true });
    expect(selectEntries([pre], opts(), 40)).toHaveLength(0);
    expect(selectEntries([pre], opts({ includePrerelease: true }), 40)).toHaveLength(1);
  });

  it('sorts newest-first and caps to maxEntries', () => {
    const a = entry({ repo: 'a', published: '2026-01-01T00:00:00Z' });
    const b = entry({ repo: 'b', published: '2026-03-01T00:00:00Z' });
    const c = entry({ repo: 'c', published: '2026-02-01T00:00:00Z' });
    const out = selectEntries([a, b, c], opts(), 2);
    expect(out.map((e) => e.repo)).toEqual(['b', 'c']);
  });

  it('falls back to gating when the selection is empty', () => {
    const out = selectEntries([feedEntry, ungatedEntry], opts({ selection: [] }), 40);
    expect(out.map((e) => e.repo)).toEqual(['odios']);
  });
});

describe('buildScope', () => {
  it('labels the channel', () => {
    expect(buildScope(opts())).toBe('stable');
    expect(buildScope(opts({ includePrerelease: true }))).toBe('all channels');
  });

  it('notes included internal repos', () => {
    expect(buildScope(opts({ includeInternal: true }))).toBe('stable, incl. internal');
  });

  it('lists a selection and lets it override internal', () => {
    expect(buildScope(opts({ selection: ['odio-ha', 'odios'] }))).toBe('stable, repos: odio-ha, odios');
    expect(buildScope(opts({ includeInternal: true, selection: ['odio-ha'] }))).toBe(
      'stable, repos: odio-ha',
    );
  });
});

describe('buildSelfUrl', () => {
  const base = 'https://odio.love/releases.xml';

  it('returns the bare URL with no params', () => {
    expect(buildSelfUrl(base, opts())).toBe(base);
  });

  it('encodes the active params', () => {
    expect(buildSelfUrl(base, opts({ includePrerelease: true }))).toBe(`${base}?prerelease=true`);
    expect(buildSelfUrl(base, opts({ includeInternal: true }))).toBe(`${base}?internal=true`);
  });

  it('uses repos and omits internal when a selection is active', () => {
    expect(buildSelfUrl(base, opts({ includeInternal: true, selection: ['odio-ha', 'odios'] }))).toBe(
      `${base}?repos=odio-ha%2Codios`,
    );
  });
});

describe('renderMarkdown', () => {
  it('renders common Markdown to HTML', () => {
    expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>');
    expect(renderMarkdown('## Title')).toContain('<h2');
    expect(renderMarkdown('- a\n- b')).toContain('<li>a</li>');
    expect(renderMarkdown('[x](https://e.test)')).toContain('href="https://e.test"');
  });

  it('returns an empty string for an empty body', () => {
    expect(renderMarkdown('')).toBe('');
  });
});

describe('renderAtom', () => {
  const xml = renderAtom({
    site: 'https://odio.love',
    feedUrl: 'https://odio.love/releases.xml',
    selfUrl: 'https://odio.love/releases.xml',
    scope: 'stable',
    updated: '2026-01-01T00:00:00Z',
    entries: [
      entry({ repo: 'odios', title: 'odios v1', body: 'Fixes **bold** and a [link](https://x.test).' }),
      entry({ repo: 'mpDris2', title: 'mpDris2 v0.11.0', prerelease: true }),
    ],
  });

  it('produces a well-formed Atom envelope', () => {
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<title>odio releases (stable)</title>');
    expect(xml.match(/<entry>/g)).toHaveLength(2);
  });

  it('renders Markdown bodies to HTML, escaped for transport in type="html"', () => {
    // Markdown is rendered to HTML, then the HTML is entity-escaped so the
    // reader decodes it once and renders it (no raw ** or ## leaking through).
    expect(xml).toContain('&lt;strong&gt;bold&lt;/strong&gt;');
    expect(xml).not.toContain('**bold**');
  });

  it('flags pre-release entries in the title', () => {
    expect(xml).toContain('<title>mpDris2 v0.11.0 (pre-release)</title>');
    expect(xml).toContain('<category term="mpDris2"/>');
  });
});
