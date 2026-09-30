const { createServer } = require('node:http');
const { readFile, stat } = require('node:fs/promises');
const { extname, normalize, resolve, sep } = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml; charset=utf-8', '.webp': 'image/webp'
};

function headers(extension) {
  const asset = ['.css', '.jpg', '.jpeg', '.js', '.png', '.svg', '.webp'].includes(extension);
  return {
    'Content-Type': mime[extension] || 'application/octet-stream',
    'Cache-Control': asset ? 'public, max-age=31536000, immutable' : 'no-cache',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  };
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
    const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = resolve(root, `.${normalize(requested)}`);
    if (!file.startsWith(`${root}${sep}`)) throw new Error('Invalid path');
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    const extension = extname(file).toLowerCase();
    response.writeHead(200, headers(extension));
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    response.end('Not found');
  }
}).listen(port, '0.0.0.0', () => console.log(`MKS64 is running on port ${port}`));

