import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf'
};

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

function getCacheControl(urlPathname, ext) {
  if (urlPathname.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (ext === '.html') return 'public, max-age=0, must-revalidate';
  if (ext === '.css' || ext === '.js') return 'public, max-age=3600';
  return 'public, max-age=86400';
}

function resolveDistFile(urlPathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPathname);
  } catch {
    return null;
  }

  const relPath = decoded.replace(/^\/+/, '');
  if (relPath.split('/').some((seg) => seg.startsWith('.'))) {
    return null;
  }

  const fullPath = path.resolve(DIST_DIR, relPath);
  if (fullPath !== DIST_DIR && !fullPath.startsWith(DIST_DIR + path.sep)) {
    return null;
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }

  // Directory index (e.g. / or /ai-support or /ai-support/)
  const dirIndex = path.join(fullPath, 'index.html');
  if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
    return dirIndex;
  }

  return null;
}

function send404(res) {
  setSecurityHeaders(res);
  const custom404 = path.join(DIST_DIR, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  if (fs.existsSync(custom404)) {
    fs.createReadStream(custom404).pipe(res);
  } else {
    res.end('<!doctype html><html lang="ja"><meta charset="utf-8"><title>404 Not Found</title><body><h1>404 Not Found</h1></body></html>');
  }
}

function collectBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleInquiryPost(req, res) {
  try {
    const raw = await collectBody(req);
    const contentType = req.headers['content-type'] || '';
    const payload = contentType.includes('application/json')
      ? JSON.parse(raw || '{}')
      : Object.fromEntries(new URLSearchParams(raw));

    const record = {
      receivedAt: new Date().toISOString(),
      type: String(payload.type || '').slice(0, 40),
      company: String(payload.company || '').slice(0, 200),
      name: String(payload.name || '').slice(0, 120),
      email: String(payload.email || '').slice(0, 200),
      message: String(payload.message || '').slice(0, 4000),
      utm_source: String(payload.utm_source || '').slice(0, 120),
      utm_campaign: String(payload.utm_campaign || '').slice(0, 120)
    };

    if (!record.company || !record.name || !record.email) {
      setSecurityHeaders(res);
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Required fields missing' }));
      return;
    }

    if (process.env.INQUIRY_WEBHOOK_URL) {
      await fetch(process.env.INQUIRY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } else {
      const dataDir = path.join(__dirname, 'data');
      fs.mkdirSync(dataDir, { recursive: true });
      fs.appendFileSync(path.join(dataDir, 'inquiries.jsonl'), JSON.stringify(record) + '\n', 'utf8');
    }

    setSecurityHeaders(res);
    if (contentType.includes('application/json')) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, redirect: '/inquiry-thanks' }));
    } else {
      res.writeHead(303, { Location: '/inquiry-thanks' });
      res.end();
    }
  } catch {
    setSecurityHeaders(res);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: 'Failed to process inquiry' }));
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/healthz') {
    setSecurityHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/inquiry') {
    handleInquiryPost(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    setSecurityHeaders(res);
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  // Redirect legacy *.html requests to clean URLs
  if (url.pathname.endsWith('.html') && url.pathname !== '/404.html') {
    const clean = url.pathname === '/index.html' ? '/' : url.pathname.slice(0, -5);
    setSecurityHeaders(res);
    res.writeHead(301, { Location: clean + url.search });
    res.end();
    return;
  }

  const filePath = resolveDistFile(url.pathname);
  if (!filePath) {
    send404(res);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  setSecurityHeaders(res);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', getCacheControl(url.pathname, ext));

  if (req.method === 'HEAD') {
    const stat = fs.statSync(filePath);
    res.setHeader('Content-Length', stat.size);
    res.writeHead(200);
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    } else {
      res.destroy();
    }
  });
  res.writeHead(200);
  stream.pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`dreamLab server listening at http://localhost:${PORT} (serving dist/)`);
});
