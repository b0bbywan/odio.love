export async function GET() {
  const content = `User-agent: *\nAllow: /\nSitemap: https://odio.love/sitemap-index.xml\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
