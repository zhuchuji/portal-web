const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://dunnzhou.tpddns.cn:9090',
      changeOrigin: true,
    })
  );
};