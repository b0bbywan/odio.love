export type Tier = 'core' | 'internal';

export interface Repo {
  name: string;
  label: string;
  desc: string;
  url: string;
  live: string | null;
  tech: { label: string; color: string };
  tier: Tier;
}

export const repos: Repo[] = [
  {
    name: 'go-odio-api',
    label: 'Core REST API',
    desc: 'The brain. A REST + SSE control surface over the odio stack, with an embedded web UI.',
    url: 'https://github.com/b0bbywan/go-odio-api',
    live: null,
    tech: { label: 'Go', color: '#00ADD8' },
    tier: 'core',
  },
  {
    name: 'odios',
    label: 'Installer',
    desc: 'Pre-built Pi images, one-line installer, in-place upgrades. The CI backbone behind every odio release.',
    url: 'https://github.com/b0bbywan/odios',
    live: null,
    tech: { label: 'Ansible', color: '#EE0000' },
    tier: 'core',
  },
  {
    name: 'odio-pwa',
    label: 'Web app',
    desc: 'Progressive Web App. Install from your browser, manage all your odio nodes from one place.',
    url: 'https://github.com/b0bbywan/odio-pwa',
    live: 'https://pwa.odio.love/',
    tech: { label: 'Svelte', color: '#FF3E00' },
    tier: 'core',
  },
  {
    name: 'odio-ha',
    label: 'Home Assistant',
    desc: 'Home Assistant integration. Complete odio support with native HA entities.',
    url: 'https://github.com/b0bbywan/odio-ha',
    live: null,
    tech: { label: 'Python', color: '#3776AB' },
    tier: 'core',
  },
  {
    name: 'go-mpd-discplayer',
    label: 'CD / USB player',
    desc: 'CD and USB auto-play daemon with metadata.',
    url: 'https://github.com/b0bbywan/go-mpd-discplayer',
    live: null,
    tech: { label: 'Go', color: '#00ADD8' },
    tier: 'core',
  },
  {
    name: 'go-disc-cuer',
    label: 'CUE library',
    desc: 'Disc metadata fetcher behind CD auto-play.',
    url: 'https://github.com/b0bbywan/go-disc-cuer',
    live: null,
    tech: { label: 'Go', color: '#00ADD8' },
    tier: 'internal',
  },
  {
    name: 'go-odio-notify',
    label: 'Notify library',
    desc: 'Audio notification library and CLI. Sound feedback for system events across the odio stack.',
    url: 'https://github.com/b0bbywan/go-odio-notify',
    live: null,
    tech: { label: 'Go', color: '#00ADD8' },
    tier: 'internal',
  },
  {
    name: 'snapclientmpris',
    label: 'MPRIS bridge',
    desc: 'Snapcast client metadata and playback controls, exposed to your audio remote.',
    url: 'https://github.com/b0bbywan/snapclientmpris',
    live: null,
    tech: { label: 'Python', color: '#3776AB' },
    tier: 'internal',
  },
  {
    name: 'odio-apt-repo',
    label: 'APT repository',
    desc: 'How every release ships as a Debian package. Fully CI-driven.',
    url: 'https://github.com/b0bbywan/odio-apt-repo',
    live: null,
    tech: { label: 'GitHub Actions', color: '#2088FF' },
    tier: 'internal',
  },
  {
    name: 'odio-mympd',
    label: 'myMPD packager',
    desc: 'myMPD packaged for the odio apt repo, kept in sync with upstream.',
    url: 'https://github.com/b0bbywan/odio-mympd',
    live: null,
    tech: { label: 'GitHub Actions', color: '#2088FF' },
    tier: 'internal',
  },
  {
    name: 'odio-docs',
    label: 'Documentation',
    desc: 'The documentation site. Guides, API reference, and everything you need to get started or go deeper.',
    url: 'https://github.com/b0bbywan/odio-docs',
    live: 'https://docs.odio.love/',
    tech: { label: 'Astro', color: '#FF5D01' },
    tier: 'core',
  },
  {
    name: 'odio.love',
    label: 'Landing site',
    desc: "This site you're looking at.",
    url: 'https://github.com/b0bbywan/odio.love',
    live: 'https://odio.love/',
    tech: { label: 'Astro', color: '#FF5D01' },
    tier: 'internal',
  },
];
