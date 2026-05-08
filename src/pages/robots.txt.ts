export async function GET() {
  const content = `User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /\nSitemap: https://odio.love/sitemap-index.xml\n`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
