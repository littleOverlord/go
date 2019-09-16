define("libs/ni/http",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description http通讯模块
 */

/****************** 导入 ******************/

/****************** 导出 ******************/
var Http =
/*#__PURE__*/
function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, null, [{
    key: "get",

    /**
     * @description get请求，可忽略回调
     */
    value: function get(url, param, reqType, callback) {
      var u = paramPaser(url, param);

      callback = callback || function () {};

      connect(RqType.GET, u[0], u[1], RsType[reqType], callback);
    }
    /**
     * @description request请求，必须带回调
     * @param url 
     * @param param 
     * @param callback 
     */

  }, {
    key: "request",
    value: function request(url, param, callback) {
      var u = paramPaser(url, param);
      connect(RqType.GET, u[0], u[1], null, callback);
    }
    /**
     * @description post请求，一般用作上传
     */

  }, {
    key: "post",
    value: function post(url, param, callback, processBack) {
      var u = paramPaser(url, param);
      connect(RqType.POST, u[0], u[1], null, callback, processBack);
    }
  }]);

  return Http;
}();
/****************** 本地 ******************/

/**
 * @description 请求类型
 */


exports.default = Http;
var RqType;
/**
 * @description 响应类型
 */

(function (RqType) {
  RqType["GET"] = "GET";
  RqType["POST"] = "POST";
})(RqType || (RqType = {}));

var RsType;
/**
 * @description 错误处理类
 */

(function (RsType) {
  RsType["BIN"] = "arraybuffer";
  RsType["BLOB"] = "blob";
  RsType["DOM"] = "document";
  RsType["JSON"] = "JSON";
  RsType["TEXT"] = "text";
})(RsType || (RsType = {}));

var RsError = function RsError(message) {
  _classCallCheck(this, RsError);

  this.err = {
    reson: ""
  };
  this.err.reson = message;
};
/**
 * @description 处理请求参数，返回 "a=b&c=d"
 * @param param 
 */


var paramPaser = function paramPaser(url, param) {
  var s = "";

  if (param && _typeof(param) === "object") {
    for (var k in param) {
      s += "".concat(s ? "&" : "").concat(k, "=").concat(_typeof(param[k]) == "object" ? JSON.stringify(param[k]) : param[k]);
    }
  } else {
    s = param || "";
  }

  if (typeof s === "string") {
    url += url.indexOf("?") > 0 ? "&".concat(s) : "?".concat(s);
  }

  return [url, s];
};
/**
 * @description 建立通讯链接
 */


var connect = function connect(type, url, reqData, reqType, callback, processBack) {
  var xhr = new XMLHttpRequest();

  if (reqType) {
    xhr.responseType = 'arraybuffer';
  }
  /**
   * @description 链接被终止
   */


  xhr.onabort = function () {
    callback(new RsError("abort"));
  };

  xhr.onerror = function (ev) {
    callback(new RsError("error status: ".concat(xhr.status, " ").concat(xhr.statusText, ", ").concat(url)));
  };

  xhr.upload.onprogress = function (ev) {
    processBack && processBack(ev);
  };

  xhr.onprogress = function (ev) {};

  xhr.onload = function (ev) {
    if (xhr.status === 300 || xhr.status === 301 || xhr.status === 302 || xhr.status === 303) {
      return callback(new RsError(xhr.getResponseHeader("Location")));
    }

    if (xhr.status !== 200 && xhr.status !== 304) {
      return callback(new RsError("error status: ".concat(xhr.status, " ").concat(xhr.statusText, ", ").concat(url)));
    }

    ; // console.log(xhr.response);
    // console.log(xhr.responseText);

    callback(null, xhr.response || xhr.responseText);
  };

  xhr.open(type, url, true); // if(reqType){
  // xhr.setRequestHeader("accept-encoding", "gzip");
  // }

  xhr.send(reqData);
};
})