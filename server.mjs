import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.mp4':'video/mp4', '.txt':'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith('/reference/') || pathname.startsWith('/scripts/') || pathname.startsWith('/.')) {
      res.writeHead(404); res.end('Not found'); return;
    }
    let path = resolve(root, '.' + pathname);
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    let info = await stat(path);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }); res.end(); return; }
      path = resolve(path, 'index.html');
    }
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/html; charset=utf-8' });
    res.end('<!doctype html><html lang="it"><meta charset="utf-8"><title>Pagina non trovata</title><h1>Pagina non trovata</h1><a href="/">Torna alla Home</a></html>');
  }
}).listen(port, '127.0.0.1', () => console.log(`DSA Smart Start: http://localhost:${port}`));
