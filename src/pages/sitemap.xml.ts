import type { APIRoute } from 'astro';

const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/ai-support', priority: '0.9', changefreq: 'weekly' },
  { path: '/session', priority: '0.8', changefreq: 'monthly' },
  { path: '/market', priority: '0.9', changefreq: 'weekly' },
  { path: '/education', priority: '0.9', changefreq: 'weekly' },
  { path: '/company', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/inquiry', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog-ai-1', priority: '0.7', changefreq: 'monthly', lastmod: '2026-11-02' },
  { path: '/blog-market-1', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-28' },
  { path: '/blog-edu-1', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-24' },
  { path: '/blog-ai-2', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-20' },
  { path: '/blog-edu-2', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-16' },
  { path: '/blog-market-2', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-12' },
  { path: '/blog-ai-3', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-08' },
  { path: '/blog-market-3', priority: '0.7', changefreq: 'monthly', lastmod: '2026-10-04' },
  { path: '/blog-edu-3', priority: '0.7', changefreq: 'monthly', lastmod: '2026-09-29' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/confidentiality', priority: '0.3', changefreq: 'yearly' },
  { path: '/cancel', priority: '0.3', changefreq: 'yearly' },
  { path: '/tokusho', priority: '0.3', changefreq: 'yearly' }
];

export const GET: APIRoute = ({ site }) => {
  const base = (site ? site.toString() : 'https://dreamlabltd.jp').replace(/\/$/, '');
  const urls = ROUTES.map((r) => {
    const lastmodTag = r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : '';
    return `  <url><loc>${base}${r.path}</loc>${lastmodTag}<changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
