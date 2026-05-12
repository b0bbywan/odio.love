import { SITE_URL, ORG_REF, OS_REF } from './site.js';

export interface FaqEntry {
  frontmatter: { q: string; plainAnswer: string };
}

export interface BuildFaqSchemaArgs {
  entries: FaqEntry[];
}

export function buildFaqSchema({ entries }: BuildFaqSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    inLanguage: 'en',
    about: OS_REF,
    publisher: ORG_REF,
    mainEntity: entries.map(({ frontmatter }) => ({
      '@type': 'Question',
      name: frontmatter.q,
      inLanguage: 'en',
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: frontmatter.plainAnswer,
        inLanguage: 'en',
        author: ORG_REF,
      },
    })),
  };
}
