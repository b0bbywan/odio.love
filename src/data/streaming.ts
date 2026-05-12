import { siSpotify, siTidal } from 'simple-icons';

export const iconMap = { siSpotify, siTidal } as const;
export type IconKey = keyof typeof iconMap;

export interface Service {
  name: string;
  desc: string;
  icon: IconKey | null;
  iconImg?: string;
  iconColor: string | null;
  docs: string;
}

export const services: Service[] = [
  {
    name: 'Web radios',
    desc: 'Thousands of stations. Via myMPD (WebradioDB) or UPnP (Radio Browser…).',
    icon: null,
    iconImg: '/icon_webradio.svg',
    iconColor: null,
    docs: '/guides/webradios/',
  },
  {
    name: 'Spotify Connect',
    desc: 'Your Pi appears as a Spotify Connect device. Control from any Spotify client.',
    icon: 'siSpotify',
    iconColor: '#1DB954',
    docs: '/guides/spotify/',
  },
  {
    name: 'Qobuz',
    desc: 'Full catalog via upmpdcli. Hi-res included.',
    icon: null,
    iconImg: '/logo_qobuz.svg',
    iconColor: null,
    docs: '/guides/tidal-qobuz/',
  },
  {
    name: 'Tidal',
    desc: 'Full catalog via via upmpdcli. MQA and lossless.',
    icon: 'siTidal',
    iconColor: '#ffffff',
    docs: '/guides/tidal-qobuz/',
  },
];
