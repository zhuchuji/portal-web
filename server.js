const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cluster = require('node:cluster');
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running.`);

  for (let i = 0; i < 2; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died.`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.static('build', {
    index: false,
    fallthrough: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  }));

  app.use('/api', createProxyMiddleware({ target: 'http://localhost:9090', changeOrigin: true }));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });

  app.listen(10001, () => {
    console.log(`Website runs on 10001`);
  });

  console.log(`Worker ${process.pid} started`);
}
