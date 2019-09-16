define("libs/ni/websocket",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NetError = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @description websocket mod
 */

/****************** 导出 ******************/
var NetError = function NetError(code, reson) {
  _classCallCheck(this, NetError);
};
/**
 * @description 前台通讯模块
 */


exports.NetError = NetError;

var Socket =
/*#__PURE__*/
function () {
  function Socket(url, listener) {
    _classCallCheck(this, Socket);

    this.timeOut = 3000;
    this.socket = void 0;
    this.url = void 0;
    this.listener = void 0;
    this.url = url;
    this.listener = listener;
    this.open();
  }

  _createClass(Socket, [{
    key: "open",
    value: function open() {
      var _this = this;

      this.socket = new WebSocket(this.url);
      setTimeout(function () {
        if (_this.socket.readyState == WebSocket.CONNECTING) {
          _this.listener("open", new NetError(-69, "time out"));
        }
      }, this.timeOut);

      this.socket.onopen = function (event) {
        _this.listener("open", null);
      };

      this.socket.onerror = function (event) {
        _this.listener("error", event);
      };

      this.socket.onmessage = function (event) {
        _this.listener("message", event);
      };

      this.socket.onclose = function (event) {
        _this.listener("close", event);
      };
    }
    /**
     * @description 关闭连接
     * @param code https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     * @param reason 
     */

  }, {
    key: "close",
    value: function close(code, reason) {
      this.socket.close(code, reason);
    }
    /**
     * @description 发送消息
     * @param data USVString || ArrayBuffer || Blob || ArrayBufferView
     *  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     */

  }, {
    key: "send",
    value: function send(data) {
      // console.log(data);
      this.socket.send(data);
    }
    /**
     * @description 重新连接socket
     */

  }, {
    key: "reopen",
    value: function reopen() {
      this.open();
    }
  }]);

  return Socket;
}();

exports.default = Socket;
;
/****************** 本地 ******************/
})