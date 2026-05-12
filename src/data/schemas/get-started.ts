import { SITE_URL } from './site.js';

export interface BuildGetStartedSchemaArgs {
  installCmd: string;
  imagerManifestUrl: string;
}

export function buildGetStartedSchema({
  installCmd,
  imagerManifestUrl,
}: BuildGetStartedSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Install odio on a Raspberry Pi',
    description:
      'Install the odio audio streaming stack on top of an existing Raspberry Pi OS Lite (Trixie) with a single command, or flash a pre-built image with Raspberry Pi Imager.',
    totalTime: 'PT15M',
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Raspberry Pi (B/B+/Zero W, 2, 3, 4, 5, Zero 2 W) or x86-64 device running Debian 13',
      },
      {
        '@type': 'HowToSupply',
        name: 'SD card with Raspberry Pi OS Lite (Trixie) installed, or a blank SD card if using Imager',
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'SSH client or local terminal' },
      {
        '@type': 'HowToTool',
        name: 'Raspberry Pi Imager v2.0.7+ (optional, for the flash path)',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Path A - Flash a pre-built image',
        text: `Open Raspberry Pi Imager, go to Options App, set Content Repository to ${imagerManifestUrl}, configure hostname/SSH/WiFi, then flash. Available in armhf (32-bit) and arm64 (64-bit).`,
        url: `${SITE_URL}/#get-started`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Path B - Install on existing Debian or Pi OS',
        text: `Boot into Raspberry Pi OS Lite (Trixie) or Debian 13 and run: ${installCmd}. The installer pulls about 800 MB and handles all dependencies and services.`,
        url: `${SITE_URL}/install`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Wait for installation to complete',
        text: 'Roughly 5 minutes on x86, under 15 minutes on a Pi 3B+, up to 1h20 on a Pi B+ at 800 MHz.',
      },
    ],
  };
}
