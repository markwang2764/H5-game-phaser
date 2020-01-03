/**
 * @note
 * @author  miaokefu <miaokefu@duiba.com.cn>
 * @create  2017-10-27
 * @des 根据mock/routes自动生成所有的服务器api
 */
var fs = require('fs');
var axios = require('../config/axios-config');

var config = require('../config');
var proxyConfig = config.dev.proxy;

// mock路由
var routeConfig = require('./routes');

function readJson(filePath) {
  return function (req, res) {
    var url = 'mock' + filePath + '.json';
    fs.readFile(url, function (err, data) {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  };
}

/**
 * 请求后端接口
 * @param req
 * @param res
 */
function getAxiosData(req, res) {
  var url = req.url;
  var params = req.body;
  var method = req.method.toLowerCase();
  // 拼接请求路径
  url = proxyConfig.protocol + proxyConfig.hostName + (proxyConfig.port === 80 ? '' : ':' + proxyConfig.port) + url;

  console.log(`request url = ${url}`);
  if (method === 'get') {
    axios.get(url)
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (err) {
        res.json(err);
      });
  } else if (method === 'post') {
    axios.post(url, params)
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (err) {
        res.json(err);
      });
  } else {
    res.json('unkown http method');
  }
}

function doGetAxio(req, res, proxy) {
  var url = req.url;
  var params = req.body;
  var method = req.method.toLowerCase();
  // 拼接请求路径
  url = proxyConfig.protocol + proxy + url;

  console.log(`request url = ${url}`);
  if (method === 'get') {
    axios.get(url)
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (err) {
        res.json(err);
      });
  } else if (method === 'post') {
    axios.post(url, params)
      .then(function (response) {
        res.json(response.data);
      })
      .catch(function (err) {
        res.json(err);
      });
  } else {
    res.json('unkown http method');
  }
}

function initApiRoutes(router) {
  // api路由配置
  for (var i in routeConfig) {
    var page = routeConfig[i];
    for (var j in page) {
      var pageRoutes = page[j];
      if (j === 'get') {
        for (var k in pageRoutes) {
          var routeContent = pageRoutes[k];
          if (proxyConfig.open) {
            if (routeContent instanceof Array) {
              router.getProxy(k, routeContent[1], doGetAxio);
            } else {
              router.get(k, getAxiosData)
            }
          } else {
            router.get(k, readJson(pageRoutes[k]));
          }
        }
      } else if (j === 'post') {
        for (var k in pageRoutes) {
          if (proxyConfig.open) {
            router.post(k, getAxiosData)
          } else {
            router.post(k, readJson(pageRoutes[k]));
          }
        }
      }
    }
  }
}

module.exports = initApiRoutes;