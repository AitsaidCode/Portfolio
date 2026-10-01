/**
 * Zero-dependency local static server for devsurmesure
 * Usage: node server.js [port]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

// Resolves a request path to a file inside rootDir; null when malformed or outside the root
function resolveSafePath(urlPath, rootDir) {
  if (typeof urlPath !== 'string') return null;
  let decoded;
  try {
    decoded = decodeURI(urlPath);
  } catch (decodeError) {
    return null;
  }
  if (decoded.includes('\0')) return null;

  let safePath = path.normalize(decoded).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '' || safePath === '.') {
    safePath = '/index.html';
  }

  const root = path.resolve(rootDir);
  const filePath = path.join(root, safePath);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  // 1. Guard: Restrict HTTP methods to GET & HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 
      'Content-Type': 'text/plain; charset=utf-8',
      'Allow': 'GET, HEAD',
      ...SECURITY_HEADERS 
    });
    res.end('405 Method Not Allowed');
    return;
  }

  // 2. Health check endpoint for orchestrators
  const urlPath = req.url.split('?')[0];
  if (urlPath === '/healthz' || urlPath === '/api/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...SECURITY_HEADERS 
    });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // 3. Parse URL & prevent path traversal / malformed encodings
  const filePath = resolveSafePath(urlPath, ROOT_DIR);
  if (filePath === null) {
    res.writeHead(400, {
      'Content-Type': 'text/plain; charset=utf-8',
      ...SECURITY_HEADERS
    });
    res.end('400 Bad Request');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 
        'Content-Type': 'text/plain; charset=utf-8',
        ...SECURITY_HEADERS 
      });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      ...SECURITY_HEADERS
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`[devsurmesure] Local server running at http://localhost:${PORT}/`);
    console.log(`[devsurmesure] Serving directory: ${ROOT_DIR}`);
  });

  // Graceful Shutdown handling
  function handleShutdown(signal) {
    console.log(`[devsurmesure] Received ${signal}. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log('[devsurmesure] HTTP server closed cleanly. Process exiting.');
      process.exit(0);
    });
    // Force exit if hanging connections remain
    setTimeout(() => {
      console.error('[devsurmesure] Forced shutdown after timeout.');
      process.exit(1);
    }, 5000).unref();
  }

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

module.exports = { resolveSafePath };
