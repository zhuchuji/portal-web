const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.static('build', {
  index: false,
  fallthrough: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  }
}));

app.use('/api', createProxyMiddleware({ target: 'localhost:9090', changeOrigin: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

app.listen(10001, () => {
  console.log(`Website runs on 10001`);
});