const isBeta = import.meta.env.PUBLIC_BETA === 'true';

export async function GET() {
  const content = isBeta
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nSitemap: https://odio.love/sitemap-index.xml\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
