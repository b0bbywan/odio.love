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
    desc: 'The core. REST API + embedded web UI. Bridges systemd, PulseAudio, MPRIS, D-Bus and Bluetooth. The engine that makes everything else possible.',
    url: 'https://github.com/b0bbywan/go-odio-api',
    live: null,
    tech: { label: 'Go', color: '#00ADD8' },
    tier: 'core',
  },
  {
    name: 'odios',
    label: 'Installer',
    desc: 'The installer and service orchestrator. One script, full stack — MPD, Snapcast, Shairport Sync, upmpdcli, and all glue between them.',
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
    desc: 'Go library for CUE sheet. The metadata backbone behind go-mpd-discplayer, via GnuDB and MusicBrainz.',
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
    desc: 'MPRIS2 D-Bus bridge for the local Snapcast client. Surfaces stream metadata and forwards playback controls (Play/Pause/Next/Previous) to the snapserver source.',
    url: 'https://github.com/b0bbywan/snapclientmpris',
    live: null,
    tech: { label: 'Python', color: '#3776AB' },
    tier: 'internal',
  },
  {
    name: 'odio-apt-repo',
    label: 'APT repository',
    desc: 'The apt repository. Fully CI-maintained. Packages are built and published automatically on every release.',
    url: 'https://github.com/b0bbywan/odio-apt-repo',
    live: null,
    tech: { label: 'GitHub Actions', color: '#2088FF' },
    tier: 'internal',
  },
  {
    name: 'odio-mympd',
    label: 'myMPD packager',
    desc: 'CI-only myMPD packager. A daily cron polls jcorporation/myMPD; new upstream releases trigger per-arch cross-compiles and publish .deb artifacts ingested by the apt repo.',
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
    desc: 'This site. Static Astro build, deployed to Vercel.',
    url: 'https://github.com/b0bbywan/odio.love',
    live: 'https://odio.love/',
    tech: { label: 'Astro', color: '#FF5D01' },
    tier: 'internal',
  },
];
