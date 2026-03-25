const isBeta = import.meta.env.PUBLIC_BETA === 'true';
export const installCmd = isBeta
  ? 'curl -fsSL https://beta.odio.love/install | bash'
  : 'curl -fsSL https://odio.love/install | bash';

export const compatibleHardware = [
  'Raspberry Pi B, B+, Zero W - armv6l (800 MHz recommended)',
  'Raspberry Pi 2 - armv7',
  'Raspberry Pi 3, 4, 5, Zero 2 W - arm64',
  'Desktop, NAS - x86-64',
  'Debian 13 (Trixie)',
];

export const verifiedPlatforms = [
  {
    arch: 'armv6l',
    examples: ['Raspberry Pi B+ - Raspberry Pi OS Lite (Trixie)'],
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

export const verifiedOther = [
  { label: 'Fedora 43 x86-64', note: 'API only/manual' },
];
