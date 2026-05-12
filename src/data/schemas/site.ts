import { features } from '../features.js';
import { services } from '../streaming.js';
import { repos } from '../repos.js';

export const SITE_URL = 'https://odio.love';

export const DEFAULT_TITLE =
  'odio: revive any Raspberry Pi as an open-source audio streamer';

export const DEFAULT_DESCRIPTION =
  'Revive any Raspberry Pi as a self-hosted audio streamer. AirPlay 2, Spotify, Snapcast multiroom, Home Assistant. One curl install. Free Volumio alternative.';

export const OG_IMAGE = `${SITE_URL}/og-cover.png`;

export const SOCIALS: string[] = [
  'https://www.linkedin.com/in/mrequillart/',
  'https://mathieu-requillart.medium.com/',
];

export interface SchemaIdRef {
  '@id': string;
}

export interface SchemaPerson {
  '@type': 'Person';
  name: string;
  url: string;
  sameAs?: string[];
}

export interface BuildSiteSchemaArgs {
  description: string;
  version: string;
}

export const ORG_REF: SchemaIdRef = { '@id': `${SITE_URL}/#organization` };
export const OS_REF: SchemaIdRef = { '@id': `${SITE_URL}/#os` };
export const AUTHOR_REF: SchemaPerson = {
  '@type': 'Person',
  name: 'b0bbywan',
  url: 'https://github.com/b0bbywan',
  sameAs: SOCIALS,
};

const featureList = [
  ...features.map((f) => `${f.name}: ${f.desc}`),
  ...services.map((s) => `${s.name}: ${s.desc}`),
];

const installerRepo =
  repos.find((r) => r.name === 'odios')?.url ?? 'https://github.com/b0bbywan/odios';

const screenshots = [
  'audio-cd-playback.png',
  'bt-playing.png',
  'embedded-ui.png',
  'odio-ha.png',
  'pwa-instances.png',
  'rpi-imager.png',
].map((f) => `${SITE_URL}/screenshots/${f}`);

const keywords = [
  'Raspberry Pi audio streamer',
  'old Raspberry Pi',
  'Raspberry Pi B',
  'Raspberry Pi Zero W',
  'armv6',
  'armv7',
  'self-hosted',
  'open-source',
  'Home Assistant',
  'AirPlay 2',
  'Bluetooth audio',
  'Snapcast multi-room',
  'UPnP DLNA',
  'Spotify Connect',
  'Tidal',
  'Qobuz',
  'MPD',
  'CD auto-play',
  'USB auto-play',
  'GnuDB',
  'MusicBrainz',
  'cover art',
  'no telemetry',
  'Volumio alternative',
];

const orgSameAs = ['https://github.com/b0bbywan', ...SOCIALS, 'https://docs.odio.love'];

export function buildSiteSchema({ description, version }: BuildSiteSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'odio',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
        description:
          'Open-source Raspberry Pi audio streaming project: self-hosted, Home Assistant native, no telemetry.',
        founder: AUTHOR_REF,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'contact@odio.love',
          url: 'https://github.com/b0bbywan/odios/issues',
          availableLanguage: ['English', 'French'],
        },
        sameAs: orgSameAs,
      },
      {
        '@type': 'WebSite',
        name: 'odio',
        url: SITE_URL,
        description,
        publisher: ORG_REF,
      },
      {
        '@type': 'OperatingSystem',
        '@id': `${SITE_URL}/#os`,
        name: 'odio',
        url: SITE_URL,
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Audio Streaming',
        operatingSystem: 'Raspberry Pi OS Lite (Trixie), Debian 13',
        processorRequirements: 'ARMv6, ARMv7, ARM64 (aarch64), x86-64',
        softwareRequirements:
          'Raspberry Pi OS Lite (Trixie) or Debian 13; bare-metal install via curl',
        softwareVersion: version,
        sameAs: [installerRepo, 'https://docs.odio.love'],
        downloadUrl: `${SITE_URL}/install`,
        installUrl: `${SITE_URL}/install`,
        softwareHelp: {
          '@type': 'CreativeWork',
          url: 'https://docs.odio.love',
        },
        releaseNotes: 'https://github.com/b0bbywan/odios/releases',
        license: 'https://opensource.org/licenses/BSD-2-Clause',
        screenshot: screenshots,
        featureList,
        keywords,
        author: AUTHOR_REF,
        publisher: ORG_REF,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      },
    ],
  };
}
