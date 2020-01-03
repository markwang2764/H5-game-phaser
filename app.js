const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const devConfig = require('./build/webpack.dev.conf');
const compiler = webpack(devConfig);
const entry = require('./config/entry.js');
const utils = require('./build/utils');

const initApiRoutes = require('./mock/apis');
const opn = require('opn');
const app = express();

const NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV, '=========>')

if (NODE_ENV === 'development') {
  
  // webpack
  app.use(webpackDevMiddleware(compiler, {
    publicPath: devConfig.output.publicPath,
    logLevel: 'silent' // 隐藏log日志
  }));
  app.use(webpackHotMiddleware(compiler, {
    log: false,
  }));
}

app.use(express.static('./static'));
app.use(express.static('./dist'));
app.use(express.static('./src/pages'));
app.use(express.static('./src'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './dist/'));
app.engine('ejs', require('ejs').__express);
app.engine('html', require('ejs').__express);

app.get('/', function (req, res) {
  res.redirect('/index/entry.html')
});

// 输出entry目录
app.get('/api/entry', function (req, res) {
  res.json(entry)
});
Object.defineProperty(app, '_$_proxyCache', {
  value: {}
})
Object.defineProperty(app, 'getProxy', {
  value: function (url, proxy, cb) {
    console.log(url)
    console.log(proxy)
    app._$_proxyCache[url] = proxy;
    console.log(app._$_proxyCache);
    app.get(url, (req, res)=>{
      var url = req.url;
      if(url.indexOf('?')) {
        var url = url.split('?')[0];
      }
      var prox = app._$_proxyCache[url];
      cb(req, res, prox);
    });
  }
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
initApiRoutes(app);

let browserUrl = `http://${utils.getHost()}:${utils.getPort()}`
console.log(`Your application is running here: ${browserUrl}`);
// 在默认浏览器中打开
opn(browserUrl);

module.exports = app;
 