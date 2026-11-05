import { repos } from './repos.js';

export interface VerifiedExample {
  label: string;
  // Link to the community report, for setups tested by users rather than the maintainer
  communityReport?: string;
}

export interface VerifiedPlatform {
  arch: string;
  examples: VerifiedExample[];
  incoming: boolean;
}

export interface CompatibleHardware {
  label: string;
  // Link to the community report, for boards tested by users rather than the maintainer
  communityReport?: string;
}

export interface VerifiedOther {
  label: string;
  note: string;
}

export const installCmd = 'curl -fsSL https://odio.love/install | bash';

export const compatibleHardware: CompatibleHardware[] = [
  { label: 'Raspberry Pi B, B+, Zero W - armv6l (800 MHz recommended)' },
  { label: 'Raspberry Pi 2 - armv7' },
  { label: 'Raspberry Pi 3, 4, 5, Zero 2 W - arm64' },
  { label: 'Radxa Zero 3W - arm64', communityReport: 'https://github.com/b0bbywan/odios/issues/105' },
  { label: 'Desktop, NAS - x86-64' },
  { label: 'Debian 13 (Trixie)' },
];

export const verifiedPlatforms: VerifiedPlatform[] = [
  {
    arch: 'armv6l',
    examples: [{ label: 'Raspberry Pi B' }, { label: 'Raspberry Pi B+ - Raspberry Pi OS Lite (Trixie)' }],
    incoming: false,
  },
  {
    arch: 'armv7',
    examples: [{ label: 'Raspberry Pi 2B - Raspberry Pi OS Lite' }, { label: 'Raspberry Pi 3B+ - Raspberry Pi OS Lite (Trixie 13.4)' }],
    incoming: false,
  },
  {
    arch: 'arm64',
    examples: [
      { label: 'Raspberry Pi 3B+ - Raspberry Pi OS Lite (Trixie)' },
      { label: 'Radxa Zero 3W - Debian 13 (Trixie)', communityReport: 'https://github.com/b0bbywan/odios/issues/105' },
    ],
    incoming: false,
  },
  {
    arch: 'x86-64',
    examples: [{ label: 'Desktop - Debian 13 Gnome' }, { label: 'NAS - OpenMediaVault 8' }],
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
