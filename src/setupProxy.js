const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://home.idyer.top:9090',
      changeOrigin: true,
    })
  );
};