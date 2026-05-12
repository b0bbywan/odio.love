export interface NavItem {
  href: string;
  label: string;
  title: string;
}

export const homeSections: NavItem[] = [
  { href: '/#features', label: 'Features', title: 'Audio features and protocols' },
  { href: '/#streaming', label: 'Streaming', title: 'Spotify, Tidal, Qobuz, web radios' },
  { href: '/#comparison', label: 'Compare', title: 'odio vs Volumio vs commercial streamers' },
  { href: '/#get-started', label: 'Install', title: 'One-line install on your Pi' },
  { href: '/#faq', label: 'FAQ', title: 'Common questions about odio' },
  { href: '/#manifesto', label: 'Manifesto', title: 'The why behind no-telemetry, no-cloud, no-account' },
];

export const howItWorksSections: NavItem[] = [
  { href: '/how-it-works/#the-stack', label: 'The stack', title: 'Services that make up odio' },
  { href: '/how-it-works/#go-odio-api', label: 'go-odio-api', title: 'The orchestrator' },
  { href: '/how-it-works/#odio-ha', label: 'odio-ha', title: 'Home Assistant integration' },
  { href: '/how-it-works/#ecosystem', label: 'Ecosystem', title: 'Related odio repos' },
  { href: '/how-it-works/#about-ai', label: 'About AI', title: 'How AI is used in odio' },
];

export function getNav(pathname: string): { pageNav: NavItem[]; sectionNav: NavItem[] } {
  const isHowItWorks = pathname === '/how-it-works/' || pathname === '/how-it-works';
  const pageNav: NavItem[] = isHowItWorks
    ? [{ href: '/', label: '← odio.love', title: 'Back to odio.love home' }]
    : [{ href: '/how-it-works/', label: 'How it works', title: 'Inside odio: services, orchestration, CI pipeline' }];
  const sectionNav = isHowItWorks ? howItWorksSections : homeSections;
  return { pageNav, sectionNav };
}
