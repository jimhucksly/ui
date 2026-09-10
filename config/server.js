const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const DEMO_DIR = path.join(__dirname, 'demo');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function contentType(file) {
  return MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function serveFile(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(file) });
    res.end(data);
  });
}

function isInside(base, target) {
  const rel = path.relative(base, target);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  if (urlPath === '/') {
    serveFile(res, path.join(DEMO_DIR, 'index.html'));
    return;
  }

  const demoFile = path.normalize(path.join(DEMO_DIR, urlPath));
  if (isInside(DEMO_DIR, demoFile)) {
    fs.stat(demoFile, (err, stat) => {
      if (!err && stat.isFile()) {
        serveFile(res, demoFile);
        return;
      }
      const pubFile = path.normalize(path.join(PUBLIC_DIR, urlPath));
      if (isInside(PUBLIC_DIR, pubFile)) {
        fs.stat(pubFile, (err2, stat2) => {
          if (!err2 && stat2.isFile()) {
            serveFile(res, pubFile);
            return;
          }
          serveFile(res, path.join(DEMO_DIR, 'index.html'));
        });
        return;
      }
      serveFile(res, path.join(DEMO_DIR, 'index.html'));
    });
    return;
  }

  res.writeHead(403);
  res.end('Forbidden');
});

server.listen(PORT, HOST, () => {
  console.log('LDM UI static server running at ' + HOST + ':' + PORT);
});

