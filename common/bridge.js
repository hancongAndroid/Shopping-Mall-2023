//判断机型
let u = navigator.userAgent;

function setupWebViewJavascriptBridge(callback) {
  var bridge=window.WebViewJavascriptBridge||window.WKWebViewJavascriptBridge
  if (bridge) { return callback(bridge); }
  var callbacks=window.WVJBCallbacks||window.WKWVJBCallbacks
  if (callbacks) { return callbacks.push(callback); }
  window.WVJBCallbacks=window.WKWVJBCallbacks = [callback];
  let isApp = localStorage.getItem('isapp')?(localStorage.getItem('isapp')==1?true:false):false
  if(window.WKWebViewJavascriptBridge){
    if(isApp){
       window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
    }
  }else{
    if(isApp && localStorage.getItem('weappInfo') != 1){
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
  }
}

function callHandler(name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
}
function registerhandler(name, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(name, function (data, responseCallback) {
        callback(data, responseCallback)
      })
    })
}
