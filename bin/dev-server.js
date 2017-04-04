const http = require('http');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const history = require('connect-history-api-fallback');

const app = express();
const router = express.Router();

router.use(history());

const webpackCompiler = webpack(webpackConfig);

router.use('/', webpackDevMiddleware(webpackCompiler, {
  lazy: false,
  stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  }
}));

app.use('/', router);

const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

console.log("Listening on port", port);
const server = http.createServer(app);
server.listen(port);
