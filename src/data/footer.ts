export interface FooterLink {
  name: string;
  url: string;
}

export interface HostingLink extends FooterLink {
  label: string;
}

export const deps: FooterLink[] = [
  { name: 'Debian', url: 'https://www.debian.org/' },
  { name: 'MPD', url: 'https://www.musicpd.org/' },
  { name: 'PulseAudio', url: 'https://www.freedesktop.org/wiki/Software/PulseAudio/' },
  { name: 'Shairport Sync', url: 'https://github.com/mikebrady/shairport-sync' },
  { name: 'Snapcast', url: 'https://github.com/badaix/snapcast' },
  { name: 'upmpdcli', url: 'https://www.lesbonscomptes.com/upmpdcli/' },
  { name: 'Home Assistant', url: 'https://www.home-assistant.io/' },
];

export const hostedBy: HostingLink[] = [
  { name: 'GitHub', url: 'https://github.com/', label: 'CI' },
  { name: 'Vercel', url: 'https://vercel.com/', label: 'hosting' },
  { name: 'OVH', url: 'https://www.ovh.com/', label: 'DNS' },
];
