define("libs/ni/connect",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _websocket = _interopRequireDefault(require("libs/ni/websocket"));

var _emitter = _interopRequireDefault(require("libs/ni/emitter"));

var _widget = _interopRequireDefault(require("libs/ni/widget"));

var _scene = _interopRequireDefault(require("libs/ni/scene"));

var _base = require("libs/ni/base64");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Status;
/**
 * @description 前台通讯模块
 */

(function (Status) {
  Status[Status["connecting"] = 0] = "connecting";
  Status[Status["opened"] = 1] = "opened";
})(Status || (Status = {}));

var Connect =
/*#__PURE__*/
function () {
  function Connect() {
    _classCallCheck(this, Connect);
  }

  _createClass(Connect, null, [{
    key: "open",

    /**
     * @description 测试接口，供前端测试使用
     */

    /**
     * @description 通讯地址
     */

    /**
     * @description 和后台唯一通讯标识
     */

    /**
     * @description 通讯id
     */

    /**
     * @description 重连定时器
     */

    /**
     * @description socket连接
     */

    /**
     * @description 通讯回调等待列表
     */

    /**
     * @description 后台消息推送监听
     * @param cfg 
     * @param callback 
     */

    /**
     * @description 服务器时间
     */

    /**
     * @description 上次获取服务器时间的本地时间
     */

    /**
     * @description ping服务器间隔时间
     */

    /**
     * @description ping服务器超时时间
     */

    /**
     * @description ping服务器定时器
     */

    /**
     * @description 连接状态
     */

    /**
     * @description 打开链接
     */
    value: function open(cfg, callback) {
      Connect.url = cfg.ws;
      Connect.openBack = callback;
      Connect.socket = new _websocket.default(Connect.url, Connect.listener);

      _scene.default.open("app-ui-connect", _scene.default.root);
    }
    /**
     * @description 向后台发送请求
     * @param param {type:"",arg:{},mid:1}
     * @param callback 请求回调
     */

  }, {
    key: "request",
    value: function request(param, callback) {
      if (Connect.runTest(param, callback)) {
        return;
      }

      param.mid = Connect.mid++;
      Connect.waitBack[param.mid] = new Wait(param.mid, callback);
      Connect.socket.send(blendArg(param)); // Http.request(blendArg(param),param.arg,(err,data)=>{
      //     if(err){
      //         callback({err});
      //     }else{
      //         d = JSON.parse(data);
      //         if(d[""]){
      //             Connect.sessionKey = d[""];
      //         }
      //         callback(d);
      //     }
      // })
    }
    /**
     * @description 向后台发送消息
     * @param param {type:"",arg:{}}
     */

  }, {
    key: "send",
    value: function send(param) {
      Connect.socket.send(blendArg(param));
    }
    /**
     * @description 添加模拟后台数据接口
     * @param type ""
     * @param handler 
     */

  }, {
    key: "setTest",
    value: function setTest(type, handler) {
      Connect.testHandlers[type] = handler;
    }
    /**
     * @description 跑测试接口，如果没有，则往服务器发送
     */

  }, {
    key: "runTest",
    value: function runTest(param, callback) {
      if (Connect.testHandlers[param.type]) {
        setTimeout(function (func, arg, back) {
          return function () {
            func(arg, back);
          };
        }(Connect.testHandlers[param.type], param.arg, callback), 0);
      } else {
        return false;
      }

      return true;
    }
    /**
     * @description 监听websocket
     * @param type open || message || close || error
     * @param event 
     */

  }, {
    key: "listener",
    value: function listener(type, event) {
      switch (type) {
        case "open":
          if (event) {
            return reopen();
          }

          Connect.status = Status.opened;
          WConnect.update();
          ping();
          Connect.openBack();
          console.log("websocket opened!");
          break;

        case "message":
          var msg = JSON.parse(event.data);
          matchHandler(msg);
          break;

        case "close":
          console.error(event);
          Connect.status = Status.connecting;
          WConnect.update();
          clearPing();
          reopen();
          Connect.notify.emit("close");
          break;
      }
    }
  }]);

  return Connect;
}();

exports.default = Connect;
Connect.testHandlers = {};
Connect.url = "";
Connect.sessionKey = "";
Connect.mid = 1;
Connect.reopenTimer = null;
Connect.socket = void 0;
Connect.openBack = void 0;
Connect.waitBack = {};
Connect.notify = new _emitter.default();
Connect.sTime = 0;
Connect.locTime = 0;
Connect.ppSpace = 20 * 1000;
Connect.ppTimeout = 3 * Connect.ppSpace;
Connect.ppTimer = 0;
Connect.status = Status.connecting;
;
/****************** 本地 ******************/
//通讯接口参数

var Wait =
/*#__PURE__*/
function () {
  function Wait(mid, callback) {
    _classCallCheck(this, Wait);

    this.timeout = 30 * 1000;
    this.mid = void 0;
    this.handler = void 0;
    this.timmer = void 0;
    this.mid = mid;
    this.handler = callback;
    this.timmer = setTimeout(function () {
      callback({
        err: "time out"
      });
      delete Connect.waitBack[mid];
    }, this.timeout);
  }

  _createClass(Wait, [{
    key: "clear",
    value: function clear() {
      clearTimeout(this.timmer);
    }
  }]);

  return Wait;
}();
/**
 * @description 用户组件
 */


var WConnect =
/*#__PURE__*/
function (_Widget) {
  _inherits(WConnect, _Widget);

  function WConnect() {
    _classCallCheck(this, WConnect);

    return _possibleConstructorReturn(this, _getPrototypeOf(WConnect).apply(this, arguments));
  }

  _createClass(WConnect, [{
    key: "added",
    value: function added(node) {
      WConnect.node = node;
      node.children[0].ni.left = -node.children[0].width / 2;
      node.children[0].ni.top = -node.children[0].height / 2;

      if (Connect.status == Status.connecting) {
        node.alpha = 1;
      }
    }
  }], [{
    key: "update",
    value: function update() {
      if (Connect.status == Status.connecting) {
        WConnect.node.alpha = 1;
      } else {
        WConnect.node.alpha = 0;
      }
    }
  }]);

  return WConnect;
}(_widget.default);
/**
 * @description 打包即将发送到后台的消息
 * @param param 
 */


WConnect.node = null;

var blendArg = function blendArg(param) {
  var str = "{\"type\":\"".concat(param.type, "\",\"mid\":").concat(param.mid, ",\"arg\":\"").concat(_base.Base64.encode(JSON.stringify(param.arg)), "\"}"); // let str = "",dir = param.type.split("@");
  // str = `${Connect.url}/${dir[0]}?${dir[1]?"@="+dir[1]:""}`;

  return str;
};
/**
 * @description 分发服务器发送的消息
 * @param msg 
 */


var matchHandler = function matchHandler(msg) {
  Connect.locTime = Date.now();
  var mid = msg.mid,
      w;

  if (mid == 0) {
    return Connect.notify.emit(msg.type, msg);
  }

  w = Connect.waitBack[mid];
  delete Connect.waitBack[mid];

  if (!w) {
    return console.error("invalid message which mid is ", mid);
  } // console.log(msg);


  w.handler(msg.data);
  w.clear();
};
/**
 * @description 重连
 */


var reopen = function reopen() {
  if (Connect.reopenTimer) {
    return;
  }

  Connect.reopenTimer = setTimeout(function () {
    Connect.socket.reopen();
    Connect.reopenTimer = null;
  }, 10000);
};
/**
 * @description ping服务器
 */


var ping = function ping() {
  Connect.ppTimer = setTimeout(function () {
    Connect.request({
      type: "app/client@stime",
      arg: {}
    }, function (msg) {
      if (msg.err) {
        if (Date.now() - Connect.locTime > Connect.ppTimeout) {
          Connect.ppTimer = null;
          Connect.socket.close(-69, "time out");
          return;
        }
      } else {
        Connect.locTime = Date.now();
        Connect.sTime = msg.ok.sTime;
      }

      ping();
    });
  }, Connect.ppSpace);
};
/**
 * @description 清除ping定时器
 */


var clearPing = function clearPing() {
  if (!Connect.ppTimer) {
    return;
  }

  clearTimeout(Connect.ppTimer);
  Connect.ppTimer = null;
}; // ================================== 立即执行


_widget.default.registW("app-ui-connect", WConnect);
})