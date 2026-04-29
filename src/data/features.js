import { Bluetooth, Airplay, Speaker, Share2, Disc, Wifi, House, Smartphone } from '../icons';

export const features = [
  {
    id: 'bluetooth',
    name: 'Bluetooth Audio',
    desc: 'Works like any commercial speaker. Control power and pairing from the UI, PWA or Home Assistant.',
    icon: Bluetooth,
  },
  {
    id: 'airplay',
    name: 'AirPlay 2',
    desc: 'Stream from any Apple device directly to your Pi with zero configuration.',
    icon: Airplay,
  },
  {
    id: 'multiroom',
    name: 'Multi-room',
    desc: 'Snapcast integration for perfectly synchronized audio across every room.',
    icon: Speaker,
  },
  {
    id: 'upnp',
    name: 'UPnP / DLNA',
    desc: 'Full UPnP renderer and server via upmpdcli — works with every media client.',
    icon: Share2,
  },
  {
    id: 'cd',
    name: 'CD & USB Auto-play',
    desc: 'Insert a disc or USB drive — playback starts automatically with full metadata and cover art via GnuDB and MusicBrainz.',
    icon: Disc,
  },
  {
    id: 'network',
    name: 'Network Streaming',
    desc: 'PulseAudio TCP sink — any Linux machine running PulseAudio or PipeWire streams to the Pi natively, no extra client needed.',
    icon: Wifi,
  },
  {
    id: 'ha',
    name: 'Home Assistant',
    desc: 'Not just a media player card. Services, outputs, Bluetooth, power: complete odio stack as native HA entities.',
    icon: House,
  },
  {
    id: 'pwa',
    name: 'PWA Interface',
    desc: 'Install the web app on any device for a native-feeling control experience.',
    icon: Smartphone,
  },
];
