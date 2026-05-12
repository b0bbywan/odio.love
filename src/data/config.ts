import { repos } from './repos.js';

export interface VerifiedPlatform {
  arch: string;
  examples: string[];
  incoming: boolean;
}

export interface VerifiedOther {
  label: string;
  note: string;
}

export const installCmd = 'curl -fsSL https://odio.love/install | bash';

export const compatibleHardware: string[] = [
  'Raspberry Pi B, B+, Zero W - armv6l (800 MHz recommended)',
  'Raspberry Pi 2 - armv7',
  'Raspberry Pi 3, 4, 5, Zero 2 W - arm64',
  'Desktop, NAS - x86-64',
  'Debian 13 (Trixie)',
];

export const verifiedPlatforms: VerifiedPlatform[] = [
  {
    arch: 'armv6l',
    examples: ['Raspberry Pi B', 'Raspberry Pi B+ - Raspberry Pi OS Lite (Trixie)'],
    incoming: false,
  },
  {
    arch: 'armv7',
    examples: ['Raspberry Pi 3B+ - Raspberry Pi OS Lite (Trixie 13.4)'],
    incoming: false,
  },
  {
    arch: 'arm64',
    examples: ['Raspberry Pi 3B+ - Raspberry Pi OS Lite (Trixie)'],
    incoming: false,
  },
  {
    arch: 'x86-64',
    examples: ['Desktop - Debian 13 Gnome', 'NAS - OpenMediaVault 8'],
    incoming: false,
  },
];

export const verifiedOther: VerifiedOther[] = [
  { label: 'Fedora 43 x86-64', note: 'API only/manual' },
];

export const imagerManifestUrl = 'https://odio.love/odio.rpi-imager-manifest';

const numberWords = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

export const ecosystemCountLabel: string = (() => {
  const n = repos.length;
  const w = numberWords[n] ?? String(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
})();
