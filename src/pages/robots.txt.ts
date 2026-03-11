const site = import.meta.env.PUBLIC_BETA === 'true' ? 'https://beta.odio.love' : 'https://odio.love';

export async function GET() {
  const content = `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap-index.xml\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
