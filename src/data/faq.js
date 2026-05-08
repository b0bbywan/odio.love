export const faq = [
  {
    q: 'How does odio differ from Volumio, moOde, or other Pi audio distros?',
    a: "odio is not a custom distro: it's a stack of services that installs on top of your existing Raspberry Pi OS Lite. It runs on every Pi from the original B (700 MHz single core, 32-bit) to the Pi 5, exposes power and Bluetooth as Home Assistant entities, plays inserted CDs and USB drives automatically with metadata, and ships a documented HTTP API you can build your own UIs on.",
  },
  {
    q: 'Which Raspberry Pi models are supported?',
    a: 'All of them. Pi B / B+ / Zero W (armv6l), Pi 2 (armv7), Pi 3 / 4 / 5 / Zero 2 W (arm64). x86-64 desktops and NAS running Debian 13 are also supported. The full hardware matrix is in the install section above.',
  },
  {
    q: 'Do I need to flash a new SD card?',
    a: 'No. odio installs on top of an existing Raspberry Pi OS Lite (Trixie) with a single curl install command. You keep your SSH keys, your hostname, and anything else you already run on the Pi. Pre-built Raspberry Pi Imager images are available if you prefer to start fresh.',
  },
  {
    q: 'Where does my music library live?',
    a: 'Mount it at /media/USB/<music> via NFS, SMB, or local storage. MPD picks it up automatically. If the library lives on a NAS, you can also stream straight to odio via AirPlay, Snapcast, UPnP, or PulseAudio TCP without copying anything. See the MPD guide at docs.odio.love/guides/mpd.',
  },
  {
    q: 'Can odio run in Docker?',
    a: "No, not as a real install target. Docker is used in CI to test the install playbook on x86_64, arm64, and armhf (via qemu), but the supported install path stays bare-metal Pi OS. The core API (go-odio-api) ships its own docker-compose if you want to embed just the brain into your setup. Containerizing the full audio stack is open territory, contributions welcome: github.com/b0bbywan/odios/discussions/43.",
  },
  {
    q: 'Does it work with Plex, Jellyfin, Music Assistant, or Navidrome?',
    a: "Yes, in different ways. Music Assistant connects via the AirPlay, Snapcast, UPnP, or Spotify Connect endpoints odio already exposes. Navidrome works through MPD's library scan. Plexamp can run as a third-party extension in odio's user session. Per-stack guides live at docs.odio.love/guides.",
  },
  {
    q: "Is odio free? What's the license?",
    a: 'Yes, free and open source under BSD-2-Clause. No accounts, no telemetry, no paid tier. Every component (API, installer, Home Assistant integration, web app, CD player, docs) is public on GitHub.',
  },
];
