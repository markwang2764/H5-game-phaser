// 协议 http://cf.dui88.com/pages/viewpage.action?pageId=9781390
var bridges = [
  'open', // 打开到原生页面
  'h5Share', // 使用后端数据分享
  'share', // 分享
  'controlToolbar', // 控制导航栏显示隐藏	
  'closeWeb', // 关闭当前webview	
  'openBroswer', // 打开外部url	
  'getAppInfo', // 获取app用户信息
  'copyTxt' // 复制字符串到剪切板	
];

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

// callback: code data message action
function setUpTMJSBridge(callback) {
  window.TMJSBridge = {};
  bridges.forEach(function(item) {
    window.TMJSBridge[item] = function(param, callback) {
      if (window.WebViewJavascriptBridge) {
        WebViewJavascriptBridge.callHandler(item, { code: 0, message: '', data: param }, callback);
      }
    };
  });

  callback(TMJSBridge);
}

setupWebViewJavascriptBridge(function(bridge) {
  bridge.registerHandler('getShareInfo', function(data, responseCallback) {
    responseCallback(window.shareInfo);
  });
  bridge.registerHandler('getJSBridge', function(data, responseCallback) {
    responseCallback(bridge);
  });
});
setUpTMJSBridge(function(jsbridge) {
  jsbridge.setShareInfo = function setShareInfo(shareInfo) {
    window.shareInfo = shareInfo;
  };
});

// java用
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function() {
        callback(WebViewJavascriptBridge);
      },
      false
    );
  }
}

connectWebViewJavascriptBridge(function(bridge) {
  bridge.init(function(message, responseCallback) {
    console.log('JS got a message', message);
    var data = {
      'Javascript Responds': '测试中文!',
    };

    if (responseCallback) {
      console.log('JS responding with', data);
      responseCallback(data);
    }
  });

  bridge.registerHandler('functionInJs', function(data, responseCallback) {
    document.getElementById('show').innerHTML = 'data from Java: = ' + data;
    if (responseCallback) {
      var responseData = 'Javascript Says Right back aka!';
      responseCallback(responseData);
    }
  });
});
