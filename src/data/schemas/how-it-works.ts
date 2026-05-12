import { SITE_URL, OS_REF, AUTHOR_REF } from './site.js';

export const HOW_IT_WORKS_URL = `${SITE_URL}/how-it-works/`;

export const howItWorksJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How odio works',
      description:
        'Inside odio: MPD, PulseAudio, Snapcast, Shairport Sync, upmpdcli running as user-session services. The go-odio-api orchestrator, Home Assistant integration, and the Ansible CI pipeline from apt packages to flashable Raspberry Pi Imager images.',
      url: HOW_IT_WORKS_URL,
      datePublished: '2026-03-25',
      inLanguage: 'en',
      isAccessibleForFree: true,
      about: OS_REF,
      author: AUTHOR_REF,
      publisher: AUTHOR_REF,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'odio', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'How it works', item: HOW_IT_WORKS_URL },
      ],
    },
  ],
};
