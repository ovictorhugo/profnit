const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://fe6d-189-70-125-168.ngrok-free.app',
      changeOrigin: true,
    })
  );
};