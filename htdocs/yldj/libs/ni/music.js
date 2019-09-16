define("libs/ni/music",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loader = _interopRequireDefault(require("libs/ni/loader"));

var _util = _interopRequireDefault(require("libs/ni/util"));

var _fs = _interopRequireDefault(require("libs/ni/fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导出 ******************/
var Music =
/*#__PURE__*/
function () {
  function Music() {
    _classCallCheck(this, Music);
  }

  _createClass(Music, null, [{
    key: "registMusic",
    //音乐缓存表
    //背景音乐

    /**
     * @description 初始化配置表
     * @param data 配置数据{"audio/xx":decodeAudioData}
     */
    value: function registMusic(data) {
      for (var k in data) {
        if (_util.default.fileSuffix(k) == ".mp3") {
          decodeAudioData(k, data[k]);
          delete data[k];
        }
      }
    }
    /**
     * @description 播放音乐
     */

  }, {
    key: "play",
    value: function play(path, loop) {
      var m = Music.table[path];

      if (loop) {
        m.loop = loop;
        Music.bgm = path;
      }

      m.start();
    }
    /**
     * @description 暂停音乐
     */

  }, {
    key: "stop",
    value: function stop(path) {
      Music.table[path].stop(0);
    }
  }]);

  return Music;
}();
/****************** 本地 ******************/

/**
 * @description 兼容微信
 */


exports.default = Music;
Music.table = {};
Music.bgm = "";

var Source =
/*#__PURE__*/
function () {
  function Source() {
    _classCallCheck(this, Source);

    this.audio = void 0;
    this._buffer = void 0;
    this._loop = void 0;
    this._src = void 0;
    this.audio = window.wx.createInnerAudioContext();
  }

  _createClass(Source, [{
    key: "start",
    value: function start() {
      this.audio.play();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.audio.stop();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.audio.pause();
    }
  }, {
    key: "buffer",
    get: function get() {
      return this._buffer;
    },
    set: function set(val) {
      if (this._buffer === val) {
        return;
      }

      this._buffer = val;
      this.audio.src = val;
    }
  }, {
    key: "loop",
    get: function get() {
      return this._loop;
    },
    set: function set(val) {
      if (this._loop === val) {
        return;
      }

      this._loop = val;

      if (val) {
        this.audio.autoplay = true;
        this.audio.loop = true;
      }
    }
  }]);

  return Source;
}();

var WxAudio =
/*#__PURE__*/
function () {
  function WxAudio() {
    _classCallCheck(this, WxAudio);
  }

  _createClass(WxAudio, [{
    key: "decodeAudioData",
    value: function decodeAudioData(data, callback) {
      callback();
    }
  }, {
    key: "createBufferSource",
    value: function createBufferSource() {
      return new Source();
    }
  }]);

  return WxAudio;
}();

var autioCtx = new (window.AudioContext || window.webkitAudioContext || WxAudio)();
/**
 * @description 解析音乐资源
 * @param k "app/autio/xx.mp3"
 * @param data ArrayBuffer
 */

var decodeAudioData = function decodeAudioData(k, data) {
  autioCtx.decodeAudioData(data, function (buff) {
    var a = autioCtx.createBufferSource();
    a.buffer = buff || _fs.default.fs.createImg(k);
    Music.table[k] = a;
  });
};
/****************** 立即执行 ******************/
//绑定资源监听


_loader.default.addResListener("registMusic", Music.registMusic);
})