define("app/main",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("app/stage");

require("app/rank");

require("app/net");

require("app/widget/button");

require("app/widget/ani");

var _user = _interopRequireDefault(require("app/user"));

var _process = _interopRequireDefault(require("app/process"));

var _connect = _interopRequireDefault(require("libs/ni/connect"));

require("libs/ni/music");

var _scene = _interopRequireDefault(require("libs/ni/scene"));

var _loader = _interopRequireDefault(require("libs/ni/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/****************** 导出 ******************/

/**
 * 游戏主函数
 */
var Main = function Main(cfg) {
  _classCallCheck(this, Main);

  console.log(cfg);

  var app = _scene.default.Application({
    width: cfg.screen.width,
    height: cfg.screen.height,
    antialias: true,
    transparent: false,
    view: window.canvas,
    resolution: 1,
    autoStart: false
  }, cfg);

  _loader.default.add(["app/ui/", "app/cfg/", "audio/", "images/"], function (res) {
    _connect.default.open(cfg, function () {
      _user.default.init();

      _process.default.clear();
    });
  }, _process.default.add()); // console.log(wx.env.USER_DATA_PATH);

};
/****************** 本地 ******************/


exports.default = Main;
})