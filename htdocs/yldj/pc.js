define("pc",function(require,exports,module){
"use strict";

var _electron = require("electron");

var _fs = _interopRequireDefault(require("libs/ni/fs"));

var _http = _interopRequireDefault(require("libs/ni/http"));

var _main = _interopRequireDefault(require("app/main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cfg = {
  platForm: "pc",
  name: "yldj",
  remote: "https://mgame.xianquyouxi.com",
  screen: {
    _width: 750,
    _height: 1334,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    scale: 1
  },
  debug: false
};

var resetcfg = function resetcfg() {
  var pcCfg = _electron.ipcRenderer.sendSync("request", "getCfg");

  var windowWidth = document.documentElement.clientWidth || document.body.clientWidth,
      windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
  var w,
      h,
      sw = cfg.screen._width / windowWidth,
      sh = cfg.screen._height / windowHeight,
      s = Math.max(sw, sh);
  w = windowWidth * s;
  h = windowHeight * s;
  cfg.screen.width = w;
  cfg.screen.height = h;
  cfg.screen.scale = s;
  cfg.debug = pcCfg.debug;
};

window.onload = function () {
  _http.default.get("".concat(cfg.remote, "/").concat(cfg.name, "/depend.json"), "", "", function (err, data) {
    if (err) {
      return console.log(err);
    }

    resetcfg();
    var depend = JSON.parse(data);

    _fs.default.parseDepend(depend);

    _fs.default.init(cfg, function () {
      new _main.default(cfg);
    });
  });
};
})