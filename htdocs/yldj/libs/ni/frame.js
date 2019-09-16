define("libs/ni/frame",function(require,exports,module){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************** 导入 ******************/

/****************** 导出 ******************/
var Frame =
/*#__PURE__*/
function () {
  function Frame() {
    _classCallCheck(this, Frame);
  }

  _createClass(Frame, null, [{
    key: "add",

    /**
     * @description 添加帧回调
     * @param frameCall 帧回调函数
     * @param interval 回调间隔（ms）
     * @param isOnce 是否一次性，是则执行一次后删除
     * @returns {} 帧对象，存储于帧列表，如果自身需要手动删除，则用户应该抓住它
     */
    value: function add(frameCall, interval, isOnce) {
      var f = {
        frameCall: frameCall,
        interval: interval,
        last: Date.now(),
        once: isOnce,
        delete: false
      };
      Frame.list.push(f);
      return f;
    }
    /**
     * @description 删除某个帧回调函数
     * @param f 由Frame.add返回的帧对象
     */

  }, {
    key: "delete",
    value: function _delete(f) {
      var i = Frame.list.indexOf(f);

      if (i < 0) {
        return console.warn("Don't have the frameCallback ", f);
      }

      Frame.list.splice(i, 1);
      f.delete = true;
    }
    /**
     * @description 执行帧列表
     */

  }, {
    key: "loop",
    value: function loop() {
      var i = Frame.list.length - 1,
          f,
          t = Date.now();

      for (i; i >= 0; i--) {
        f = Frame.list[i];

        if (!f.interval || t - f.last >= f.interval) {
          f.frameCall();

          if (Date.now() - t > 5) {// console.log("slow task ",Date.now() - t,f.frameCall);
          }

          f.last = t;

          if (f.once) {
            Frame.delete(f);
          }
        }

        t = Date.now();
      }
    }
  }]);

  return Frame;
}();
/****************** 本地 ******************/


exports.default = Frame;
Frame.list = [];

var requestFrameImpl = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  return setTimeout(callback, 0.5 + 1000 / 60 << 0);
}; // 获取raf取消函数，处理兼容性


var cancelFrameImpl = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || clearTimeout;

var ticker = function ticker() {
  requestFrameImpl(ticker);
  Frame.loop();
};
/****************** 立即执行 ******************/


requestFrameImpl(ticker);
})