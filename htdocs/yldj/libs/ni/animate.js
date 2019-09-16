define("libs/ni/animate",function(require,exports,module){
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
var Animate =
/*#__PURE__*/
function () {
  function Animate() {
    _classCallCheck(this, Animate);
  }

  _createClass(Animate, null, [{
    key: "run",

    /**
     * @description 动画处理
     */
    value: function run(arr) {
      for (var i = 0, len = arr.length; i < len; i++) {}
    }
  }, {
    key: "onLoop",
    value: function onLoop(o) {// console.log("onLoop",o);
    }
  }, {
    key: "onComplete",
    value: function onComplete(o) {
      // console.log("onComplete",o);
      if (o.ni.anicallback) {
        o.ni.anicallback("complete");
      }
    }
  }, {
    key: "onFrameChange",
    value: function onFrameChange(o) {
      // console.log("onFrameChange",o);
      var cf = o.currentFrame,
          ani = o.ni.animate.ani,
          rang = o.ni.actions[ani];

      if (!rang) {
        return;
      }

      if (cf < rang[0] || cf > rang[1]) {
        o.gotoAndPlay(rang[0]);
        return;
      }

      if (cf == rang[1]) {
        o.gotoAndPlay(rang[0]);

        if (o.ni.animate.times) {
          if (o.ni.anicallback) {
            o.ni.anicallback("complete");
          }
        }
      }
    }
  }]);

  return Animate;
}();
/****************** 本地 ******************/


exports.default = Animate;
})