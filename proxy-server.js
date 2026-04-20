const http = require('http');
const httpProxy = require('http-proxy');

const TARGET_PORT = 3000;
const PROXY_PORT = 6000;

const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${TARGET_PORT}`,
  ws: true,
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res.writeHead) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  }
});

server.listen(PROXY_PORT, () => {
  console.log(`\n🚀 Proxy server running on port ${PROXY_PORT}`);
  console.log(`   Forwarding to Next.js on port ${TARGET_PORT}`);
  console.log(`\n   ➜ Local:   http://localhost:${PROXY_PORT}`);
  console.log(`   ➜ Next.js: http://localhost:${TARGET_PORT}\n`);
});
