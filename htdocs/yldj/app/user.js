define("app/user",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scene = _interopRequireDefault(require("libs/ni/scene"));

var _widget = _interopRequireDefault(require("libs/ni/widget"));

var _fs = _interopRequireDefault(require("libs/ni/fs"));

var _db = _interopRequireDefault(require("libs/ni/db"));

var _connect = _interopRequireDefault(require("libs/ni/connect"));

var _sha = _interopRequireDefault(require("libs/ni/sha512"));

var _appEmitter = require("app/appEmitter");

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
var User =
/*#__PURE__*/
function () {
  function User() {
    _classCallCheck(this, User);
  }

  _createClass(User, null, [{
    key: "init",

    /**
     * @description 平台名 "_default"没有任何平台 "wx"微信小游戏
     */

    /**
     * @description 平台用户信息
     */

    /**
     * @description wx 登录code
     */

    /**
     * @description 用户界面渲染对象
     */

    /**
     * @description 初始化平台授权，不是平台直接走默认登录
     * @param callback 
     */
    value: function init() {
      for (var k in ptFrom) {
        if (ptFrom[k]()) {
          break;
        }
      }

      _appEmitter.AppEmitter.emit("intoMain");

      User.show = _scene.default.open("app-ui-user", _scene.default.root);
    }
    /**
     * @description 微信登录
     */

  }, {
    key: "login_wx",
    value: function login_wx(callback) {
      if (User.info == undefined || !User.code) {
        return;
      }

      _connect.default.request({
        type: "app/wx@login",
        arg: {
          "code": User.code,
          "encrypted": User.info.encryptedData,
          "gamename": _fs.default.appName,
          "iv": User.info.iv
        }
      }, function (data) {
        if (data.err) {
          return console.log(data.err.reson);
        }

        _db.default.data.user.uid = data.ok.uid;
        _db.default.data.user.from = "wx";
        User.info && (_db.default.data.user.info = User.info);
        callback();
      });
    }
  }]);

  return User;
}();
/****************** 本地 ******************/

/**
 * @description 平台授权初始化
 */


exports.default = User;
User.pt = "xianquyouxi";
User.info = void 0;
User.code = void 0;
User.show = void 0;
User.wxButton = void 0;
var ptFrom = {
  wx: function wx() {
    var wx = window.wx,
        createButton = function createButton() {
      if (User.wxButton) {
        User.wxButton.destroy();
      }

      var scale = _scene.default.screen.scale,
          w = Math.floor(386 / scale),
          h = Math.floor(140 / scale);
      User.wxButton = wx.createUserInfoButton({
        type: 'image',
        image: "images/btn.png",
        style: {
          left: wx.getSystemInfoSync().windowWidth / 2 - w / 2,
          bottom: 200 / scale,
          width: w,
          height: h
        }
      });
      User.wxButton.onTap(function (res) {
        if (res.errMsg == "getUserInfo:ok") {
          User.info = res; //清除微信授权按钮

          User.wxButton.destroy();
          User.wxButton = null;
          User.login_wx(loginCallback);
        } else {
          console.log("wx authorize fail");
          initLocal(loginCallback);
        }
      });
    };

    if (!wx) {
      return false;
    }

    User.pt = "wx";
    wx.login({
      success: function success(res) {
        if (res.code) {
          User.code = res.code;
          createButton();
        } else {
          console.log("wx login fail");
        }
      }
    });
    return true;
  }
  /**
   * @description 用户组件
   */

};

var WUser =
/*#__PURE__*/
function (_Widget) {
  _inherits(WUser, _Widget);

  function WUser() {
    _classCallCheck(this, WUser);

    return _possibleConstructorReturn(this, _getPrototypeOf(WUser).apply(this, arguments));
  }

  _createClass(WUser, [{
    key: "added",
    value: function added() {
      var btn = this.elements.get("button_login");
      var wx = window.wx;

      if (wx) {
        btn.alpha = 0;
      }
    }
  }, {
    key: "login",
    value: function login() {
      initLocal(loginCallback);
    }
  }]);

  return WUser;
}(_widget.default);
/**
 * @description 无平台注册
 * @param account 账号
 * @param password 密码
 * @param callback 登录回调
 */


var regist = function regist(account, password, callback) {
  _connect.default.request({
    type: "app/user@regist",
    arg: {
      name: account,
      psw: password,
      from: User.pt,
      gamename: _fs.default.appName
    }
  }, function (data) {
    if (data.err) {
      console.log("regist err::" + data.err.reson);
      return callback(data.err.reson);
    }

    _db.default.data.user.uid = data.ok.uid;
    _db.default.data.user.from = User.pt;
    _db.default.data.user.username = data.ok.username;
    localStorage.setItem("userInfo", "{\"account\":\"".concat(account, "\",\"encryPassword\":\"").concat(password, "\"}"));
    callback();
  });
};
/**
 * @description 无平台登录
 * @param account 账号
 * @param password 密码
 * @param callback 登录回调
 */


var login = function login(account, password, callback) {
  _connect.default.request({
    type: "app/user@login",
    arg: {
      name: account,
      psw: password,
      gamename: _fs.default.appName
    }
  }, function (data) {
    if (data.err) {
      console.log("login err::" + data.err.reson);
      return callback(data.err.reson);
    }

    _db.default.data.user.uid = data.ok.uid;
    _db.default.data.user.from = data.ok.from;
    _db.default.data.user.username = data.ok.username;
    callback();
  });
};
/**
 * @description 登录回调
 * @param err 错误信息
 */


var loginCallback = function loginCallback(err) {
  if (err) {
    return console.log(err);
  }

  _appEmitter.AppEmitter.emit("gameStart");

  _scene.default.remove(User.show);

  User.show = null;
};
/**
 * @description 计算哈希
 */


var caclHash = function caclHash(s, type) {
  var sha512 = new _sha.default("SHA-512", "TEXT");
  sha512.update(s);
  return sha512.getHash(type);
};
/**
 * @description 合并字符串
 */


var blendStrig = function blendStrig(s1, s2) {
  var s = "",
      len = Math.max(s1.length, s2.length);

  for (var i = 0; i < len; i++) {
    s += "".concat(s1[i] || "").concat(s2[i] || "");
  }

  return s;
};
/**
 * @description 密码加密
 */


var encryptPassword = function encryptPassword(ps) {
  var b64 = caclHash(ps, "B64"),
      hex = caclHash(ps, "HEX");
  ps = caclHash(blendStrig(b64.substr(0, b64.length - 2), hex), "B64");
  console.log(b64, hex, ps);
  return ps;
};
/**
 * @description 注册登录
 */


var initLocal = function initLocal(callback) {
  var userInfomation = JSON.parse(localStorage.getItem("userInfo")),
      len = 12; //账号和密码的长度

  if (userInfomation) {
    login(userInfomation.account, userInfomation.encryPassword, function (err) {
      if (err) {
        localStorage.setItem("userInfo", "0");
        return initLocal(callback);
      }

      callback();
    });
  } else {
    userInfomation = {};
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789",
        //账号密码可用字符
    symbol = " `~!@#$%^&*()_+-={}|[]\\:\";'<>?,./"; //密码可用的附加字符

    userInfomation.account = getStr(str, len); //生成账号

    userInfomation.encryPassword = encryptPassword(getStr(str + symbol, len)); //密码加密

    regist(userInfomation.account, userInfomation.encryPassword, callback);
  }
}; //根据给的字符串序列生成随机字符串


var getStr = function getStr(s, len) {
  var rule = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789",
      str = "";
  s = s || rule;
  var strLen = s.length;

  for (var i = 0; i < len; i++) {
    var index = Math.floor(Math.random() * strLen);
    str += s[index];
  }

  return str;
};
/****************** 立即执行 ******************/
//初始化关卡数据库表


_db.default.init("user", {
  uid: 0,
  username: "",
  info: {},
  from: ""
}); //注册组件


_widget.default.registW("app-ui-user", WUser);
})